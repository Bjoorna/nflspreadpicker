import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { TeamService } from 'src/app/services/team.service';
import { ITeam } from 'src/app/shared/interfaces/team.interface';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.scss']
})
export class AdminpanelComponent implements OnInit {

  currentWeek: number = 0;
  weeks: Array<number> = [...Array(18).keys() ];
  newWeekControl!: number | null;

  teams!: ITeam[];


  constructor(private adminService: AdminService,
              private router: Router,
              private teamService: TeamService ) { }

  ngOnInit(): void {
    this.adminService.getGameWeek().subscribe(resData => {
      if(resData.payload){
        this.currentWeek = resData.payload;
      }
    });

    this.teamService.getTeamsfromServer().subscribe(resData => {
      if(resData.payload){
        this.teams = resData.payload;
        console.log(this.teams);
      }
    })

  }

  onUpdateWeek(): void{
    console.log(this.newWeekControl);
    if(this.newWeekControl == null || this.newWeekControl == undefined){
      return;
    }
    this.adminService.setGameWeek(this.newWeekControl).subscribe(resData => {
      console.log(resData);
      this.router.navigate(['games']);
    });
  }

  updateRecord(team: ITeam, win: boolean): void{
    if(team.record.length > 0){
      if(win){
        team.record[0] += 1;
      }else{
        team.record[1] += 1;
      }
    }else{
      team.record = [0,0];
    }
    
  }

  storeTeamUpdate(team: ITeam): void{
    this.teamService.updateTeam(team).subscribe(resData => {
      console.log(resData);
      if(resData.message){
        this.teamService.getTeamsfromServer().subscribe(resData => {
          if(resData.payload){
            this.teams = resData.payload;
          }
        })
      }
    })
  }
}


