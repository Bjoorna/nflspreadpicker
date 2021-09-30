import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
// import { IUser } from "../models/user/user.model";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from 'rxjs/operators'
// import { ILoginModel } from "../models/user/login.model";
// import { ClientUser } from "../models/user/clientuser.model";
import {environment} from 'src/environments/environment';


// import jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })

export class AuthService{

    constructor(private http: HttpClient, private router: Router){}


    signup(user: IUser): Observable<ISignupResponse>{
        const server = environment.server + '/auth/signup';
        const localhost = environment.localhost + '/auth/signup';

        console.log(localhost);

        return this.http.post<ISignupResponse>(localhost, user);
    }

    login(user: ILoginUser): Observable<ISignupResponse>{

        const server = environment.server + '/auth/login';
        const localhost = environment.localhost + '/auth/login';


        return this.http.post<ISignupResponse>(localhost, user);
    }


}

export interface IUser{
    name: string, 
    email: string,
    password?: string
}

export interface ILoginUser{
    email: string,
    password: string
}

export interface ISignupResponse{
    token?: string,
    error?: string
}