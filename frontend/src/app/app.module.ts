import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TutorialsListComponent } from './components/tutorials-list/tutorials-list.component';
import { AddCardComponent } from './components/add-card/add-card.component';
import { CardDetailsComponent } from './components/card-details/card-details.component';
import { AdminComponent } from './components/admin/admin.component';
import { GamesListComponent } from './components/games-list/games-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TutorialsListComponent,
    AddCardComponent,
    CardDetailsComponent,
    AdminComponent,
    GamesListComponent
  ],
  imports: [
  BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
