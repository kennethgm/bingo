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
       //   console.log(data);
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
  

}
