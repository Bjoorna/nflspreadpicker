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


    // teams: ITeam[] = []

    teams: BehaviorSubject<ITeam[]> =  new BehaviorSubject(Array<ITeam>());

    constructor(private http: HttpClient){}


    getTeamsfromServer(): void{
        const localhost = environment.localhost + "team";
        const server = environment.server + "team"

        if(this.teams.value.length > 0){
            return;
        }
        this.http.get<IServerResponse>(server).subscribe(result => {
            if(result.error){
                console.log(result.error);
            }else{
                this.teams.next(result.payload as ITeam[]);
            }
        });
    }
}
