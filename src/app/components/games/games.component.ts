import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/services/team.service';
import { IGame } from 'src/app/shared/interfaces/game.interface';
import { IServerResponse } from 'src/app/shared/interfaces/serverresponse.interface';
import { ITeam } from 'src/app/shared/interfaces/team.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {


  userIsAdmin: boolean = true;

  // car: ITeam = {
  //   name: "Carolina Panthers",
  //   abbreviation: "Car",
  //   imageurl: "http://loodibee.com/wp-content/uploads/nfl-carolina-panthers-team-logo-2.png",
  //   record: "4-3"
  // };
  
  // atl: ITeam = {
  //   name: "Atlanta Falcons",
  //   abbreviation: "Atl",
  //   imageurl:"http://loodibee.com/wp-content/uploads/nfl-atlanta-falcons-team-logo-2.png",
  //   record: "4-3"
  // }


  // game1: Game = {
  //   hometeam: this.car,
  //   awayteam: this.atl,
  //   week: 6,
  //   spread: "a-4"
  // } 

  // game2: Game = {
  //   hometeam: this.atl,
  //   awayteam: this.car,
  //   week: 6,
  //   spread: "a-4"
  // }

  weeks: Array<number> = [...Array(18).keys() ];

  teams: ITeam[] = [];

  games: IGame[] = [];

  isAdmin: boolean = true;

  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
    this.teamService.teams.subscribe(teams => {
      this.teams = teams;
    });

    this.getTeams();
  }

  getFavorite(game: IGame): string[]{
    
    let favoriteteam = game.spread.split("-")[0];
    let returnValue = ["", ""];
    if(favoriteteam === "a"){
      returnValue[0] = game.awayteam.abbreviation;
      returnValue[1] = game.spread.split("-")[1]
    }else if(favoriteteam === "h"){
      returnValue[0] = game.hometeam.abbreviation;
      returnValue[1] = game.spread.split("-")[1]
    }
    return returnValue;
  }

  generateGames(amount: number): void{

    // this.getTeamsFromServer();

    for(let i=0; i<amount; i++){
      let hometeam = this.teams[Math.floor(Math.random() * 32)];
      let awayteam = this.teams[Math.floor(Math.random() * 32)];

      let newGame: IGame = {
        hometeam: hometeam,
        awayteam: awayteam,
        week: 8,
        spread: "h-7.5"
      };

      this.games.push(newGame);
    }

  }

  getTeams(): void{
    this.teamService.getTeamsfromServer();
  }


  // getTeamsFromServer(): void{
    
  //   const localhost = environment.localhost + "/team";
  //   this.http.get<IServerResponse>(localhost).subscribe(test => {

  //     if(test.payload){
  //       let teams: ITeam[] = test.payload as ITeam[];
  //       console.log(teams);
  //       teams.sort();
  //       this.teams = teams;
  //     }

  //   })

  // }

}






// spread is in the form of a string 
// string is two values separated by a '-' 
// first is 'a' or 'h'
// second is a number value