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


@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {


  userIsAdmin: boolean = true;

  weeks: Array<number> = [...Array(18).keys() ];

  teams: ITeam[] = [];

  games: IGame[] = [];

  isAdmin: boolean = true;

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
    })
  }

  teamFilterChange(event: any){
    // console.log(event.value as ITeam);
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
    console.log("hello?")
    let userValue = this.authService.authCredentials.getValue();
    console.log(userValue);
    if(userValue){
      this.userService.getUser(userValue.userID).subscribe(test => {
        console.log(test);
      });
    }
    
  }

}
