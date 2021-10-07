import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {


  // tempFriends = ["Marcus", "Sigurd", "Jone"];

  searchResult: IFriendList[] = [];

  searchControl = new FormControl('');

  searchList!: Observable<IFriendList[]>;

  newFriend!: IFriendList;

  isLoading: boolean = false;

  // searchString: string = "";
  constructor(private userService: UserService) { 
    // this.searchList = this.friendControl.valueChanges.pipe(startWith(''),
    //   map(name => name ? this._filterNames(name) : this.searchResult.slice()));
  }

  ngOnInit(): void {
    //   this.friendControl.valueChanges.subscribe(value => {
    //     if(value == ''){
    //       this.searchResult = [];
    //     }else{
    //       this.userService.searchForUsers(value).subscribe(resData => {
    //         if(resData.payload){
    //           console.log(resData.payload);
    //           let list: IFriendList[] = [];
    //           for(let person of resData.payload){
    //             let posFriend: IFriendList = {name: person.name, _id: person._id};
    //             list.push(posFriend);
    //             this.searchResult = list;
    //           }
    //         }
    //       });
    //     }  
    // })
  }


  searchForUsers(): void{
    this.isLoading = true;
    this.userService.searchForUsers(this.searchControl.value).subscribe(resData => {
      if(resData.payload){
        this.searchResult = resData.payload as IFriendList[];
        this.isLoading = false;
      }
    })
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

