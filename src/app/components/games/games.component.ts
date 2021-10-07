import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter} from '@angular/core';
import { TeamService } from 'src/app/services/team.service';
import { IGame } from 'src/app/shared/interfaces/game.interface';
import { IServerResponse } from 'src/app/shared/interfaces/serverresponse.interface';
import { ITeam } from 'src/app/shared/interfaces/team.interface';
import { environment } from 'src/environments/environment';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  isAdmin: boolean = false;

  isLoggedIn: boolean = false; 
  authUser!: Subscription;
  userID!: string;

  weeks: Array<number> = [...Array(18).keys() ];

  teams: ITeam[] = [];

  games: IGame[] = [];

  userPredictions: Map<string, IPrediction> = new Map<string, IPrediction>();
  isSettingPrediction: boolean = false;

  teamFilter!: string | null;

  weekFilter!: number | null;
  defaultWeek: number = 5;

  isLoading: boolean = false;

  constructor(
      private teamService: TeamService,
      private gameService: GameService,
      private userService: UserService,
      private authService: AuthService) { }


  ngOnInit(): void {
    this.teamService.teams.subscribe(teams => {
      this.teams = teams;
    });

    this.getTeams();

    this.getGames();

    this.authUser = this.authService.authCredentials.subscribe(user => {
      if(user != null){
        this.isLoggedIn = true;
        this.userID = user.userID;
        this.isAdmin = user.isAdmin;
        this.getUserPredictions();
      }
      if(user == null){
        this.isLoggedIn = false;
      }
    });
  }

  teamFilterChange(event: any){
    console.log(this.teamFilter);
    
    let wantedTeam = this.teams.find(team => team.name == this.teamFilter);
    console.log(wantedTeam);
    if(wantedTeam){
      this.getGames(undefined, wantedTeam);
    }
  }

  weekFilterChange(event: any){
    console.log(this.weekFilter);
    if(this.weekFilter){
      this.getGames(this.weekFilter);
      this.teamFilter = null;
    }
  }

  resetFilters(): void{
    this.teamFilter = null;
    this.weekFilter = null;
    this.getGames(this.defaultWeek);
  }

  isTeamFavorite(team: ITeam, game: IGame): boolean{
    if(team.name == game.favorite?.name){
      return true;
    }else{
      return false;
    }
  }

  hasFavorite(game: IGame): boolean{
    if(game.favorite == null){
      return false;
    }
    return true;
  }

  getTeams(): void{
    this.teamService.getTeamsfromServer();
  }

  testbutton(): void{
    // if(this.userPredicitons.length > 0){
    //   // console.log(this.userPredicitons);
    //   console.log(this.games);

    //   this.userPredicitons.map(pred => {
    //     console.log(pred);
    //   })
    // }
  }
  
  seeIfPredicted(gameid: string, spreadPrediction: number): boolean{
    if(this.userPredictions.has(gameid)){
      if(this.userPredictions.get(gameid)?.spreadPrediction == spreadPrediction){
        return true;
      }
    }
    return false;
  }

  setPrediction(gameid: string, spreadPrediction: number): void {
    this.isSettingPrediction = true;

    // check if game is predicted on before
    if(this.userPredictions.has(gameid)){
      let existingPred = this.userPredictions.get(gameid);
      if(existingPred){
        // see if user wants to cancel prediction
        if(existingPred.spreadPrediction == spreadPrediction){
          this.userService.deletePrediction(existingPred).subscribe(resData => {
            if(resData.payload){
              this.userPredictions.delete(resData.payload.game);
            }
            this.isSettingPrediction = false;
          });
        }
        // set new prediction
        else{
          existingPred.spreadPrediction = spreadPrediction;
          this.userService.updatePrediction(existingPred).subscribe(resData => {
            console.log(resData);
            if(resData.payload){
              this.userPredictions.set(gameid, resData.payload);
              this.isSettingPrediction = false;
            }
          });
        }
      }
    }
    else{ // user have not predicted on this game yet
      let newPred: IPrediction = {
        game: gameid,
        spreadPrediction: spreadPrediction
      };
      this.userService.setPrediction(this.userID, newPred).subscribe(result => {
        console.log(result);
        if(result.payload){
          this.populatePredictionMap(result.payload);
          this.isSettingPrediction = false;
        }
      });
    }
  }

  getUserPredictions(): void{
    if(this.userID){
      this.userService.getUserPrediction(this.userID).subscribe(result => {
        let preds: IPrediction[] = result.payload;
        
        this.populatePredictionMap(preds);
      });
    }
  }
  
  populatePredictionMap(preds: IPrediction[]): void{
    for(let pred of preds){
      if(!this.userPredictions.has(pred.game)){
        this.userPredictions.set(pred.game, pred);
      }
    }
  }

  getGames(week?: number, team?: ITeam): void{
    this.isLoading = true;

    if(week){
      this.gameService.getGamesByWeek(week).subscribe(result => {
        this.games = result.payload;
        this.isLoading = false;
      });
    }else if(team){
      this.gameService.getGamesByTeam(team).subscribe(resData => {
        this.games = resData.payload;
        this.isLoading = false;
      });
    }else{
      this.gameService.getGamesByWeek(this.defaultWeek).subscribe(result => {
        this.games = result.payload;
        this.isLoading = false;
      });
    }
    
  }

  deleteGame(gameid: string): void {
    console.log(gameid);
    this.gameService.deleteGame(gameid).subscribe(resData => {
      if(resData.message){
        console.log(resData.message);
        this.getGames();
      }
    })
  }
}



export interface IPrediction{
  _id?: string;
  game: string;
  spreadPrediction: number;
  resultPrediciton?: Array<number>;
}