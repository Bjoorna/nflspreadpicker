import { ITeam } from "./team.interface";

export interface IGame{
    hometeam: ITeam;
    awayteam: ITeam;
    week: number;
    spread: string;
  }
  