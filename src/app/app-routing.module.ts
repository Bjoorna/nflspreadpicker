import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminpanelComponent } from './components/adminpanel/adminpanel.component';
import { AuthComponent } from './components/auth/auth.component';
import { AddgameComponent } from './components/games/addgame/addgame.component';
import { GamesComponent } from './components/games/games.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'games', component: GamesComponent},
  {path: 'addgame', component: AddgameComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'user', component: UserComponent},
  {path: 'admin', component: AdminpanelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
