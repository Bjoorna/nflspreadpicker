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
import { IPrediction } from "../components/games/games.component";

@Injectable({ providedIn: 'root' })

export class UserService{

    authSub!: Subscription;
    // userID: string = "";

    // userPredictions: Map<string, IPrediction> = new Map<string, IPrediction>();

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

    searchForUsers(value: string): Observable<IServerResponse> {
        const localhost = environment.localhost + "user";
        const server = environment.server + "user"

        let uri = server + "/find";

        let search = {name: value};

        return this.http.post(uri, search);

    }

    addFriend(friendID: string, userID: string): Observable<IServerResponse>{
        const localhost = environment.localhost + "user";
        const server = environment.server + "user"

        let uri = server + "/addfriend";

        const addFriendPackage = {friendID: friendID, userID: userID};

        return this.http.post(uri, addFriendPackage);
    }

    getFriends(userID: string): Observable<IServerResponse> {
        const localhost = environment.localhost + "user";
        const server = environment.server + "user"

        let uri = server + "/" + userID + "/friends";

        return this.http.get(uri);
    }

    

    getUserPredictionsFromServer(userID: string): Observable<IServerResponse>{
        const localhost = environment.localhost + "user";
        const server = environment.server + "user"

        const uri = server + "/predictions/" + userID;

        return this.http.get(uri);

        // return this.http.get(uri).pipe(tap(resData => {
        //     if(resData.payload){
        //         let preds: IPrediction[] = resData.payload;
        //         for(let pred of preds){
        //             if(!this.userPredictions.has(pred.game)){
        //                 this.userPredictions.set(pred.game, pred);
        //             }
        //         }
        //     }
        // }));
    }

    // getGamePrediction(gameID: string): IPrediction | null{
    //     if(this.userPredictions.size > 0){
    //         let pred = this.userPredictions.get(gameID); 
    //         if(pred != undefined){
    //             return pred;
    //         }else{
    //             return null;
    //         }
    //     }else{
    //         return null;
    //     }

    // }

    setPrediction(userID: string, prediction: IPrediction): Observable<IServerResponse>{

        const localhost = environment.localhost + "user";
        const server = environment.server + "user"

        const uri = server + "/predictions/" + userID;

        return this.http.post(uri, prediction);
    }

    updatePrediction(prediction: IPrediction): Observable<IServerResponse> {

        const localhost = environment.localhost + "user";
        const server = environment.server + "user"

        const uri = server + "/predictions/" + prediction._id;

        return this.http.put(uri, prediction);
    }

    deletePrediction(prediction: IPrediction): Observable<IServerResponse> {
        const localhost = environment.localhost + "user";
        const server = environment.server + "user"

        const uri = server + "/predictions/" + prediction._id;

        return this.http.delete(uri);
    }

}