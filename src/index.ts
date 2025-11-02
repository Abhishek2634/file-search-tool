#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

// Define the search parameters schema
const SearchFileArgsSchema = z.object({
  keyword: z.string().describe("The keyword to search for in the file"),
  filePath: z.string().describe("Path to the file to search in"),
  caseSensitive: z.boolean().optional().default(false).describe("Whether the search should be case-sensitive")
});

class FileSearchServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "file-search-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "search_file",
          description: "Search for a keyword in a specified file and return matching lines with line numbers",
          inputSchema: {
            type: "object",
            properties: {
              keyword: {
                type: "string",
                description: "The keyword to search for in the file"
              },
              filePath: {
                type: "string",
                description: "Path to the file to search in"
              },
              caseSensitive: {
                type: "boolean",
                description: "Whether the search should be case-sensitive (default: false)",
                default: false
              }
            },
            required: ["keyword", "filePath"]
          }
        }
      ]
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === "search_file") {
        return await this.handleSearchFile(request.params.arguments);
      }
      throw new Error(`Unknown tool: ${request.params.name}`);
    });
  }

  private async handleSearchFile(args: unknown) {
    const { keyword, filePath, caseSensitive } = SearchFileArgsSchema.parse(args);

    try {
      // Read the file
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      
      // Search for keyword
      const searchTerm = caseSensitive ? keyword : keyword.toLowerCase();
      const results: Array<{ lineNumber: number; content: string }> = [];

      lines.forEach((line, index) => {
        const searchLine = caseSensitive ? line : line.toLowerCase();
        if (searchLine.includes(searchTerm)) {
          results.push({
            lineNumber: index + 1,
            content: line.trim()
          });
        }
      });

      // Format results
      if (results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No matches found for "${keyword}" in ${filePath}`
            }
          ]
        };
      }

      const resultText = results.map(r => 
        `Line ${r.lineNumber}: ${r.content}`
      ).join('\n');

      return {
        content: [
          {
            type: "text",
            text: `Found ${results.length} match(es) for "${keyword}" in ${filePath}:\n\n${resultText}`
          }
        ]
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
      throw error;
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("File Search MCP Server running on stdio");
  }
}

const server = new FileSearchServer();
server.run().catch(console.error);
