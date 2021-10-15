import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';
import { IGame } from 'src/app/shared/interfaces/game.interface';
import { ITeam } from 'src/app/shared/interfaces/team.interface';
import { IPrediction } from '../games.component';

@Component({
  selector: 'app-gamecard',
  templateUrl: './gamecard.component.html',
  styleUrls: ['./gamecard.component.scss']
})
export class GamecardComponent implements OnInit, OnChanges {



  @Input() gameID: string = "";
  @Input() gamePrediction!: IPrediction | null;
  @Input() isUpdating: boolean = false;
  @Output() setNewPredictionEvent = new EventEmitter<IPrediction>();
  @Output() updateExistingPredictionEvent = new EventEmitter<INewTempPrediction>();
  @Output() reloadGames = new EventEmitter<void>();


  game!: IGame;
  isAdmin: boolean = true;
  isSettingPrediction: boolean = false;

  updateSpread: boolean = false;
  updateResult: boolean = false;
  updateWinnerPred: boolean = false;

  newSpread: FormControl = new FormControl(null);
  newFavorite: FormControl = new FormControl(null);
  winnerPred: FormControl = new FormControl(null);

  newHometeamResult = new FormControl(null);
  newAwayteamResult = new FormControl(null);

  gameDate!: Date;

  constructor(
    private gameService: GameService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.gameService.getGameByID(this.gameID).subscribe(resData => {
      if(resData.payload){
        this.game = resData.payload;

        if(this.game.time){
          this.gameDate = new Date(this.game.time);
        }
        // console.log(this.game);
      }
    });

    // console.log(this.gamePrediction);
  }

  ngOnChanges(changes: SimpleChanges): void{
  }


  setPrediction(spreadPrediction: number):void{
    this.isSettingPrediction = true;
    // game is predicted on
    if(this.gamePrediction){
      let newPred: INewTempPrediction = {
        oldPred: this.gamePrediction,
        newSpreadPred: spreadPrediction
      } 
      // this.gamePrediction.spreadPrediction = spreadPrediction;
      this.updateExistingPredictionEvent.emit(newPred);
    }
    else{ // no predictions for this game
      let newPred: IPrediction = {
        game: this.gameID,
        spreadPrediction: spreadPrediction
      };
      this.setNewPredictionEvent.emit(newPred);
    }
  }

  getGameDay(day: Date): string{
    const date = new Date(day);
    const utcDay = day.getUTCDay();
    let dayString: string;
    switch (utcDay){
      case 0:{
        dayString = "Sun"
        break;
      }
      case 1:{
        dayString = "Mon"
        break;
      }case 2:{
        dayString = "Tue"

        break;
      }case 3:{
        dayString = "Wed"

        break;
      }case 4:{
        dayString = "Thu"

        break;
      }case 5:{
        dayString = "Fri"

        break;
      }case 6:{
        dayString = "Sat"
        break;
      }default: {
        dayString = "Sun"
      }
    }
    return dayString;
  }

  getGameHour(day: Date): number{
    const date = new Date(day);

    let dayString = day.toDateString().split(" ")[1];
    console.log(dayString[1]);

    return date.getUTCHours();
  }

  toggleSpread(){
    this.updateSpread = !this.updateSpread;
    if(this.updateResult){
      this.updateResult = false;
    }
  }

  toggleResult(){
    this.updateResult = !this.updateResult;
    if(this.updateSpread){
      this.updateSpread = false;
    }
  }

  onUpdateSpread(){
    let newGameData: IGame = this.game;

    newGameData.spread = this.newSpread.value;
    newGameData.favorite = this.newFavorite.value;
    this.isUpdating = true
    
    this.gameService.updateGame(this.gameID, newGameData).subscribe(resData => {
      if(resData.payload){
        this.game = resData.payload;
        this.isUpdating = false;
        this.updateSpread = false;
      }
    });
  }

  onUpdateResult(){
    let newGameData: IGame = this.game;

    newGameData.result = [this.newHometeamResult.value, this.newAwayteamResult.value]
    newGameData.winnerprediction = this.winnerPred.value;
    this.isUpdating = true; {
      this.gameService.updateGame(this.gameID, newGameData).subscribe(resData => {
        if(resData.payload){
          this.game = resData.payload;
          this.isUpdating = false;
          this.updateResult = false;
        }
      });
    }
  }

  canPlacePrediction(): boolean{
    let now = new Date().getTime();
    if(this.gameDate){
      if(now > this.gameDate.getTime()){
        return false;
      }else{
        return true;
      }
    }
    return false;
  }

  deleteGame(): void{
    this.gameService.deleteGame(this.gameID).subscribe(resData => {
      this.reloadGames.emit();
    })
  }

  seeIfPredicted(spreadPrediction: number): boolean{
    if(this.gamePrediction){
        if(this.gamePrediction.spreadPrediction == spreadPrediction){
          return true;
        }
        else{
          return false;
        }
    }else{
      return false;
    }
  }

  isTeamFavorite(team: ITeam, game: IGame): boolean{
    if(team.name == game.favorite?.name){
      return true;
    }else{
      return false;
    }
  }

  isPredictionCorrect(): boolean{
    if(this.gamePrediction && this.game.winnerprediction){
      if(this.gamePrediction.spreadPrediction == this.game.winnerprediction){
        return true;
      }
      return false;
    }
    return false;
  }

  // didCoverSpread(isFavorite: boolean, result: number[]): boolean{
    
  //   return false;
  // }

  // testPred(): any{
  //   let userPred;
    

  //   if(this.gamePrediction){
  //     userPred = this.gamePrediction.spreadPrediction;
  //   }

  //   if(userPred = 1){
  //     // is hometeam favorite
  //     if(this.isTeamFavorite(this.game.hometeam, this.game)){

  //     }

  //   }

  // }

  // isPredictionCorrect(): boolean{
  //   // const hasResult = this.game.result.length > 0;
  //   // let difference; 
  //   // if(hasResult){
  //   //   difference = Math.abs(this.game.result[0] - this.game.result[1]);
  //   //   console.log(difference);
  //   // }
  //   // let userSpreadPrediction;
  //   // let gameFavorite;

  //   // let winner: ITeam;

  //   // if(this.game.result[0] > this.game.result[1]){
  //   //   winner = this.game.hometeam;
  //   // }else{
  //   //   winner = this.game.awayteam;
  //   // }

  //   // let isWinnerFavorite = this.isTeamFavorite(winner, this.game);

  //   // let didCoverSpread

  //   // if(isWinnerFavorite){

  //   // }

  //   // get prediction
  //   // 


  //   // let favorite = this.game.favorite;
  //   // if(hasResult){
  //   //   difference = Math.abs(this.game.result[0] - this.game.result[1]);
  //   //   console.log(difference);

  //   //   if(this.game.result[0]>this.game.result[1]){
  //   //     winner = 1;
  //   //   }else if(this.game.result[0]<this.game.result[1]){
  //   //     winner = 2;
  //   //   }else{
  //   //     winner = 0;
  //   //   }
  //   // }

  //   // if(this.game.favorite?.name == this.game.hometeam.name){
  //   //   gameFavorite = 1;
  //   // }else{
  //   //   gameFavorite = 2;
  //   // }

  //   // if(this.gamePrediction){
  //   //   console.log(this.gamePrediction);
  //   //   userSpreadPrediction = this.gamePrediction.spreadPrediction;
  //   // }
  //   return false;
  // }

}

export interface INewTempPrediction{
  oldPred: IPrediction,
  newSpreadPred: number
}