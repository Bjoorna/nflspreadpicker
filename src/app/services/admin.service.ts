import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
// import { IUser } from "../models/user/user.model";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from 'rxjs/operators'
import {environment} from 'src/environments/environment';
import { ClientUser } from "../shared/models/clientuser.model";
import { IServerResponse } from "../shared/interfaces/serverresponse.interface";


@Injectable({ providedIn: 'root' })

export class AdminService{

    baseURI: string = "admin";

    authCredentials = new BehaviorSubject<ClientUser | null>(null);

    constructor(private http: HttpClient, private router: Router){}

    getGameWeek(): Observable<IServerResponse> {
        const server = environment.server + this.baseURI + "/game/week";
        const localhost = environment.localhost + this.baseURI + "/game/week";

        return this.http.get(server);
    }

    setGameWeek(week: number): Observable<IServerResponse> {
        const server = environment.server + this.baseURI + "/game/week";
        const localhost = environment.localhost + this.baseURI + "/game/week";

        const newWeek = {week: week};
        console.log(localhost);

        return this.http.put(server, newWeek);
    }


}