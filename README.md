# MCP File Search Server

A Model Context Protocol (MCP) server that provides a file search tool for searching keywords within text files. Built with TypeScript and Node.js.

## Description

This MCP server implements a `search_file` tool that allows AI applications to search for specific keywords in files and returns matching lines with their line numbers. The server supports both case-sensitive and case-insensitive search options.

## Features

- 🔍 Search for keywords in text files
- 📍 Returns matching lines with line numbers
- 🔤 Case-sensitive and case-insensitive search modes
- ⚡ Built with TypeScript for type safety
- 🔌 Compatible with MCP protocol

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
    git clone <your-repository-url>
    cd mcp-file-search
```

2. Install dependencies:
```bash
    npm install
```

3. Build the project:
```bash
    npm run build
```


## Usage

### Running the Server

The server uses STDIO transport for communication:
node build/index.js


### Testing with MCP Inspector

1. Start the MCP Inspector:
```bash
    npx @modelcontextprotocol/inspector node build/index.js
```


2. Open the provided URL in your browser

3. Click "Connect" to connect to the server

4. Navigate to the "Tools" tab to see the `search_file` tool

5. Test the tool with these parameters:
   - **keyword**: `"MCP"` (or any search term)
   - **filePath**: `"sample.txt"` (or path to any text file)
   - **caseSensitive**: `false` (optional, defaults to false)

### Tool Parameters

The `search_file` tool accepts the following parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| keyword | string | Yes | The keyword to search for in the file |
| filePath | string | Yes | Path to the file to search in (absolute or relative) |
| caseSensitive | boolean | No | Whether the search should be case-sensitive (default: false) |



## Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and recompile
- `npm run inspector` - Run MCP Inspector for testing

### Building from Source
```bash
    npm run build
```
The compiled output will be in the `build/` directory.



## Dependencies
- `@modelcontextprotocol/sdk` - MCP SDK for building servers
- `zod` - Schema validation
- `typescript` - TypeScript compiler


## Error Handling

The server includes error handling for:
- File not found errors
- Invalid file paths
- Read permission errors
- Invalid parameter types


## Troubleshooting

## Troubleshooting

**Issue**: `ENOENT: no such file or directory`

**Solution**: Ensure you're using the correct file path. Try using absolute paths or ensure the file exists in the specified location.

**Issue**: Connection error in MCP Inspector

**Solution**: Make sure the server is built (`npm run build`) and the path in Arguments field is `build/index.js`.

**Issue**: `Command not found`

**Solution**: Run the inspector from the project directory using `npx @modelcontextprotocol/inspector node build/index.js`.



### Made with ❤️ by Abhishek.