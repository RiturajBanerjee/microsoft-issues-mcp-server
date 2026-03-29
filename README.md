# Microsoft Issues MCP Server

An Azure Function-based Model Context Protocol (MCP) server that provides AI assistants with tools to fetch and summarize GitHub issues and Stack Overflow questions related to Microsoft Teams and developer resources.

## Overview

This project implements an MCP server hosted on Azure Functions that exposes two powerful tools for retrieving and analyzing community issues and discussions:

- **GitHub Issues Tool** - Fetches the latest open issues from the [MicrosoftDocs/msteams-docs](https://github.com/MicrosoftDocs/msteams-docs) repository
- **Stack Overflow Questions Tool** - Retrieves recent Stack Overflow questions tagged with `microsoft-teams`

By integrating this MCP server, AI assistants can access real-time information about ongoing issues, community questions, and documentation needs, enabling more informed and contextually aware responses.

## What is MCP?

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open protocol that standardizes how AI models can interact with external tools and data sources. MCP servers like this one expose tools that applications can call to perform specific actions or retrieve information.

## Features

### GitHub Issues Tool
- Retrieves up to 10 latest open GitHub issues from MicrosoftDocs/msteams-docs
- Returns formatted issue summaries including:
  - Issue title and body (truncated)
  - Author and creation date
  - Applied labels
  - Direct link to the issue

### Stack Overflow Questions Tool
- Fetches up to 10 latest Stack Overflow questions tagged `microsoft-teams`
- Returns formatted question summaries including:
  - Question title
  - Author and creation date
  - Answer count and score
  - Direct link to the question

## Prerequisites

- **Node.js** - v18 or higher
- **Azure Functions Core Tools** - v4.x or higher ([install](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local))
- **TypeScript** - v4.9 or higher
- **npm** - v9 or higher

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RiturajBanerjee/microsoft-issues-mcp-server.git
   cd microsoft-issues-mcp-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the TypeScript:**
   ```bash
   npm run build
   ```

## Configuration


Currently, the tools use public APIs (GitHub and Stack Overflow) that don't require authentication for basic read access.

## Running Locally

1. **Start the local Azure Functions runtime:**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:7071` by default.

2. **Test the tools:**

   Once running, you can make requests to the MCP tools. The exact request format depends on how your MCP client is configured, but the tools can accept a `count` parameter (1-10) to specify the number of results to return.

### Development Mode

For development with automatic recompilation:

```bash
npm run watch
```

This will monitor TypeScript files and recompile on changes.

## Project Structure

```
microsoft-issues-mcp-server/
├── src/
│   ├── index.ts                 # Azure Functions app setup
│   └── functions/
│       ├── githubmcptrigger.ts  # GitHub Issues MCP tool
│       └── stackoverflowmcptrigger.ts  # Stack Overflow MCP tool
├── host.json                    # Azure Functions configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## Tool Specifications

### GitHub Issues Tool

**Tool Name:** `github-issues`

**Parameters:**
- `count` (number, 1-10): Number of latest GitHub issues to retrieve (default: unspecified, max: 10)

**Response:** Formatted string containing GitHub issue summaries

**Example Usage:**
```
Request count: 5
Response: **Top 5 GitHub Issues from MicrosoftDocs/msteams-docs**
[Issue details here...]
```

### Stack Overflow Questions Tool

**Tool Name:** `stackoverflow-questions`

**Parameters:**
- `count` (number, 1-10): Number of latest Stack Overflow questions to retrieve (default: unspecified, max: 10)

**Response:** Formatted string containing Stack Overflow question summaries

**Example Usage:**
```
Request count: 5
Response: **Top 5 Stack Overflow Questions Tagged 'microsoft-teams'**
[Question details here...]
```

## Technologies Used

- **Azure Functions** - Serverless compute for hosting the MCP server
- **Model Context Protocol SDK** - Standard protocol for tool implementation
- **TypeScript** - Type-safe JavaScript development
- **Zod** - TypeScript-first schema validation
- **Node Fetch** - HTTP client for API requests

## Deployment

### Deploy to Azure

1. **Create an Azure Function App:**
   ```bash
   az functionapp create --resource-group <resource-group> \
     --consumption-plan-location <location> \
     --runtime node --runtime-version 20 \
     --functions-version 4 \
     --name <function-app-name>
   ```

2. **Deploy the code:**
   ```bash
   func azure functionapp publish <function-app-name>
   ```

For detailed Azure deployment instructions, see the [Azure Functions documentation](https://learn.microsoft.com/en-us/azure/azure-functions/).

## Usage

This MCP server is designed to be used by AI assistants and applications that support the Model Context Protocol. Integration depends on your specific MCP client implementation.

### Example Integration

When configured with an MCP-compatible client, you can query issues and community discussions:

```
"What are the latest GitHub issues in the Teams documentation?"
→ Client calls: github-issues tool with count=5
→ Server fetches and returns latest 5 issues
→ Assistant processes results and provides answer
```

## Error Handling

The tools include comprehensive error handling:

- **API failures** - Returns descriptive error messages
- **Invalid parameters** - Validates input using Zod schemas
- **No results** - Gracefully returns "not found" messages
- **Network errors** - Logs and returns error details

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch TypeScript files and recompile on changes
- `npm run clean` - Remove compiled output
- `npm run prestart` - Clean and build before starting
- `npm start` - Start local Azure Functions runtime
- `npm run test` - Run tests (placeholder)

## API Rate Limits

- **GitHub API** - 60 requests/hour (unauthenticated), 5,000 requests/hour (authenticated)
- **Stack Overflow API** - 300 requests/day per IP address

For production use with high traffic, consider implementing authentication to increase rate limits.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues to report bugs and suggest features.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Related Projects

- [Brand Perception Analyser](../brand-perception-analyser)
- [Sector News Bot](../AI%20Projects/sector-news-bot)
- [Developer Feedback Aggregator](../AI%20Projects/developer-feedback-aggregator)
- [Community Insights](../community-insights)

## Troubleshooting

### Functions not starting
- Ensure Azure Functions Core Tools are installed: `func --version`
- Check Node.js version: `node --version` (must be 18+)
- Clear node_modules and reinstall: `npm install`

### API errors
- Verify internet connection
- Check current API rate limits
- Review error messages in Azure Functions logs

### Build issues
- Ensure TypeScript is installed: `npm install`
- Try cleaning and rebuilding: `npm run clean && npm run build`

## Support

For issues and questions:
- Check existing GitHub issues
- Review error logs in Azure Portal or local terminal
- Refer to the [MCP documentation](https://modelcontextprotocol.io/)

---

**Last Updated:** March 2026
