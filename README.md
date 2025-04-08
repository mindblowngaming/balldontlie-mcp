# Balldontlie MCP Server

An MCP Server implementation that integrates the [Balldontlie API](https://www.balldontlie.io/), to provide information about players, teams and games for the NBA, NFL and MLB.

## Tools

- **get_teams**

  - Get a list of teams for the NBA, NFL or MLB
  - Inputs:
    - `league` (enum ['NBA', 'NFL', 'MLB']): The sports league to get teams for

- **get_players**

  - Gets a list of players for the NBA, NFL or MLB
  - Inputs:
    - `league` (enum ['NBA', 'NFL', 'MLB']): The sports league to get players for
    - `firstName` (string, optional): The first name of the player to search for
    - `lastName` (string, optional): The last name of the player to search for
    - `cursor` (number, optional): Cursor for pagination

- **get_games**

  - Gets the list of games for the NBA, NFL or MLB
  - Inputs:
    - `league` (enum ['NBA', 'NFL', 'MLB']): The sports league to get games for
    - `dates` (string[], optional): Get games for specific dates, format: YYYY-MM-DD
    - `teamIds` (string[], optional): Get games for specific games
    - `cursor` (number, optional): Cursor for pagination

- **get_game**

  - Get a specific game from one of the following leagues NBA, MLB, NFL
  - Inputs:
      - `league` (enum ['NBA', 'NFL', 'MLB']): The sports league to get the game for
      - `gameId` (number): The id of the game from the get_games tool

## Configuration

### Getting an API Key

1. Sign up for account at [Balldontlie.io](https://www.balldontlie.io/)
2. The free plan is enough for this MCP Server

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcp-servers": {
    "brave-search": {
      "command": "npx",
      "args": [
        "-y",
        "balldontlie-mcp"
      ],
      "env": {
        "BALLDONTLIE_API_KEY": "YOUR API KEY HERE"
      }
    }
  }
}
```

## Disclaimer

This library is not officially associated with balldontlie.io. It is a third-party implementation of the balldontlie api with a MCP Server.