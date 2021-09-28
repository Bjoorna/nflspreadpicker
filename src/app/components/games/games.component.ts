import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  car: Team = {
    name: "Carolina Panthers",
    abbreviation: "Car",
    imageurl: "http://loodibee.com/wp-content/uploads/nfl-carolina-panthers-team-logo-2.png"
  };
  
  atl: Team = {
    name: "Atlanta Falcons",
    abbreviation: "Atl",
    imageurl:"http://loodibee.com/wp-content/uploads/nfl-atlanta-falcons-team-logo-2.png"
  }


  game1: Game = {
    hometeam: this.car,
    awayteam: this.atl,
    week: 6,
    spread: "a-4"
  } 

  game2: Game = {
    hometeam: this.atl,
    awayteam: this.car,
    week: 6,
    spread: "a-4"

  }

  games: Game[] = [this.game1, this.game2, this.game1, this.game2, this.game1, this.game2, this.game1, this.game2];

  isAdmin: boolean = true;

  constructor() { }

  ngOnInit(): void {

    this.getFavorite(this.game1);
  }

  getFavorite(game: Game): string[]{
    
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

}


export interface Game{
  hometeam: Team;
  awayteam: Team;
  week: number;
  spread: string;
}

export interface Team{
  name: string;
  abbreviation: string;
  imageurl: string;
}


// spread is in the form of a string 
// string is two values separated by a '-' 
// first is 'a' or 'h'
// second is a number value