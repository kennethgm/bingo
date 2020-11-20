import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss']
})
export class AddGameComponent implements OnInit {

  game = {
    name: '',
    winners: [],
    startDate: new Date(),
    settings: {},
    zoomLink: '',
    eventDate: ''
  };
  submitted = false;
  games: any;
  gamesLength = '';

  constructor( 
    private gameService: GameService,
    private router: Router,
    public datepipe: DatePipe) { }

    ngOnInit(): void {
      this.newGame();
      this.gameService.getAll().subscribe(
        data => {
          this.games = data;
          
          this.games = ((this.games.length) + 1).toString();
         // console.log('this.cards.length', this.gamesLength);
        },
        error => {
          console.log(error);
      });
    }

    saveGame(): void {
     //console.log('this.game', this.game);
     let date = new Date(this.game.startDate);     
     this.game.startDate = new Date(date.setHours(date.getHours() - 6));                                     
     this.game.startDate = new Date(this.datepipe.transform(this.game.startDate, "yyyy-MM-dd'T'HH:mm:ss"));
     
      const data = {
        name: this.game.name,
        winners: this.game.winners,
        startDate: this.game.startDate,
        settings: this.game.settings, 
        zoomLink: this.game.zoomLink,
        eventDate: this.game.eventDate
      };
      console.log('will send', data);
      this.gameService.create(data)
        .subscribe(
          response => {
            this.router.navigate(['/game/'+ response['id']]);
          },
          error => {
            console.log(error);
        });
    }
  
    newGame(): void {
      this.submitted = false;
      this.game = {
        name: '',
        winners: [{
          "corners": [],
          "vertical": [],
          "horizontal": [],
          "fullGame": []
        }],
        startDate: new Date(),
        settings: {
          raffleType: 'digital',
          winningWays: {
            "corners": false,
            "vertical": false,
            "horizontal": false,
            "fullGame": false
          },
          absentPlayers: []
        }, 
        zoomLink : '',
        eventDate: ''
      };
    }

}
