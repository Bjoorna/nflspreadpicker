import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  authUser!: Subscription;
  isLoggedIn: boolean = false;


  constructor(private authService: AuthService, private router: Router) { }


  ngOnInit(): void {

    this.authUser = this.authService.authCredentials.subscribe(user => {
      if(user != null){
        this.isLoggedIn = true;
      }
      if(user == null){
        this.isLoggedIn = false;
        this.router.navigate(['auth']);
      }
    });
  }

  onLogout(): void{
    this.authService.logout();
  }

}
