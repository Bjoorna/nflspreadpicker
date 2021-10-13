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

  newSpread: FormControl = new FormControl(null);
  newFavorite: FormControl = new FormControl(null);

  newHometeamResult = new FormControl(null);
  newAwayteamResult = new FormControl(null);

  constructor(
    private gameService: GameService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.gameService.getGameByID(this.gameID).subscribe(resData => {
      if(resData.payload){
        this.game = resData.payload;
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

  toggleSpread(){
    this.updateSpread = !this.updateSpread;
  }

  toggleResult(){
    this.updateResult = !this.updateResult;
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
    console.log(this.newHometeamResult.value);
    console.log(this.newAwayteamResult.value);

    let newGameData: IGame = this.game;

    newGameData.result = [this.newHometeamResult.value, this.newAwayteamResult.value]

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


}

export interface INewTempPrediction{
  oldPred: IPrediction,
  newSpreadPred: number
}