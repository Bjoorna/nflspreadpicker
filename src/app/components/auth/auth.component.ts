import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ILoginUser, IUser } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  loginForm!: FormGroup;
  signupForm!: FormGroup;

  isLoginMode: boolean = true;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void{
    this.signupForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });

    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });
  }

  toggleMode(): void{
    this.isLoginMode = !this.isLoginMode;
  }

  onSignUp(): void{
    const formValues = this.signupForm.value;

    let newUser: IUser = {
      name: formValues.name,
      email: formValues.email,
      password: formValues.password
    };

    console.log(newUser);
    this.authService.signup(newUser).subscribe(serverResponse => {
    });
  }

  onLogin(): void{
    const formValues = this.loginForm.value;

    let loginUser: ILoginUser = {
      email: formValues.email,
      password: formValues.password
    };

    this.authService.login(loginUser).subscribe( serverResponse => {
      console.log(serverResponse);
      if(serverResponse.token){
        this.router.navigate(['games']);
      }

    })


  }

}
