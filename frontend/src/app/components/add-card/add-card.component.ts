import { Component, OnInit } from '@angular/core';
import { CardService } from './../../services/card.service';
import { GameService } from './../../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {
  card = {
    name: '',
    phonenumber: '',
    email: '',
    numbers: {},
    gameCode: '',
    officialId: ''
  };
  submitted = false;
  cards: any;
  cardsLength = '';
  games = [];

  constructor(
    private cardService: CardService,
    private gameService: GameService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.newCard();
    this.cardService.getAll().subscribe(
      data => {
        this.cards = data;
        
        this.cardsLength = ((this.cards.length) + 1).toString();
        //console.log('this.cards.length', this.cardsLength);
      },
      error => {
      //console.log(error);
    });
    this.gameService.getAll().subscribe(
      data => {
        this.games = data;
        //console.log('games', this.games);
      }
    );
  }

  saveCard(): void {
    //console.log('this.card', this.card);
    const data = {
      name: this.card.name,
      phonenumber: this.card.phonenumber,
      email: this.card.phonenumber,
      numbers: this.card.numbers,
      gameCode: this.card.gameCode,
      officialId: this.card.officialId
    };
    console.log('will send', data);
    this.cardService.create(data).subscribe(
      response => {
     //   console.log(response);
        this.router.navigate(['/cards/'+ response['id']]);
      },
      error => {
        console.log(error);
      }
    );
  }

  newCard(): void {
    this.submitted = false;
    this.card = {
      name: '',
      phonenumber: '',
      email: '',
      numbers: this.numbersGenerator(),
      gameCode: '',
      officialId: ''
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
    //console.log('numbers', numbers);
    numbers.b = this.shuffle(numbers.b);
    numbers.b = numbers.b.slice(0, 5);
    numbers.i = this.shuffle(numbers.i);
    numbers.i = numbers.i.slice(0, 5);
    numbers.n = this.shuffle(numbers.n);
    numbers.n = numbers.n.slice(0, 4);
    numbers.g = this.shuffle(numbers.g);
    numbers.g = numbers.g.slice(0, 5);
    numbers.o = this.shuffle(numbers.o);
    numbers.o = numbers.o.slice(0, 5);
    return numbers;
  }

  shuffle(array) {
    var m = array.length, t, i;
  
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
  }

}
