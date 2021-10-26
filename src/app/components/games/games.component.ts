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
import { AdminService } from 'src/app/services/admin.service';

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

  onWeek: number = 0;
  defaultWeek: number = 7;

  isLoading: boolean = false;

  constructor(
      private teamService: TeamService,
      private gameService: GameService,
      private userService: UserService,
      private authService: AuthService,
      private adminService: AdminService) { }


  ngOnInit(): void {
    this.getTeams();
    this.adminService.getGameWeek().subscribe(resData => {
      if(resData.payload){
        this.onWeek = resData.payload;
        this.getGames(this.onWeek);
      }
    });

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
    let wantedTeam = this.teams.find(team => team.name == this.teamFilter);
    if(wantedTeam){
      this.getGames(undefined, wantedTeam);
    }
  }

  weekFilterChange(event: any){
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

  // testbutton(): void{
  //   this.adminService.setGameWeek(8).subscribe(resData => {
  //     console.log(resData);
  //   });
  // }

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
    return gameViewList;
  }

  deleteGame(gameid: string): void {
    this.gameService.deleteGame(gameid).subscribe(resData => {
      if(resData.message){
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