import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.scss']
})
export class AdminpanelComponent implements OnInit {

  currentWeek: number = 0;
  weeks: Array<number> = [...Array(18).keys() ];
  newWeekControl!: number | null;


  constructor(private adminService: AdminService,
              private router: Router ) { }

  ngOnInit(): void {
    this.adminService.getGameWeek().subscribe(resData => {
      if(resData.payload){
        this.currentWeek = resData.payload;
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
    })

  }

}
