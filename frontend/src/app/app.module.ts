import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddCardComponent } from './components/add-card/add-card.component';
import { CardDetailsComponent } from './components/card-details/card-details.component';
import { AdminComponent } from './components/admin/admin.component';
import { GamesListComponent } from './components/games-list/games-list.component';
import { AddGameComponent } from './components/add-game/add-game.component';
import { GameDetailsComponent } from './components/game-details/game-details.component';

@NgModule({
  declarations: [
    AppComponent,
    AddCardComponent,
    CardDetailsComponent,
    AdminComponent,
    GamesListComponent,
    AddGameComponent,
    GameDetailsComponent
  ],
  imports: [
  BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
  exports: [MatInputModule],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
