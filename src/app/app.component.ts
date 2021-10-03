import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'picker';

  authUser!: Subscription;

  constructor(private authService: AuthService, 
    private userService: UserService, 
    ){}

    ngOnInit(): void{

      this.authService.autoLogin();
    }


}
