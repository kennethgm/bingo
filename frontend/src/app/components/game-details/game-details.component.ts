import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { CardService } from 'src/app/services/card.service';
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
  array_g = [46,47,48,49,50,51,52,53,54,55,56,57,58,59,60];
  array_o = [61,62,63,64,65,66,67,68,69,70,71,72,73,74,75];
  lastNumber;
  showRaffle = false;
  gameCards = [];
  rankingOfWinners = [];

  constructor(
    private gameService: GameService,
    private cardService: CardService,
    private route: ActivatedRoute,
    private router: Router) { }

    ngOnInit(): void {
      this.message = '';
      this.getGame(this.route.snapshot.paramMap.get('id'));
      
    }

  getCards(): void {
    let self = this;
    if (!self.currentGame.settings['rankingOfWinners'] || self.currentGame.settings['rankingOfWinners'] == []) {
      this.cardService.findByGameCode(this.currentGame.id)
      .subscribe(
        data => {
          this.gameCards = data;
          this.rankingOfWinners = [];
          this.gameCards.forEach(element => {
            let rankingPlayer = new Object();
            rankingPlayer['id'] = element.id;
            rankingPlayer['name'] = element.name;
            rankingPlayer['numbers'] = element.numbers;
            rankingPlayer['vertical'] = 0;
            rankingPlayer['verticalCenter'] = 0;
            rankingPlayer['horizontal'] = 0;
            rankingPlayer['horizontalCenter'] = 0;
            rankingPlayer['corners'] = 0;
            rankingPlayer['fullGame'] = 0;
            rankingPlayer['winnerDetail'] = '';
            rankingPlayer['showDetails'] = false; 
            rankingPlayer['matchedNumbers'] = {
              'b1': false,
              'b2': false,
              'b3': false,
              'b4': false,
              'b5': false,
              'i1': false,
              'i2': false,
              'i3': false,
              'i4': false,
              'i5': false,
              'n1': false,
              'n2': false,
              'n3': true,
              'n4': false,
              'n5': false,
              'g1': false,
              'g2': false,
              'g3': false,
              'g4': false,
              'g5': false,
              'o1': false,
              'o2': false,
              'o3': false,
              'o4': false,
              'o5': false,
            };
            self.rankingOfWinners.push(rankingPlayer);
          });
        },
        error => {
          console.log(error);
      });
    } else {
      self.rankingOfWinners = self.currentGame.settings['rankingOfWinners'];
    }
    console.log('currentRanking', self.rankingOfWinners);
  }

  getGame(id): void {
    this.gameService.get(id)
    .subscribe(
      data => {
        this.currentGame = data;
      },
      error => {
        console.log(error);
    });
  }

  updateGame(): void {
    this.gameService.update(this.currentGame.id, this.currentGame)
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

  saveGameProgress(): void {
    this.gameService.update(this.currentGame.id, this.currentGame)
      .subscribe(
        response => {
          console.log(response);
          this.message = 'El juego fue actualizado correctamente!';
        },
        error => {
          console.log(error);
    });
  }

  restartGame() {
    if (confirm('Estas seguro que quieres reiniciar el juego?')) {
      this.lastNumber = undefined;
      this.rankingOfWinners = [];
      let raffleType = this.currentGame.settings.raffleType;
      let gameStarted = this.gameStarted;
      this.currentGame.settings = {"raffleType":  raffleType, "gameStarted": gameStarted };
      this.gameStarted = false;
      this.saveGameProgress();
    }
  }

  deleteGame(): void {
    if(confirm('Estas seguro que quieres borrar este juego? Todo se perdera!')) {
      this.gameService.delete(this.currentGame.id)
      .subscribe(
          response => {
            this.router.navigate(['/admin']);
          },
          error => {
            console.log(error);
      });
    }
  }

  startGame() {
    this.gameStarted = true;
    this.currentGame.settings['gameStarted'] = this.gameStarted;
    this.getCards();
  }

  addToGame(number) {
    this.lastNumber = number;
    if (this.currentGame.settings.selectedNumbers) {
      this.currentGame.settings.selectedNumbers.push(number);
      this.updateRankings(number);
    } else {
      this.currentGame.settings['selectedNumbers'] = [];
      this.currentGame.settings.selectedNumbers.push(number);
      this.updateRankings(number);
    }
    this.saveGameProgress();
  }

  isInArray(number) {
    if (this.currentGame.settings.selectedNumbers) {
      if (this.currentGame.settings.selectedNumbers.includes(number)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  
  getRandomNumber(min, max) {
    let self = this;
    this.showRaffle = true;
    let newNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    if (self.currentGame.settings.selectedNumbers) {
      if (self.currentGame.settings.selectedNumbers.length < 75) {
        if (self.isInArray(newNumber)) {
          self.getRandomNumber(1,75);
        } else {
          setTimeout(function(){
            self.addToGame(newNumber);
            self.showRaffle = false;
          }, 5900);
        }
      }
    } else {
      if (self.isInArray(newNumber)) {
        self.getRandomNumber(1,75);
      } else {
        setTimeout(function(){
          self.addToGame(newNumber);
          self.showRaffle = false;
        }, 5900);
      }
    } 
  }

  updateRankings(number) {
    let self = this;
    this.rankingOfWinners.forEach(player => {
      self.check4Corners(player, number);
    });
    self.rankingOfWinners.sort(self.compareCorners);
    console.log('updated ranking', self.rankingOfWinners);
    this.currentGame.settings['rankingOfWinners'] = this.rankingOfWinners;
    //this.saveGameProgress();
  }

  check4Corners(player, newNumber) {
    console.log('player', player);
    switch(newNumber)  {
      case player.numbers['b'][0]: 
        player.corners++;
        player.matchedNumbers['b1'] = true;
        break;
      case player.numbers['b'][4]:
        player.corners++;
        player.matchedNumbers['b5'] = true;
        break;
      case player.numbers['o'][0]:
        player.corners++;
        player.matchedNumbers['o1'] = true;
        break;
      case player.numbers['o'][4]:
        player.corners++;
        player.matchedNumbers['o5'] = true;
        break;
      default: console.log('no matches in corners'); break;
    }
    console.log('playercorners', player.corners);
    if (player.corners == 4) {
      player.winnerDetail = '(4 esquinas)';
    }
  }


  compareCorners(a, b) {
    const object1 = a.corners;
    const object2 = b.corners;
  
    let comparison = 0;
    if (object1 < object2) {
      comparison = 1;
    } else if (object1 > object2) {
      comparison = -1;
    }
    return comparison;
  }

}
