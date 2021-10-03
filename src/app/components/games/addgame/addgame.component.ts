import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { TeamService } from 'src/app/services/team.service';
import { IGame } from 'src/app/shared/interfaces/game.interface';
import { ITeam } from 'src/app/shared/interfaces/team.interface';

@Component({
  selector: 'app-addgame',
  templateUrl: './addgame.component.html',
  styleUrls: ['./addgame.component.scss']
})
export class AddgameComponent implements OnInit {

  gameForm!: FormGroup;

  teamsSub!: Subscription;

  teams: ITeam[] = [];


  throwawaylist: string[] = ["HomeTeam", "AwayTeam"];

  constructor(private teamService: TeamService,
              private gameService: GameService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
    this.teamsSub = this.teamService.teams.subscribe(teams => {
      this.teams = teams;
    });
    this.teamService.getTeamsfromServer();
  }

  initForm(): void{
    this.gameForm = new FormGroup({
      "hometeam": new FormControl(null, [Validators.required]),
      "awayteam": new FormControl(null, [Validators.required]),
      "week": new FormControl(null, [Validators.required]),
      "favorite": new FormControl(null),
      "spread": new FormControl(null),
      "hscore": new FormControl(null),
      "ascore": new FormControl(null)
    });
  }

  getTeam(isHome: string): ITeam{
    let values = this.gameForm.value;
    let team: ITeam;
    console.log(values);
    if(isHome == "HomeTeam"){
      team = values.hometeam;
    }else{
      team = values.awayteam;
    }
    return team;
  }

  compileForm(): IGame | boolean{
    let values = this.gameForm.value;
    console.log(values);
    let hteam: ITeam | undefined = this.teams.find(team => team.name == values.hometeam);
    let ateam: ITeam | undefined = this.teams.find(team => team.name == values.awayteam);

    if(hteam == undefined || ateam == undefined){
      console.log("There was an error with assigning teams.");
      return false;
    }

    let newGame: IGame = {
      _id: "",
      hometeam: hteam,
      awayteam: ateam,
      week: values.week,
      spread: null,
      result: [],
      favorite: null
    }

    newGame.spread = 0;

    if(values.spread != null){
      // spread = values.spread;
      newGame.spread = values.spread;

    }
    if(values.favorite != null){
      let fteam = this.teams.find(team => team.name == values.favorite)
      if(fteam != undefined){
        newGame.favorite = fteam;
      }
    }
    if(values.hscore != null && values.ascore != null){
      newGame.result = [values.hscore, values.ascore];
    }
    console.log(newGame);

    return newGame;
  }

  onAddGame(): void{
    const newGame = this.compileForm();

    if(newGame == false || newGame == true){
      return;
    }

    this.gameService.addGame(newGame).subscribe(result => {
      console.log(result);
      this.router.navigate(['games']);

    })
  }

}
