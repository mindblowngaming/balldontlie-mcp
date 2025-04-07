import process from 'node:process';
import { BalldontlieAPI } from '@balldontlie/sdk';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  {
    name: `Balldontlie MCP Server`,
    version: `0.5.0`,
  },
  {
    capabilities: {
      logging: {},
      tools: {},
    },
  },
);

const BALLDONTLIE_API_KEY = process.env.BALLDONTLIE_API_KEY;
if (!BALLDONTLIE_API_KEY) {
  console.error('Error: BALLDONTLIE_API_KEY environment variable is not set.');
  log('Error: BALLDONTLIE_API_KEY environment variable is not set.', 'error');
  process.exit(1);
}

const api = new BalldontlieAPI({ apiKey: BALLDONTLIE_API_KEY });

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  log('Server is running with Stdio transport');
}

function log(
  message: string,
  level: 'error' | 'debug' | 'info' | 'notice' | 'warning' | 'critical' | 'alert' | 'emergency' = 'info',
) {
  server.sendLoggingMessage({
    level,
    message,
  });
}

main().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
