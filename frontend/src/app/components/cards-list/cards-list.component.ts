import { Component, OnInit } from '@angular/core';


import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss']
})
export class CardsListComponent implements OnInit {

  cards: any;
  currentCard = null;
  currentIndex = -1;
  name = '';

  constructor(private cardService: CardService) { }

  ngOnInit(): void {
    this.retrievecards();
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

}
