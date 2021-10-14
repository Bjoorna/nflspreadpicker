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
import { INewTempPrediction } from './gamecard/gamecard.component';

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

  gameView: IGameView[] = [];

  userPredictions: Map<string, IPrediction> = new Map<string, IPrediction>();
  isSettingPrediction: boolean = false;

  teamFilter!: string | null;

  weekFilter!: number | null;
  defaultWeek: number = 6;

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
    for(let game of this.gameView){
      game.isUpdating = !game.isUpdating;
    }
  }

  getGamePrediction(gameID: string): IPrediction | null {
    let pred = this.userPredictions.get(gameID);
    if(pred){
      return pred;
    }else{
      return null;
    }
  }

  updatePrediction(pred: INewTempPrediction): void {
      // if predicted on before
    if(this.userPredictions.has(pred.oldPred.game)){
      let existingPred = this.userPredictions.get(pred.oldPred.game);
      console.log(existingPred);
      if(existingPred){
        // se if user wants to cancel prediction
        if(existingPred.spreadPrediction == pred.newSpreadPred){
          this.userService.deletePrediction(existingPred).subscribe(resData => {
            if(resData.payload){
              this.userPredictions.delete(resData.payload.game);
            }
          });
        }else{ // user wants to change the prediction
          existingPred.spreadPrediction = pred.newSpreadPred;
          this.userService.updatePrediction(existingPred).subscribe(resData => {
            if(resData.payload){
              this.userPredictions.set(pred.oldPred.game, resData.payload);
            }
          });
        }
      }
    }
  }

  setPrediction(pred: IPrediction): void{
    // set new prediction
    this.userService.setPrediction(this.userID, pred).subscribe(resData => {
      console.log(resData);
      if(resData.payload){
        this.populatePredictionMap(resData.payload);
      }
    });
  }

  getUserPredictions(): void{
    if(this.userID){
      this.userService.getUserPredictionsFromServer(this.userID).subscribe(result => {
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
        this.gameView = this.populateGameView(this.games)
        this.isLoading = false;
      });
    }else if(team){
      this.gameService.getGamesByTeam(team).subscribe(resData => {
        this.games = resData.payload;
        this.gameView = this.populateGameView(this.games)
        this.isLoading = false;
      });
    }else{
      this.gameService.getGamesByWeek(this.defaultWeek).subscribe(result => {
        this.games = result.payload;
        this.gameView = this.populateGameView(this.games)
        this.isLoading = false;
      });
    }
  }

  populateGameView(games: IGame[]): IGameView[]{
    let gameViewList = []
    for(let game of games){
      const newGame: IGameView = {
        gameID: game._id,
        isUpdating: false
      } 
      gameViewList.push(newGame);
    }
    console.log(gameViewList);

    return gameViewList;
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

export interface IGameView{
  gameID: string, 
  isUpdating: boolean
}