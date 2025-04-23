import type { LeagueEnum } from './index.js';

export function getWeeklySchedulePrompt(league: LeagueEnum, startDate: string, endDate: string) {
  return `You are an AI assistant tasked with generate a weekly schedule for a given league. The schedule should include the games that are played during the week.`
    + `\nThe league is ${league}.`
    + `\nThe start date is ${startDate}.`
    + `\nThe end date is ${endDate}.`
    + `\nYou have available to you the following tool to geth the schedule:`
    + `\n'get_games': Gets the list of games from one of the following leagues NBA, MLB, NFL`
    + `\nCreate a weekly calendar schedule for the given league, use an artifact to do this`
    + `\nThe schedule should in the following:`
    + `\n1. The schedule should have a dropdown for the user to select the team they want to see the schedule for.`
    + `\n2. When the user selects a team, the schedule should update to show only the games for that team.`
    + `\n3. Each day in the calendar should show the selected team's game and their opponent and where the game is being played.`;
};
