import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import process from 'node:process';
import { BalldontlieAPI } from '@balldontlie/sdk';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import z from 'zod';

const server = new McpServer(
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

server.tool(
  'get_teams',
  'Gets the list of team from one of the following leagues EPL, NBA, MLB, NFL',
  {
    league: z.enum(['NBA', 'MLB', 'NFL']),
  },
  async ({ league }) => {
    switch (league) {
      case 'NBA': {
        const nbaTeams = await api.nba.getTeams();
        const text = nbaTeams.data.map((team) => {
          return `Full Name: ${team.full_name}\n`
            + `Name: ${team.name}\n`
            + `Abbreviation: ${team.abbreviation}\n`
            + `City: ${team.city}\n`
            + `Conference: ${team.conference}\n`
            + `Division: ${team.division}\n`;
        }).join('\n-----\n');
        return { content: [{ type: 'text', text }] };
      }

      case 'MLB': {
        const mlbTeams = await api.mlb.getTeams();
        const text = mlbTeams.data.map((team) => {
          return `Display Name: ${team.display_name}\n`
            + `Name: ${team.name}\n`
            + `Abbreviation: ${team.abbreviation}\n`
            + `Location: ${team.location}\n`
            + `League: ${team.league}\n`
            + `Division: ${team.division}\n`
            + `Slug: ${team.slug}\n`;
        }).join('\n-----\n'); ;
        return { content: [{ type: 'text', text }] };
      }

      case 'NFL': {
        const nlfTeams = await api.nfl.getTeams();
        const text = nlfTeams.data.map((team) => {
          return `Name: ${team.name}\n`
            + `Abbreviation: ${team.abbreviation}\n`
            + `Full Name: ${team.full_name}\n`
            + `Location: ${team.location}\n`
            + `Conference: ${team.conference}\n`
            + `Division: ${team.division}\n`;
        }).join('\n-----\n');
        return { content: [{ type: 'text', text }] };
      }

      default: {
        return {
          content: [{ type: 'text', text: `Unknown league: ${league}` }],
          isError: true,
        };
      }
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  log('Balldontlie MCP Server is running with Stdio transport');
}

function log(
  message: string,
  level: 'error' | 'debug' | 'info' | 'notice' | 'warning' | 'critical' | 'alert' | 'emergency' = 'info',
) {
  server.server.sendLoggingMessage({
    level,
    message,
  });
}

main().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
