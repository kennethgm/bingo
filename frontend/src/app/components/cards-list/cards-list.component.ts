import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss']
})
export class CardsListComponent implements OnInit {

  cards: any;
  games: any;
  currentCard = null;
  currentIndex = -1;
  name = '';

  constructor(private cardService: CardService, private gameService: GameService) { }

  ngOnInit(): void {
    this.retrievecards();
    this.retrieveGames();
  }

  retrievecards(): void {
    this.cardService.getAll()
      .subscribe(
        data => {
          this.cards = data;
        //  console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  
  retrieveGames(): void {
    this.gameService.getAll()
      .subscribe(
        data => {
          this.games = data;
        //  console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrievecards();
    this.currentCard = null;
    this.currentIndex = -1;
  }

  setActiveGame(tutorial, index): void {
    this.currentCard = tutorial;
    this.currentIndex = index;
  }

  removeAllcards(): void {
    this.cardService.deleteAll()
      .subscribe(
        response => {
        //  console.log(response);
          this.refreshList();
        },
        error => {
          console.log(error);
        });
  }

  searchTitle(): void {
    this.cardService.findByName(this.name)
      .subscribe(
        data => {
          this.cards = data;
        //  console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  openSublist(id) {
    console.log('called');
    let element = document.getElementById("game-" + id);
    let icon_element = document.getElementById('icon-' + id);
    //console.log('element', element);
    //console.log('icon_element', icon_element);
    if (getComputedStyle(element, null).display == 'none') {
      element.setAttribute('style', 'display: block;');
      icon_element.setAttribute('class', 'open-submenu fa fa-caret-up');
    } else {
      element.setAttribute('style', 'display: none;');
      icon_element.setAttribute('class', 'open-submenu fa fa-caret-down');
    }
  }

}
