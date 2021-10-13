import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  // TEST TEMP
  large: boolean = false;


  @Input() gameID: string = "";
  @Input() gamePrediction!: IPrediction | null;
  @Input() isUpdating: boolean = false;
  @Output() setNewPredictionEvent = new EventEmitter<IPrediction>();
  @Output() updateExistingPredictionEvent = new EventEmitter<INewTempPrediction>();
  // @Output() setPredictionEvent = new EventEmitter<number, string>();


  game!: IGame;
  isAdmin: boolean = true;
  isSettingPrediction: boolean = false;

  updateSpread: boolean = false;
  updateResult: boolean = false;

  newSpread: FormControl = new FormControl(null);
  newFavorite: FormControl = new FormControl(null);

  // gamePrediction!: IPrediction;

  constructor(
    private gameService: GameService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.gameService.getGameByID(this.gameID).subscribe(resData => {
      if(resData.payload){
        this.game = resData.payload;
      }
    });

    // console.log(this.gamePrediction);
  }

  ngOnChanges(changes: SimpleChanges): void{

    console.log(changes);
    // if(changes.isUpdating){
    //   // console.log(changes);
    //   // console.log("ISUPDTATING: " + this.isUpdating)
    //   // // this.testupdate = this.isUpdating;
    // }
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

  toggleLarge(){
    this.large = !this.large;
  }

  toggleSpread(){
    this.updateSpread = !this.updateSpread;
  }

  toggleResult(){
    this.updateResult = !this.updateResult;
  }

  onUpdateSpread(){
    console.log(this.newSpread.value);
    console.log(this.newFavorite.value);
  }

  // setPrediction(gameid: string, spreadPrediction: number): void {
  //   this.isSettingPrediction = true;

  //   // check if game is predicted on before
  //   if(this.userPredictions.has(gameid)){
  //     let existingPred = this.userPredictions.get(gameid);
  //     if(existingPred){
  //       // see if user wants to cancel prediction
  //       if(existingPred.spreadPrediction == spreadPrediction){
  //         this.userService.deletePrediction(existingPred).subscribe(resData => {
  //           if(resData.payload){
  //             this.userPredictions.delete(resData.payload.game);
  //           }
  //           this.isSettingPrediction = false;
  //         });
  //       }
  //       // set new prediction
  //       else{
  //         existingPred.spreadPrediction = spreadPrediction;
  //         this.userService.updatePrediction(existingPred).subscribe(resData => {
  //           console.log(resData);
  //           if(resData.payload){
  //             this.userPredictions.set(gameid, resData.payload);
  //             this.isSettingPrediction = false;
  //           }
  //         });
  //       }
  //     }
  //   }
  //   else{ // user have not predicted on this game yet
  //     let newPred: IPrediction = {
  //       game: gameid,
  //       spreadPrediction: spreadPrediction
  //     };
  //     this.userService.setPrediction(this.userID, newPred).subscribe(result => {
  //       console.log(result);
  //       if(result.payload){
  //         this.populatePredictionMap(result.payload);
  //         this.isSettingPrediction = false;
  //       }
  //     });
  //   }
  // }

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