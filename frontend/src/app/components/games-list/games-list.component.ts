import { Component, OnInit } from '@angular/core';

import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit {

  games: any;
  currentGame = null;
  currentIndex = -1;
  name = '';

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.retrieveGames();
  }

  retrieveGames(): void {
    this.gameService.getAll()
      .subscribe(
        data => {
          this.games = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrieveGames();
    this.currentGame = null;
    this.currentIndex = -1;
  }

  setActiveGame(tutorial, index): void {
    this.currentGame = tutorial;
    this.currentIndex = index;
  }

  removeAllGames(): void {
    this.gameService.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.refreshList();
        },
        error => {
          console.log(error);
        });
  }

  searchTitle(): void {
    this.gameService.findByName(this.name)
      .subscribe(
        data => {
          this.games = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

}
