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

server.tool(
  `get_players`,
  `Gets the list of players from one of the following leagues NBA, MLB, NFL`,
  {
    league: z.enum(['NBA', 'MLB', 'NFL']),
    firstName: z.string().optional().describe('First name of the player to search for, optional'),
    lastName: z.string().optional().describe('Last name of the player to search for, optional'),
    cursor: z.number().optional().describe('Cursor for pagination, the value should be next_cursor from previous call of get_players tool, optional'),
  },
  async ({ league, firstName = undefined, lastName = undefined, cursor = undefined }) => {
    switch (league) {
      case 'NBA': {
        const nbaPlayers = await api.nba.getPlayers({
          first_name: firstName,
          last_name: lastName,
          cursor,
        });
        const text = nbaPlayers.data.map((player) => {
          return `ID: ${player.id}\n`
            + `First Name: ${player.first_name}\n`
            + `Last Name: ${player.last_name}\n`
            + `Position: ${player.position}\n`
            + `Height: ${player.height}\n`
            + `Weight: ${player.weight}\n`
            + `Jersey Number: ${player.jersey_number}\n`
            + `College: ${player.college}\n`
            + `Country: ${player.country}\n`
            + `Draft Year: ${player.draft_year}\n`
            + `Draft Round: ${player.draft_round}\n`
            + `Draft Number: ${player.draft_number}\n`
            + `Team ID: ${player.team.id}\n`
            + `Team Name: ${player.team.name}\n`;
        }).join('\n-----\n');
        let finalText = text;
        if (nbaPlayers.meta?.next_cursor) {
          finalText += `\n\nPagination Information:\nnext_cursor: ${nbaPlayers.meta.next_cursor}`;
        }
        return { content: [{ type: 'text', text: finalText }] };
      }

      case 'MLB': {
        const mlbPlayers = await api.mlb.getPlayers({
          first_name: firstName,
          last_name: lastName,
          cursor,
        });
        const text = mlbPlayers.data.map((player) => {
          return `ID: ${player.id}\n`
            + `First Name: ${player.first_name}\n`
            + `Last Name: ${player.last_name}\n`
            + `Full Name: ${player.full_name}\n`
            + `Debut Year: ${player.debut_year}\n`
            + `Jersey: ${player.jersey}\n`
            + `College: ${player.college}\n`
            + `Position: ${player.position}\n`
            + `Active: ${player.active}\n`
            + `Birth Place: ${player.birth_place}\n`
            + `Date of Birth: ${player.dob}\n`
            + `Age: ${player.age}\n`
            + `Height: ${player.height}\n`
            + `Weight: ${player.weight}\n`
            + `Draft: ${player.draft}\n`
            + `Bats/Throws: ${player.bats_throws}\n`
            + `Team ID: ${player.team.id}\n`
            + `Team Name: ${player.team.name}\n`;
        }).join('\n-----\n');
        let finalText = text;
        if (mlbPlayers.meta?.next_cursor) {
          finalText += `\n\nPagination Information:\nnext_cursor: ${mlbPlayers.meta.next_cursor}`;
        }
        return { content: [{ type: 'text', text: finalText }] };
      }

      case 'NFL': {
        const nflPlayers = await api.nfl.getPlayers({
          first_name: firstName,
          last_name: lastName,
          cursor,
        });
        const text = nflPlayers.data.map((player) => {
          return `ID: ${player.id}\n`
            + `First Name: ${player.first_name}\n`
            + `Last Name: ${player.last_name}\n`
            + `Position: ${player.position}\n`
            + `Position Abbreviation: ${player.position_abbreviation}\n`
            + `Height: ${player.height}\n`
            + `Weight: ${player.weight}\n`
            + `Jersey Number: ${player.jersey_number}\n`
            + `College: ${player.college}\n`
            + `Experience: ${player.experience}\n`
            + `Age: ${player.age}\n`
          + `Team ID: ${player.team.id}\n`
          + `Team Name: ${player.team.name}\n`
          + `Team Location: ${player.team.location}\n`
          + `Team Abbreviation: ${player.team.abbreviation}\n`
          + `Team Conference: ${player.team.conference}\n`
          + `Team Division: ${player.team.division}\n`;
        }).join('\n-----\n');
        let finalText = text;
        if (nflPlayers.meta?.next_cursor) {
          finalText += `\n\nPagination Information:\nnext_cursor: ${nflPlayers.meta.next_cursor}`;
        }
        return { content: [{ type: 'text', text: finalText }] };
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
