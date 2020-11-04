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
  editGame = false;
  gameFinished = false;
  array_b = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  array_i = [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
  array_n = [31,32,33,34,35,36,37,38,39,40,41,42,43,44,45];
  array_g = [46,47,48,49,50,51,52,53,54,55,56,57,58,59,60];
  array_o = [61,62,63,64,65,66,67,68,69,70,71,72,73,74,75];
  lastNumber;
  showRaffle = false;
  spinningRaffle = false;
  gameCards = [];
  rankingOfWinners = [];
  moreStats = false;
  unTieNumber = 0;
  showModal = false;

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
            rankingPlayer['verticalB'] = 0;
            rankingPlayer['verticalI'] = 0;
            rankingPlayer['verticalN'] = 0;
            rankingPlayer['verticalG'] = 0;
            rankingPlayer['verticalO'] = 0;
            rankingPlayer['horizontal1'] = 0;
            rankingPlayer['horizontal2'] = 0;
            rankingPlayer['horizontal3'] = 0;
            rankingPlayer['horizontal4'] = 0;
            rankingPlayer['horizontal5'] = 0;
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
  }

  getGame(id): void {
    this.gameService.get(id)
    .subscribe(
      data => {
        this.currentGame = data;
        this.getCards();
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
         // console.log(response);
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
      this.currentGame.winners.push({
        "corners": [],
        "vertical": [],
        "horizontal": [],
        "fullGame": [],
        "selectedNumbers": []
      });
      let raffleType = this.currentGame.settings.raffleType;
      let ways = {
        corners: this.currentGame.settings.winningWays.corners ? this.currentGame.settings.winningWays.corners : false,
        vertical:  this.currentGame.settings.winningWays.vertical ? this.currentGame.settings.winningWays.vertical : false,
        horizontal:  this.currentGame.settings.winningWays.horizontal ? this.currentGame.settings.winningWays.horizontal : false,
        fullGame:  this.currentGame.settings.winningWays.fullGame ? this.currentGame.settings.winningWays.fullGame : false,
      };
      this.currentGame.settings = {
        "raffleType":  raffleType, 
        "winningWays": ways
      };
      this.getCards();
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

  editGameDetails() {
    this.editGame = true;
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
          self.getRandomNumber(min,max);
        } else {
          setTimeout(function(){
            self.addToGame(newNumber);
            self.showRaffle = false;
          }, 5900);
        }
      }
    } else {
      if (self.isInArray(newNumber)) {
        self.getRandomNumber(min,max);
      } else {
        setTimeout(function(){
          self.addToGame(newNumber);
          self.showRaffle = false;
        }, 5900);
      }
    } 
  }

  getRandomNumber2(min, max) {
    let self = this;
    self.spinningRaffle = true;

    setTimeout(function(){
      let newNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      self.unTieNumber = newNumber;
      self.spinningRaffle = false;
    }, 5900);
  }

  checkIfFinished() {
    let self = this;
    let ways = Object.entries(self.currentGame.settings.winningWays);
    let round = self.currentGame.winners.length - 1;
    ways.forEach(way => {
      if (way[1]) {
        if (self.currentGame.winners[round][way[0]].length > 0) {
          self.gameFinished = true;
        } else {
          self.gameFinished = false;
        }
      }
    });
    //console.log('gameFinished', self.gameFinished);
  }

  updateRankings(number) {
    let self = this;
    let ways = Object.entries(self.currentGame.settings.winningWays);
    let round = self.currentGame.winners.length - 1;

    this.rankingOfWinners.forEach(player => {
      ways.forEach(way => {
        switch (way[0]) {
          case 'corners':
            if (way[1] && self.currentGame.winners[round].corners.length == 0) {
              self.check4Corners(player, number);
              self.checkIfFinished();
            }
            break;
          case 'vertical':
            if (way[1] && self.currentGame.winners[round].vertical.length == 0) {
              self.checkVerticals(player, number);
              self.checkIfFinished();
            }
            break;
          case 'horizontal':
            if (way[1] && self.currentGame.winners[round].horizontal.length == 0) {
              self.checkHorizontals(player, number);
              self.checkIfFinished();
            }
            break;
          case 'fullGame':
            if (way[1] && self.currentGame.winners[round].fullGame.length == 0) {
              self.checkFullGame(player, number);
              self.checkIfFinished();
            }
            break;
          default: break;
        }
      });
    });
    self.rankingOfWinners.sort(self.compareRanking);
    this.currentGame.settings['rankingOfWinners'] = this.rankingOfWinners;
  }

  check4Corners(player, newNumber) {
    let self = this;
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
      default: break;
    }
    if (player.corners == 4) {
      alert('BINGO - 4 esquinas - ' + player.name);
      player.winnerDetail += ' - 4 esquinas ';
      let round = self.currentGame.winners.length - 1;
      let winnerPlayer = new Object();
      winnerPlayer['id'] = player.id;
      winnerPlayer['name'] = player.name;
      winnerPlayer['numbers'] = player.numbers;
      winnerPlayer['winnerDetails'] = player.winnerDetail;
      winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
      self.currentGame.winners[round].corners.push(winnerPlayer);
    }
  }

  checkVerticals(player, newNumber) {
    let self = this;
    let index = 1;
    player.numbers['b'].forEach(element => {
      if (newNumber == element) {
        player.matchedNumbers['b' + index] = true;
        player.verticalB++;
      }
      index++;
    });
    index = 1;
    player.numbers['i'].forEach(element => {
      if (newNumber == element) {
        player.matchedNumbers['i' + index] = true;
        player.verticalI++;
      }
      index++;
    });
    index = 1;
    player.numbers['n'].forEach(element => {
      if (newNumber == element) {
        if (index == 1 || index == 2) {
          player.matchedNumbers['n' + index] = true;
        } else {
          player.matchedNumbers['n' + (index + 1)] = true;
        }
        player.verticalN++;
      }
      index++;
    });
    index = 1;
    player.numbers['g'].forEach(element => {
      if (newNumber == element) {
        player.matchedNumbers['g' + index] = true;
        player.verticalG++;
      }
      index++;
    });
    index = 1;
    player.numbers['o'].forEach(element => {
      if (newNumber == element) {
        player.matchedNumbers['o' + index] = true;
        player.verticalO++;
      }
      index++;
    });
    let round = self.currentGame.winners.length - 1;
    if (player.verticalB == 5) {
      alert('BINGO - - Vertical - Columna B - ' + player.name);
      player.winnerDetail += ' - Vertical - Columna B ';
      let winnerPlayer = new Object();
      winnerPlayer['id'] = player.id;
      winnerPlayer['name'] = player.name;
      winnerPlayer['numbers'] = player.numbers;
      winnerPlayer['winnerDetails'] = player.winnerDetail;
      winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
      self.currentGame.winners[round].vertical.push(winnerPlayer);
    }
    if (player.verticalI == 5) {
      alert('BINGO - - Vertical - Columna I - ' + player.name);
      player.winnerDetail += ' - Vertical - Columna I ';
      let winnerPlayer = new Object();
      winnerPlayer['id'] = player.id;
      winnerPlayer['name'] = player.name;
      winnerPlayer['numbers'] = player.numbers;
      winnerPlayer['winnerDetails'] = player.winnerDetail;
      winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
      self.currentGame.winners[round].vertical.push(winnerPlayer);
    }
    if (player.verticalN == 4) {
      alert('BINGO - - Vertical - Columna N (centro) - ' + player.name);
      player.winnerDetail += ' - Vertical - Columna N (centro)';
      let winnerPlayer = new Object();
      winnerPlayer['id'] = player.id;
      winnerPlayer['name'] = player.name;
      winnerPlayer['numbers'] = player.numbers;
      winnerPlayer['winnerDetails'] = player.winnerDetail;
      winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
      self.currentGame.winners[round].vertical.push(winnerPlayer);
    }
    if (player.verticalG == 5) {
      alert('BINGO - - Vertical - Columna G - ' + player.name);
      player.winnerDetail += ' - Vertical - Columna G';
      let winnerPlayer = new Object();
      winnerPlayer['id'] = player.id;
      winnerPlayer['name'] = player.name;
      winnerPlayer['numbers'] = player.numbers;
      winnerPlayer['winnerDetails'] = player.winnerDetail;
      winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
      self.currentGame.winners[round].vertical.push(winnerPlayer);
    }
    if (player.verticalO == 5) {
      alert('BINGO - - Vertical - Columna O - ' + player.name);
      player.winnerDetail += ' - Vertical - Columna O';
      let winnerPlayer = new Object();
      winnerPlayer['id'] = player.id;
      winnerPlayer['name'] = player.name;
      winnerPlayer['numbers'] = player.numbers;
      winnerPlayer['winnerDetails'] = player.winnerDetail;
      winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
      self.currentGame.winners[round].vertical.push(winnerPlayer);
    }
  }

  checkHorizontals(player, newNumber) {
    let self = this;
    let letters = ['b','i','n','g','o'];
   
    for (let index = 0; index < 5; index++) {
      letters.forEach(letter => {
        switch (index) {
          case 0:
            if (player.numbers[letter][index] == newNumber) {
              player.matchedNumbers[letter + (index+1)] = true;
              player.horizontal1++;
            } 
            break;
          case 1:
            if (player.numbers[letter][index] == newNumber) {
              player.matchedNumbers[letter + (index+1)] = true;
              player.horizontal2++;
            }
            break
          case 2:
            if (player.numbers[letter][index] == newNumber) {
              player.matchedNumbers[letter + (index+1)] = true;
              player.horizontal3++;
            }
            break;
          case 3:
            
              if (letter != 'n') {
                if (player.numbers[letter][index] == newNumber) {
                  player.matchedNumbers[letter + (index+1)] = true;
                  player.horizontal4++;
                }
              } else {
                if (player.numbers[letter][index - 1] == newNumber) {
                 player.matchedNumbers[letter + (index)] = true;
                 player.horizontal4++;
                }
              }
             
            break;
          case 4:
            if (letter != 'n') {
              if (player.numbers[letter][index] == newNumber) {
                player.matchedNumbers[letter + (index+1)] = true;
                player.horizontal5++;
              }
            } else {
              if (player.numbers[letter][index - 1] == newNumber) {
               player.matchedNumbers[letter + (index - 1)] = true;
               player.horizontal5++;
              }
            }
            break;
        }
      });
    }

    let round = self.currentGame.winners.length - 1;
    if (player.horizontal1 == 5) {
      alert('BINGO -  Horizontal - Fila 1 - ' + player.name);
      player.winnerDetail += ' - Horizontal - Fila 1';
      let winnerPlayer = new Object();
      winnerPlayer['id'] = player.id;
      winnerPlayer['name'] = player.name;
      winnerPlayer['numbers'] = player.numbers;
      winnerPlayer['winnerDetails'] = player.winnerDetail;
      winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
      self.currentGame.winners[round].horizontal.push(winnerPlayer);
    }
    if (player.horizontal2 == 5) {
      alert('BINGO -  Horizontal - Fila 2 - ' + player.name);
      player.winnerDetail += ' - Horizontal - Fila 2';
      let winnerPlayer = new Object();
      winnerPlayer['id'] = player.id;
      winnerPlayer['name'] = player.name;
      winnerPlayer['numbers'] = player.numbers;
      winnerPlayer['winnerDetails'] = player.winnerDetail;
      winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
      self.currentGame.winners[round].horizontal.push(winnerPlayer);
    }
    if (player.horizontal3 == 4) {
      alert('BINGO -  Horizontal - Fila 3 (centro) - ' + player.name);
      player.winnerDetail += ' - Horizontal - Fila 3 (centro)';
      let winnerPlayer = new Object();
      winnerPlayer['id'] = player.id;
      winnerPlayer['name'] = player.name;
      winnerPlayer['numbers'] = player.numbers;
      winnerPlayer['winnerDetails'] = player.winnerDetail;
      winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
      self.currentGame.winners[round].horizontal.push(winnerPlayer);
    }
    if (player.horizontal4 == 5) {
      alert('BINGO -  Horizontal - Fila 4 - ' + player.name);
      player.winnerDetail += ' - Horizontal - Fila 4';
      let winnerPlayer = new Object();
      winnerPlayer['id'] = player.id;
      winnerPlayer['name'] = player.name;
      winnerPlayer['numbers'] = player.numbers;
      winnerPlayer['winnerDetails'] = player.winnerDetail;
      winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
      self.currentGame.winners[round].horizontal.push(winnerPlayer);
    }
    if (player.horizontal5 == 5) {
      alert('BINGO -  Horizontal - Fila 5 - ' + player.name);
      player.winnerDetail += ' - Horizontal - Fila 5';
      let winnerPlayer = new Object();
      winnerPlayer['id'] = player.id;
      winnerPlayer['name'] = player.name;
      winnerPlayer['numbers'] = player.numbers;
      winnerPlayer['winnerDetails'] = player.winnerDetail;
      winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
      self.currentGame.winners[round].horizontal.push(winnerPlayer);
    }
  }


  compareRanking(a, b) {
    const object1 = a.fullGame;
    const object2 =  b.fullGame;
  
    let comparison = 0;
    if (object1 < object2) {
      comparison = 1;
    } else if (object1 > object2) {
      comparison = -1;
    }
    return comparison;
  }

  checkFullGame(player, newNumber) {
    let self = this;
    let letters = ['b','i','n','g','o'];
    let index = 1;
      letters.forEach(letter => {
          player.numbers[letter].forEach(element => {
              if (newNumber == element) {
                if (letter == 'n' && index > 2) {
                  player.matchedNumbers[letter + (index + 1)] = true;
                  player.fullGame++;
                } else {
                  player.matchedNumbers[letter + index] = true;
                  player.fullGame++;
                }
              }
              index++;
          });
          index = 1;
      });

    if (player.fullGame == 24) {
      alert('BINGO -  CARTON LLENO - ' + player.name);
      player.winnerDetail += ' - Carton Lleno';
      let winnerPlayer = new Object();
      let round = self.currentGame.winners.length - 1;
      winnerPlayer['id'] = player.id;
      winnerPlayer['name'] = player.name;
      winnerPlayer['numbers'] = player.numbers;
      winnerPlayer['winnerDetails'] = player.winnerDetail;
      winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
      self.currentGame.winners[round].fullGame.push(winnerPlayer);
    }
    
  }

}

