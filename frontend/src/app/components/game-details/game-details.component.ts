import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent implements OnInit {

  currentGame = null;
  message = '';
  gameStarted = false;
  array_b = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  array_i = [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
  array_n = [31,32,33,34,35,36,37,38,39,40,41,42,43,44,45];
  array_g = [46,47,48,49,50,51,52,53,53,54,55,56,57,58,59,60];
  array_o = [61,62,63,64,65,66,67,68,69,70,71,72,73,74,75];

  constructor(
    private cardService: GameService,
    private route: ActivatedRoute,
    private router: Router) { }

    ngOnInit(): void {
      this.message = '';
      this.getGame(this.route.snapshot.paramMap.get('id'));
    }

  getGame(id): void {
    this.cardService.get(id)
    .subscribe(
      data => {
        this.currentGame = data;
        console.log('currentgame',data);
      },
      error => {
        console.log(error);
    });
  }

  updateGame(): void {
    this.cardService.update(this.currentGame.id, this.currentGame)
      .subscribe(
        response => {
        //  console.log(response);
          this.message = 'El juego fue actualizado correctamente!';
          this.router.navigate(['/admin']);
        },
        error => {
          console.log(error);
    });
  }

  deleteGame(): void {
    this.cardService.delete(this.currentGame.id)
      .subscribe(
        response => {
        //  console.log(response);
          alert(response);
          this.router.navigate(['/admin']);

        },
        error => {
          console.log(error);
    });
  }

  startGame() {
    console.log('starting game');
    this.gameStarted = true;
  }
  

}
