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
