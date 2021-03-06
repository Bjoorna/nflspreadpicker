import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from 'rxjs/operators'
import {environment} from 'src/environments/environment';


import { ITeam } from "../shared/interfaces/team.interface";
import { IServerResponse } from "../shared/interfaces/serverresponse.interface";
import { IGame } from "../shared/interfaces/game.interface";
import { IPrediction } from "../components/games/games.component";

@Injectable({ providedIn: 'root' })

export class GameService{


    constructor(private http: HttpClient){}


    addGame(game: IGame): Observable<IServerResponse>{

        const localhost = environment.localhost + "game";
        const server = environment.server + "game"
        return this.http.post(server, game);
    }

    getAllGames(): Observable<IServerResponse>{
        const localhost = environment.localhost + "game";
        const server = environment.server + "game"

        return this.http.get(server);
    }

    getGamesByWeek(week: number): Observable<IServerResponse>{
        const localhost = environment.localhost + "game/week/" + week;
        const server = environment.server + "game/week/" + week;

        return this.http.get(server);
    }

    getGamesByTeam(team: ITeam): Observable<IServerResponse>{
        const localhost = environment.localhost + "game/team";
        const server = environment.server + "game/team";

        return this.http.post(server, team);
    }

    getGameByID(gameID: string): Observable<IServerResponse>{
        const localhost = environment.localhost + "game/" + gameID;
        const server = environment.server + "game/" + gameID;
        return this.http.get(server);
    }

    // updateGame
    updateGame(gameID: string, game: IGame): Observable<IServerResponse>{
        const localhost = environment.localhost + "game/" + gameID;
        const server = environment.server + "game/" + gameID;

        return this.http.put(server, game);

    }

    deleteGame(gameid: string): Observable<IServerResponse> {
        const localhost = environment.localhost + "game/" + gameid;
        const server = environment.server + "game/" + gameid;

        return this.http.delete(server);
    }
}
