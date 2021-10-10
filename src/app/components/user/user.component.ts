import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {


  // tempFriends = ["Marcus", "Sigurd", "Jone"];

  searchResult: IFriendList[] = [];
  friends: IFriendList[] = [];

  searchControl = new FormControl('');

  searchList!: Observable<IFriendList[]>;

  newFriend!: IFriendList;

  isLoading: boolean = false;

  userID: string = "";

  // searchString: string = "";
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): void {
    let authCred = this.authService.authCredentials.getValue();
    if(authCred != null){
      this.userID = authCred.userID;
    }
    if(this.userID != ""){
      this.userService.getFriends(this.userID).subscribe(resData => {
        if(resData.payload){
          this.friends = resData.payload;
          console.log(this.friends);
        }
      })
    }
    
  }
  
  resetSearch(): void{
    this.searchControl.reset('');
    this.searchResult = [];
  }


  // searchForUsers(): void{
  //   this.isLoading = true;
  //   this.userService.searchForUsers(this.searchControl.value).subscribe(resData => {
  //     if(resData.payload){
  //       this.searchResult = resData.payload as IFriendList[];
  //       this.isLoading = false;
  //     }
  //   })
  // }

  onAddFriend(friend: IFriendList): void{
    console.log(friend);
    let userID: string;
    let authCred = this.authService.authCredentials.getValue();
    if(authCred != null){
      userID = authCred.userID;
      console.log(userID);
      this.userService.addFriend(friend._id, userID).subscribe(resData => {
        if(resData.message){
          console.log(resData.message);
          this.router.navigate(['games']);
        }else{
          console.log(resData.error);
          this.router.navigate(['games']);
        }
      });
    }else{
      return;
    }
  }

  // private _filterNames(value: string): IFriendList[]{
  //   const filterValue = value.toLowerCase();

  //   return this.searchResult.filter(friend => friend.name.toLowerCase().includes(filterValue)); 
  // }
}

export interface IFriendList{
  _id: string,
  name: string
}

