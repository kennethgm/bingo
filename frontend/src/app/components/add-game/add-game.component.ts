import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss']
})
export class AddGameComponent implements OnInit {

  game = {
    name: '',
    winners: {},
    startDate: new Date(),
    settings: {}
  };
  submitted = false;
  games: any;
  gamesLength = '';

  constructor( 
    private gameService: GameService,
    private router: Router) { }

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
     console.log('this.game', this.game);
      const data = {
        name: this.game.name,
        winners: this.game.winners,
        startDate: this.game.startDate,
        settings: this.game.settings
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
        winners: {
          "corners": [],
          "vertical": [],
          "horizontal": [],
          "fullGame": []
        },
        startDate: new Date(),
        settings: {
          raffleType: 'digital',
          winningWays: {
            "corners": false,
            "vertical": false,
            "horizontal": false,
            "fullGame": false
          }
        }
      };
    }

}
