import { ITeam } from "./team.interface";

export interface IGame{
    _id: string;
    hometeam: ITeam;
    awayteam: ITeam;
    week: number;
    spread: number | null; 
    favorite: ITeam | null;
    result: Array<number>;
    time?: number;
  }
  