import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, UrlSegment } from '@angular/router';
// import { IUser } from "../models/user/user.model";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { tap } from 'rxjs/operators'
// import { ILoginModel } from "../models/user/login.model";
// import { ClientUser } from "../models/user/clientuser.model";
import {environment} from 'src/environments/environment';
import { ClientUser } from "../shared/models/clientuser.model";

import jwt_decode from 'jwt-decode';
import { AuthService } from "./auth.service";
import { IServerResponse } from "../shared/interfaces/serverresponse.interface";

@Injectable({ providedIn: 'root' })

export class UserService{

    authSub!: Subscription;
    userID: string = "";

    userPredictions: any;

    constructor(
        private http: HttpClient, 
        private router: Router,
        private authService: AuthService){}


    getUser(userid: string): Observable<IServerResponse>{

        const localhost = environment.localhost + "user";
        const server = environment.server + "user"

        let uri = server + "/" + userid;
        console.log(uri);
        return this.http.get<IServerResponse>(uri).pipe(tap(serverResult => {
                console.log(serverResult);
        }));
    }
}