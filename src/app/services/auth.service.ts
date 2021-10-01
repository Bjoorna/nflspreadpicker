import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
// import { IUser } from "../models/user/user.model";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from 'rxjs/operators'
// import { ILoginModel } from "../models/user/login.model";
// import { ClientUser } from "../models/user/clientuser.model";
import {environment} from 'src/environments/environment';
import { ClientUser } from "../shared/models/clientuser.model";


import jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })

export class AuthService{

    authCredentials = new BehaviorSubject<ClientUser | null>(null);

    logoutTimer: any;

    constructor(private http: HttpClient, private router: Router){}


    signup(user: IUser): Observable<ISignupResponse>{
        const server = environment.server + 'auth/signup';
        const localhost = environment.localhost + 'auth/signup';

        return this.http.post<ISignupResponse>(server, user).pipe(tap(resData => {
            if(resData.error){
                return;
            };
            if(resData.token){
                this.handleUserAuth(resData.token);
            }
        }));
    }

    login(user: ILoginUser): Observable<ISignupResponse>{
        const server = environment.server + 'auth/login';
        const localhost = environment.localhost + 'auth/login';
        return this.http.post<ISignupResponse>(server, user).pipe(tap(resData => {
            if(resData.error){
                return;
            };
            if(resData.token){
                this.handleUserAuth(resData.token);
            }
        }));
    }

    private handleUserAuth(token: string){
        // console.log("From userHandle: " + token);
        let decodedToken: TokenInfo = jwt_decode(token);
        // console.log(decodedToken);
        
        // hardcoding a expirationtime of 1 hour
        // TODO change this
        let expirationDate = new Date(Date.now());
        expirationDate.setHours(expirationDate.getHours() + 1);
        const user = new ClientUser(decodedToken.email, decodedToken.userID, decodedToken.isAdmin, token, expirationDate);
        this.authCredentials.next(user);
        this.autoLogout(3600);
        localStorage.setItem("user", JSON.stringify(user));
    }

    autoLogout(time: number): void{
        let millisec = time * 1000;
        this.logoutTimer = setTimeout(() => {
            this.logout()
        }, (millisec));
    }

    logout(){
        this.authCredentials.next(null);
        this.router.navigate(['']);
        localStorage.removeItem('user');
    }

    getAuthToken(): string {
        if(this.authCredentials == null){
            return '';
        }
        
        let usertap = this.authCredentials.getValue();
        if(!usertap){
            return '';
        }

        const token = usertap.token;
        if(token == null){
            return '';
        }else{
            return token;
        }
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

export interface TokenInfo{
    email: string,
    userID: string,
    isAdmin: boolean,
    exp: number,
    iat: number
}
