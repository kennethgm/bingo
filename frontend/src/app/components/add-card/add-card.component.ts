import { Component, OnInit } from '@angular/core';
import { CardService } from './../../services/card.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {
  card = {
    name: '',
    phonenumber: '',
    email: '',
    numbers: {},
    gameCode: ''
  };
  submitted = false;
  cards: any;
  cardsLength = '';

  constructor(private cardService: CardService) { }

  ngOnInit(): void {
    this.newCard();
    this.cardService.getAll().subscribe(
      data => {
        this.cards = data;
        
        this.cardsLength = ((this.cards.length) + 1).toString();
        console.log('this.cards.length', this.cardsLength);
      },
      error => {
        console.log(error);
    });
  }

  saveCard(): void {
    console.log('this.card', this.card);
    const data = {
      name: this.card.name,
      phonenumber: this.card.phonenumber,
      email: this.card.phonenumber,
      numbers: this.card.numbers,
      gameCode: this.card.gameCode
    };
    console.log('will send', data);
    this.cardService.create(data)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }

  newCard(): void {
    this.submitted = false;
    this.card = {
      name: '',
      phonenumber: '',
      email: '',
      numbers: this.numbersGenerator(),
      gameCode: ''
    };
  }

  numbersGenerator() {
    let numbers = {
      b: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
      i: [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
      n: [31,32,33,34,35,36,37,38,39,40,41,42,43,44,45],
      g: [46,47,48,49,50,51,52,53,54,55,56,57,58,59,60],
      o: [61,62,63,64,65,66,67,68,69,70,71,72,73,74,75]
    };
    console.log('numbers', numbers);
    return numbers;
  }

}
