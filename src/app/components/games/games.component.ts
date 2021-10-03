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
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {


  isAdmin: boolean = true;

  isLoggedIn: boolean = false; 
  authUser!: Subscription;
  userID!: string;

  weeks: Array<number> = [...Array(18).keys() ];

  teams: ITeam[] = [];

  games: IGame[] = [];

  // userPredicitons: IPrediction[] = [];

  userPredictions: Map<string, IPrediction> = new Map<string, IPrediction>();
  isSettingPrediction: boolean = false;

  teamFilter!: string | null;

  weekFilter!: number | null;

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

    this.gameService.getGamesByWeek(4).subscribe(result => {
      this.games = result.payload;
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
    console.log(this.teamFilter);
    
    let wantedTeam = this.teams.find(team => team.name == this.teamFilter);
    console.log(wantedTeam);
    if(wantedTeam){
      this.gameService.getGamesByTeam(wantedTeam).subscribe(resData => {
        this.games = resData.payload;
        console.log(resData);
      });
    }
  }

  weekFilterChange(event: any){
    console.log(this.weekFilter);
    if(this.weekFilter){
      this.gameService.getGamesByWeek(this.weekFilter).subscribe(resData => {
        console.log(resData);
        this.games = resData.payload;
        this.teamFilter = null;
      });
    }
  }

  resetFilters(): void{
    this.teamFilter = null;
    this.weekFilter = null;

    this.gameService.getGamesByWeek(4).subscribe(result => {
      this.games = result.payload;
    })
  }

  printTime(event: string){
    console.log(event);
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
    for(let prediction of this.userPredictions){
      if(gameid == prediction[0]){
        if(prediction[1].spreadPrediction == spreadPrediction){
          return true;
        }else{
          return false;
        }
      }
    }
    return false;
  }

  setPrediction(gameid: string, spreadPrediction: number): void {
    // check if game is predicted on before
    if(this.userPredictions.has(gameid)){
      console.log(this.userPredictions.get(gameid)?.spreadPrediction);
      console.log("PREDICTED");
    }else{ // user have not predicted on this game yet
      let newPred: IPrediction = {
        game: gameid,
        spreadPrediction: spreadPrediction
      };
      this.isSettingPrediction = true;
      this.userService.setPrediction(this.userID, newPred).subscribe(result => {
        console.log(result);
        if(result.payload){
          this.populatePredictionMap(result.payload)
          this.getGames();
        }
        this.isSettingPrediction = true;
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

  getGames(): void{
    this.gameService.getGamesByWeek(4).subscribe(result => {
      this.games = result.payload;
    });
  }
}



export interface IPrediction{
  game: string;
  spreadPrediction: number;
  resultPrediciton?: Array<number>;
}