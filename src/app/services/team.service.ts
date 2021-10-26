import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from 'rxjs/operators'
import {environment} from 'src/environments/environment';


import { ITeam } from "../shared/interfaces/team.interface";
import { IServerResponse } from "../shared/interfaces/serverresponse.interface";
import { ThisReceiver } from "@angular/compiler";

@Injectable({ providedIn: 'root' })

export class TeamService{

    constructor(private http: HttpClient){}

    getTeamsfromServer(): Observable<IServerResponse>{
        const localhost = environment.localhost + "team";
        const server = environment.server + "team"

        return this.http.get(server);
    }

    updateTeam(team: ITeam): Observable<IServerResponse>{
        
        const localhost = environment.localhost + "team/" + team._id;
        const server = environment.server + "team/" + team._id;

        return this.http.put(server, team);

    }
}
