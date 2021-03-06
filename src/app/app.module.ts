import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { GamesComponent } from './components/games/games.component';
import { AuthComponent } from './components/auth/auth.component'; 
import { ToolbarComponent } from './components/toolbar/toolbar.component'; 
import { AddgameComponent } from './components/games/addgame/addgame.component';
import { AuthInterceptor } from './components/auth/auth-interceptor';
import { UserComponent } from './components/user/user.component';
import { GamecardComponent } from './components/games/gamecard/gamecard.component';
import { AdminpanelComponent } from './components/adminpanel/adminpanel.component';


import {MatButtonModule} from '@angular/material/button'; 
import {MatIconModule} from '@angular/material/icon'; 
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatDividerModule} from '@angular/material/divider'; 
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select'; 
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core';
// import {MatMomentDateModule} from '@angular/material/material-moment-adapter';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 
import {MatProgressBarModule} from '@angular/material/progress-bar'; 
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatTooltipModule} from '@angular/material/tooltip'; 
import {MatExpansionModule} from '@angular/material/expansion'; 
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GamesComponent,
    AuthComponent,
    ToolbarComponent,
    AddgameComponent,
    UserComponent,
    GamecardComponent,
    AdminpanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // NoopAnimationsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatDividerModule,
    MatInputModule,
    HttpClientModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    [NgxMaterialTimepickerModule],
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  providers: [MatDatepickerModule,
    {provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
