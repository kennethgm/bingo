import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardDetailsComponent } from './components/card-details/card-details.component';
import { AddCardComponent } from './components/add-card/add-card.component';
import { AdminComponent } from './components/admin/admin.component';
import { AddGameComponent } from './components/add-game/add-game.component';
import { GameDetailsComponent } from './components/game-details/game-details.component';
import { HomeComponent } from './components/home/home.component';
import { CardsListComponent } from './components/cards-list/cards-list.component';

const routes: Routes = [
  { path: '',  component: HomeComponent },
  { path: 'cards/:id', component: CardDetailsComponent },
  { path: 'add', component: AddCardComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/add-game', component: AddGameComponent },
  { path: 'game/:id', component: GameDetailsComponent } ,
  { path: 'allcards', component: CardsListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
