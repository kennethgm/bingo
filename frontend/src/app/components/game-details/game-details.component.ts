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
  showUntieRaffle = false;
  potentialWinnersCorners = [];
  checkingUntieCorners = false;
  cornersClick = 0;

  potentialWinnersVertical = [];
  checkingUntieVertical = false;
  verticalClick = 0;

  potentialWinnersHorizontal = [];
  checkingUntieHorizontal = false;
  horizontalClick = 0;

  potentialWinnersFull = [];
  checkingUntieFull = false;
  fullGameClick = 0;

  currentUntieNumbers = [];

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
      this.potentialWinnersCorners = [];
      this.potentialWinnersVertical = [];
      this.potentialWinnersHorizontal = [];
      this.potentialWinnersFull = [];
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
        "winningWays": ways,
        "absentPlayers": []
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

  isInArrayUntie(number) {
    if (this.currentUntieNumbers) {
      if (this.currentUntieNumbers.includes(number)) {
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
              if (!self.checkAbsentPlayer(player)) {
                self.check4Corners(player, number);
              }
            }
            break;
          case 'vertical':
            if (way[1] && self.currentGame.winners[round].vertical.length == 0) {
              if (!self.checkAbsentPlayer(player)) {
                self.checkVerticals(player, number);
              }
            }
            break;
          case 'horizontal':
            if (way[1] && self.currentGame.winners[round].horizontal.length == 0) {
              if (!self.checkAbsentPlayer(player)) {
                self.checkHorizontals(player, number);
              }
            }
            break;
          case 'fullGame':
            if (way[1] && self.currentGame.winners[round].fullGame.length == 0) {
              if (!self.checkAbsentPlayer(player)) {
                self.checkFullGame(player, number);
              }
            }
            break;
          default: break;
        }
      });
    });

    ways.forEach(way => {
      switch (way[0]) {
        case 'corners':
          if (way[1] && self.currentGame.winners[round].corners.length == 0) {
            if (self.potentialWinnersCorners.length == 0) {
              break;
            } else {
              if (self.potentialWinnersCorners.length == 1) {
                if(!self.checkAbsentPlayer(self.potentialWinnersCorners[0])) {
                  alert('BINGO - 4 esquinas - ' + self.potentialWinnersCorners[0].name);
                  if (confirm('Es el único ganador! Está '+ self.potentialWinnersCorners[0].name +' presente en la llamada?')) {
                    //player.winnerDetail += ' - 4 esquinas ';
                    let round = self.currentGame.winners.length - 1;
                    let winnerPlayer = new Object();
                    winnerPlayer['id'] = self.potentialWinnersCorners[0].id;
                    winnerPlayer['name'] = self.potentialWinnersCorners[0].name;
                    winnerPlayer['numbers'] = self.potentialWinnersCorners[0].numbers;
                    winnerPlayer['winnerDetails'] = self.potentialWinnersCorners[0].winnerDetail;
                    winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
                    self.currentGame.winners[round].corners.push(winnerPlayer);
                    self.potentialWinnersCorners = [];
                  } else {
                    let absentPlayer = new Object();
                    absentPlayer['id'] = self.potentialWinnersCorners[0].id;
                    absentPlayer['name'] = self.potentialWinnersCorners[0].name;
                    self.currentGame.settings.absentPlayers.push(absentPlayer);
                    alert('El ganador no estaba presente! \n Seguimos jugando 4 esquinas!');
                    self.potentialWinnersCorners = [];
                    break;
                  }
                }
                
              } else {

                alert('BINGO - 4 Esquinas - Tenemos varios cartones ganadores! Pasemos lista!');
                self.potentialWinnersCorners.forEach(element => { 
                  if (!confirm('Está '+ element.name +' presente en la llamada?')) {
                    element.absent = true;
                    let absentPlayer = new Object();
                    absentPlayer['id'] = element.id;
                    absentPlayer['name'] = element.name;
                    self.currentGame.settings.absentPlayers.push(absentPlayer);
                  } 
                });

                let newArray = [];

                self.potentialWinnersCorners.forEach(element => { 
                  if (!element.absent) {
                    newArray.push(element);
                  } 
                });

                self.potentialWinnersCorners = newArray;
                this.checkAfterAbsentsCorners();

              }
            }
            
          }

          break;
          case 'vertical':
            if (way[1] && self.currentGame.winners[round].vertical.length == 0) {
              if (self.potentialWinnersVertical.length == 0) {
                break;
              } else {
                if (self.potentialWinnersVertical.length == 1) {
                  if(!self.checkAbsentPlayer(self.potentialWinnersVertical[0])) {
                    alert('BINGO - Vertical - ' + self.potentialWinnersVertical[0].name );
                    if (confirm('Es el único ganador! Está '+ self.potentialWinnersVertical[0].name +' presente en la llamada?')) {
                      //player.winnerDetail += ' - 4 esquinas ';
                      let round = self.currentGame.winners.length - 1;
                      let winnerPlayer = new Object();
                      winnerPlayer['id'] = self.potentialWinnersVertical[0].id;
                      winnerPlayer['name'] = self.potentialWinnersVertical[0].name;
                      winnerPlayer['numbers'] = self.potentialWinnersVertical[0].numbers;
                      winnerPlayer['winnerDetails'] = self.potentialWinnersVertical[0].winnerDetail;
                      winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
                      self.currentGame.winners[round].vertical.push(winnerPlayer);
                      self.potentialWinnersVertical = [];
                    } else {
                      let absentPlayer = new Object();
                      absentPlayer['id'] = self.potentialWinnersVertical[0].id;
                      absentPlayer['name'] = self.potentialWinnersVertical[0].name;
                      self.currentGame.settings.absentPlayers.push(absentPlayer);
                      alert('El ganador no estaba presente! \n Seguimos jugando verticales!');
                      self.potentialWinnersVertical = [];
                      break;
                    }
                  }
                  
                } else {
  
                  alert('BINGO - Vertical - Tenemos varios cartones ganadores! Pasemos lista!');
                  self.potentialWinnersVertical.forEach(element => { 
                    if (!confirm('Está '+ element.name +' presente en la llamada?')) {
                      element.absent = true;
                      let absentPlayer = new Object();
                      absentPlayer['id'] = element.id;
                      absentPlayer['name'] = element.name;
                      self.currentGame.settings.absentPlayers.push(absentPlayer);
                    } 
                  });
  
                  let newArray = [];
  
                  self.potentialWinnersVertical.forEach(element => { 
                    if (!element.absent) {
                      newArray.push(element);
                    } 
                  });
  
                  self.potentialWinnersVertical = newArray;
                  this.checkAfterAbsentsVertical();
  
                }
              } 
            }
            break;
           
        case 'horizontal':
          if (way[1] && self.currentGame.winners[round].horizontal.length == 0) {
            if (self.potentialWinnersHorizontal.length == 0) {
              break;
            } else {
              if (self.potentialWinnersHorizontal.length == 1) {
                if(!self.checkAbsentPlayer(self.potentialWinnersHorizontal[0])) {
                  alert('BINGO - Horizontal - ' + self.potentialWinnersHorizontal[0].name );
                  if (confirm('Es el único ganador! Está '+ self.potentialWinnersHorizontal[0].name +' presente en la llamada?')) {
                    //player.winnerDetail += ' - 4 esquinas ';
                    let round = self.currentGame.winners.length - 1;
                    let winnerPlayer = new Object();
                    winnerPlayer['id'] = self.potentialWinnersHorizontal[0].id;
                    winnerPlayer['name'] = self.potentialWinnersHorizontal[0].name;
                    winnerPlayer['numbers'] = self.potentialWinnersHorizontal[0].numbers;
                    winnerPlayer['winnerDetails'] = self.potentialWinnersHorizontal[0].winnerDetail;
                    winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
                    self.currentGame.winners[round].horizontal.push(winnerPlayer);
                    self.potentialWinnersHorizontal = [];
                  } else {
                    let absentPlayer = new Object();
                    absentPlayer['id'] = self.potentialWinnersHorizontal[0].id;
                    absentPlayer['name'] = self.potentialWinnersHorizontal[0].name;
                    self.currentGame.settings.absentPlayers.push(absentPlayer);
                    alert('El ganador no estaba presente! \n Seguimos jugando horizontales!');
                    self.potentialWinnersHorizontal = [];
                    break;
                  }
                }
                
              } else {

                alert('BINGO - Horizontal - Tenemos varios cartones ganadores! Pasemos lista!');
                self.potentialWinnersHorizontal.forEach(element => { 
                  if (!confirm('Está '+ element.name +' presente en la llamada?')) {
                    element.absent = true;
                    let absentPlayer = new Object();
                    absentPlayer['id'] = element.id;
                    absentPlayer['name'] = element.name;
                    self.currentGame.settings.absentPlayers.push(absentPlayer);
                  } 
                });

                let newArray = [];

                self.potentialWinnersHorizontal.forEach(element => { 
                  if (!element.absent) {
                    newArray.push(element);
                  } 
                });

                self.potentialWinnersHorizontal = newArray;
                this.checkAfterAbsentsHorizontal();

              }
            } 
          }
          break;
        
        case 'fullGame':
          if (way[1] && self.currentGame.winners[round].fullGame.length == 0) {
            if (self.potentialWinnersFull.length == 0) {
              break;
            } else {
              if (self.potentialWinnersFull.length == 1) {
                if(!self.checkAbsentPlayer(self.potentialWinnersFull[0])) {
                  alert('BINGO - CARTON LLENO - ' + self.potentialWinnersFull[0].name );
                  if (confirm('Es el único ganador! Está '+ self.potentialWinnersFull[0].name +' presente en la llamada?')) {
                    //player.winnerDetail += ' - 4 esquinas ';
                    let round = self.currentGame.winners.length - 1;
                    let winnerPlayer = new Object();
                    winnerPlayer['id'] = self.potentialWinnersFull[0].id;
                    winnerPlayer['name'] = self.potentialWinnersFull[0].name;
                    winnerPlayer['numbers'] = self.potentialWinnersFull[0].numbers;
                    winnerPlayer['winnerDetails'] = self.potentialWinnersFull[0].winnerDetail;
                    winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
                    self.currentGame.winners[round].fullGame.push(winnerPlayer);
                    self.potentialWinnersFull = [];
                  } else {
                    let absentPlayer = new Object();
                    absentPlayer['id'] = self.potentialWinnersFull[0].id;
                    absentPlayer['name'] = self.potentialWinnersFull[0].name;
                    self.currentGame.settings.absentPlayers.push(absentPlayer);
                    alert('El ganador no estaba presente! \n Seguimos jugando carton lleno!');
                    self.potentialWinnersFull = [];
                    break;
                  }
                }
                
              } else {

                alert('BINGO - CARTON LLENO - Tenemos varios cartones ganadores! Pasemos lista!');
                self.potentialWinnersFull.forEach(element => { 
                  if (!confirm('Está '+ element.name +' presente en la llamada?')) {
                    element.absent = true;
                    let absentPlayer = new Object();
                    absentPlayer['id'] = element.id;
                    absentPlayer['name'] = element.name;
                    self.currentGame.settings.absentPlayers.push(absentPlayer);
                  } 
                });

                let newArray = [];

                self.potentialWinnersFull.forEach(element => { 
                  if (!element.absent) {
                    newArray.push(element);
                  } 
                });

                self.potentialWinnersFull = newArray;
                this.checkAfterAbsentsFullGame();

              }
            } 
          }
          break;
        default: break;
      }
    });

    self.rankingOfWinners.sort(self.compareRanking);
    this.currentGame.settings['rankingOfWinners'] = this.rankingOfWinners;
  }

  checkAfterAbsentsCorners() {
    let self = this;
    let round = self.currentGame.winners.length - 1;
    if (self.potentialWinnersCorners.length == 0) {
      alert('Ninguno de los ganadores estaba presente! \n Seguimos jugando 4 esquinas!');
      self.potentialWinnersCorners = [];
      self.potentialWinnersCorners.forEach(element => {
        let absentPlayer = new Object();
        absentPlayer['id'] = element.id;
        absentPlayer['name'] = element.name;
        self.currentGame.settings.absentPlayers.push(absentPlayer);
      });
    } else {
      if (self.potentialWinnersCorners.length == 1) {
        if(!self.checkAbsentPlayer(self.potentialWinnersCorners[0])) {
          alert('Tenemos ganador del premio 4 esquinas! Unico ganador presente: ' + self.potentialWinnersCorners[0].name);
          let winnerPlayer = new Object();
          winnerPlayer['id'] = self.potentialWinnersCorners[0].id;
          winnerPlayer['name'] = self.potentialWinnersCorners[0].name;
          winnerPlayer['numbers'] = self.potentialWinnersCorners[0].numbers;
          winnerPlayer['winnerDetails'] = self.potentialWinnersCorners[0].winnerDetail;
          winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
          self.currentGame.winners[round].corners.push(winnerPlayer);
          self.potentialWinnersCorners = [];
        }
      } else {
        alert('Como tenemos varios ganadores presentes, vamos a la tómbola de desempate!');
        self.showUntieRaffle = true;
        self.checkingUntieCorners = true;
        self.currentUntieNumbers = [];
        /** Continue checking winner logic after click in other methods. */
      }
    }
  }

  checkAfterAbsentsVertical() {
    let self = this;
    let round = self.currentGame.winners.length - 1;
    if (self.potentialWinnersVertical.length == 0) {
      alert('Ninguno de los ganadores estaba presente! \n Seguimos jugando verticales!');
      self.potentialWinnersVertical = [];
      self.potentialWinnersVertical.forEach(element => {
        let absentPlayer = new Object();
        absentPlayer['id'] = element.id;
        absentPlayer['name'] = element.name;
        self.currentGame.settings.absentPlayers.push(absentPlayer);
      });
    } else {
      if (self.potentialWinnersVertical.length == 1) {
        if(!self.checkAbsentPlayer(self.potentialWinnersVertical[0])) {
          alert('Tenemos ganador del premio vertical! Unico ganador presente: ' + self.potentialWinnersVertical[0].name);
          let winnerPlayer = new Object();
          winnerPlayer['id'] = self.potentialWinnersVertical[0].id;
          winnerPlayer['name'] = self.potentialWinnersVertical[0].name;
          winnerPlayer['numbers'] = self.potentialWinnersVertical[0].numbers;
          winnerPlayer['winnerDetails'] = self.potentialWinnersVertical[0].winnerDetail;
          winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
          self.currentGame.winners[round].vertical.push(winnerPlayer);
          self.potentialWinnersVertical = [];
        }
      } else {
        alert('Como tenemos varios ganadores presentes, vamos a la tómbola de desempate!');
        self.showUntieRaffle = true;
        self.checkingUntieVertical = true;
        self.currentUntieNumbers = [];
        /** Continue checking winner logic after click in other methods. */
      }
    }
  }

  checkAfterAbsentsHorizontal() {
    let self = this;
    let round = self.currentGame.winners.length - 1;
    if (self.potentialWinnersHorizontal.length == 0) {
      alert('Ninguno de los ganadores estaba presente! \n Seguimos jugando horizontales!');
      self.potentialWinnersHorizontal = [];
      self.potentialWinnersHorizontal.forEach(element => {
        let absentPlayer = new Object();
        absentPlayer['id'] = element.id;
        absentPlayer['name'] = element.name;
        self.currentGame.settings.absentPlayers.push(absentPlayer);
      });
    } else {
      if (self.potentialWinnersHorizontal.length == 1) {
        if(!self.checkAbsentPlayer(self.potentialWinnersHorizontal[0])) {
          alert('Tenemos ganador del premio horizontal! Unico ganador presente: ' + self.potentialWinnersHorizontal[0].name);
          let winnerPlayer = new Object();
          winnerPlayer['id'] = self.potentialWinnersHorizontal[0].id;
          winnerPlayer['name'] = self.potentialWinnersHorizontal[0].name;
          winnerPlayer['numbers'] = self.potentialWinnersHorizontal[0].numbers;
          winnerPlayer['winnerDetails'] = self.potentialWinnersHorizontal[0].winnerDetail;
          winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
          self.currentGame.winners[round].horizontal.push(winnerPlayer);
          self.potentialWinnersHorizontal = [];
        }
      } else {
        alert('Como tenemos varios ganadores presentes, vamos a la tómbola de desempate!');
        self.showUntieRaffle = true;
        self.checkingUntieHorizontal = true;
        self.currentUntieNumbers = [];
        /** Continue checking winner logic after click in other methods. */
      }
    }
  }

  checkAfterAbsentsFullGame() {
    let self = this;
    let round = self.currentGame.winners.length - 1;
    if (self.potentialWinnersFull.length == 0) {
      alert('Ninguno de los ganadores estaba presente! \n Seguimos jugando carton lleno!');
      self.potentialWinnersFull = [];
      self.potentialWinnersFull.forEach(element => {
        let absentPlayer = new Object();
        absentPlayer['id'] = element.id;
        absentPlayer['name'] = element.name;
        self.currentGame.settings.absentPlayers.push(absentPlayer);
      });
    } else {
      if (self.potentialWinnersFull.length == 1) {
        if(!self.checkAbsentPlayer(self.potentialWinnersFull[0])) {
          alert('Tenemos ganador del premio carton lleno! Unico ganador presente: ' + self.potentialWinnersFull[0].name);
          let winnerPlayer = new Object();
          winnerPlayer['id'] = self.potentialWinnersFull[0].id;
          winnerPlayer['name'] = self.potentialWinnersFull[0].name;
          winnerPlayer['numbers'] = self.potentialWinnersFull[0].numbers;
          winnerPlayer['winnerDetails'] = self.potentialWinnersFull[0].winnerDetail;
          winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
          self.currentGame.winners[round].fullGame.push(winnerPlayer);
          self.potentialWinnersFull = [];
        }
      } else {
        alert('Como tenemos varios ganadores presentes, vamos a la tómbola de desempate!');
        self.showUntieRaffle = true;
        self.checkingUntieFull = true;
        self.currentUntieNumbers = [];
        /** Continue checking winner logic after click in other methods. */
      }
    }
  }


  checkWinnerCorners () {
    let self = this;
    let allScoresUntied = true;
    let winnerIndex = -1;
    let higherNumber = 0;
    let currentIndex = 0;
    this.potentialWinnersCorners.forEach(element => {
      if (element.untieScore == 0) {
        allScoresUntied = false;
      }
    });

    if (allScoresUntied) {
      this.potentialWinnersCorners.forEach(element => {
        if (element.untieScore > higherNumber) {
          higherNumber = element.untieScore;
          winnerIndex = currentIndex;
        }
        currentIndex++;
      });
      setTimeout(function(){ 
        alert('El ganador de 4 esquinas, por ser el número más alto ('+ higherNumber + ') es: ' + self.potentialWinnersCorners[winnerIndex].name);
        let winnerPlayer = new Object();
        let round = self.currentGame.winners.length - 1;
        winnerPlayer['id'] = self.potentialWinnersCorners[winnerIndex].id;
        winnerPlayer['name'] = self.potentialWinnersCorners[winnerIndex].name;
        winnerPlayer['numbers'] = self.potentialWinnersCorners[winnerIndex].numbers;
        winnerPlayer['winnerDetails'] = self.potentialWinnersCorners[winnerIndex].winnerDetail;
        winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
        self.currentGame.winners[round].corners.push(winnerPlayer);
        self.checkIfFinished();
      }, 1000);
      setTimeout(function(){ 
        self.showUntieRaffle = false;
        self.checkingUntieCorners = false;
        self.currentUntieNumbers = [];
      }, 3000);
    } 
  }


  checkWinnerVerticals () {
    let self = this;
    let allScoresUntied = true;
    let winnerIndex = -1;
    let higherNumber = 0;
    let currentIndex = 0;
    this.potentialWinnersVertical.forEach(element => {
      if (element.untieScore == 0) {
        allScoresUntied = false;
      }
    });

    if (allScoresUntied) {
      this.potentialWinnersVertical.forEach(element => {
        if (element.untieScore > higherNumber) {
          higherNumber = element.untieScore;
          winnerIndex = currentIndex;
        }
        currentIndex++;
      });
      setTimeout(function(){ 
        alert('El ganador de verticales, por ser el número más alto ('+ higherNumber + ') es: ' + self.potentialWinnersVertical[winnerIndex].name);
        let winnerPlayer = new Object();
        let round = self.currentGame.winners.length - 1;
        winnerPlayer['id'] = self.potentialWinnersVertical[winnerIndex].id;
        winnerPlayer['name'] = self.potentialWinnersVertical[winnerIndex].name;
        winnerPlayer['numbers'] = self.potentialWinnersVertical[winnerIndex].numbers;
        winnerPlayer['winnerDetails'] = self.potentialWinnersVertical[winnerIndex].winnerDetail;
        winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
        self.currentGame.winners[round].vertical.push(winnerPlayer);
        self.checkIfFinished();
      }, 1000);
      setTimeout(function(){ 
        self.showUntieRaffle = false;
        self.checkingUntieVertical = false;
        self.currentUntieNumbers = [];
      }, 3000);
    } 
  }

  checkWinnerHorizontals () {
    let self = this;
    let allScoresUntied = true;
    let winnerIndex = -1;
    let higherNumber = 0;
    let currentIndex = 0;
    this.potentialWinnersHorizontal.forEach(element => {
      if (element.untieScore == 0) {
        allScoresUntied = false;
      }
    });

    if (allScoresUntied) {
      this.potentialWinnersHorizontal.forEach(element => {
        if (element.untieScore > higherNumber) {
          higherNumber = element.untieScore;
          winnerIndex = currentIndex;
        }
        currentIndex++;
      });
      setTimeout(function(){ 
        alert('El ganador de horizontales, por ser el número más alto ('+ higherNumber + ') es: ' + self.potentialWinnersHorizontal[winnerIndex].name);
        let winnerPlayer = new Object();
        let round = self.currentGame.winners.length - 1;
        winnerPlayer['id'] = self.potentialWinnersHorizontal[winnerIndex].id;
        winnerPlayer['name'] = self.potentialWinnersHorizontal[winnerIndex].name;
        winnerPlayer['numbers'] = self.potentialWinnersHorizontal[winnerIndex].numbers;
        winnerPlayer['winnerDetails'] = self.potentialWinnersHorizontal[winnerIndex].winnerDetail;
        winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
        self.currentGame.winners[round].horizontal.push(winnerPlayer);
        self.checkIfFinished();
      }, 1000);
      setTimeout(function(){ 
        self.showUntieRaffle = false;
        self.checkingUntieHorizontal = false;
        self.currentUntieNumbers = [];
      }, 3000);
    } 
  }

  checkWinnerFullGame () {
    let self = this;
    let allScoresUntied = true;
    let winnerIndex = -1;
    let higherNumber = 0;
    let currentIndex = 0;
    this.potentialWinnersFull.forEach(element => {
      if (element.untieScore == 0) {
        allScoresUntied = false;
      }
    });

    if (allScoresUntied) {
      this.potentialWinnersFull.forEach(element => {
        if (element.untieScore > higherNumber) {
          higherNumber = element.untieScore;
          winnerIndex = currentIndex;
        }
        currentIndex++;
      });
      setTimeout(function(){ 
        alert('El ganador de carton lleno, por ser el número más alto ('+ higherNumber + ') es: ' + self.potentialWinnersFull[winnerIndex].name);
        let winnerPlayer = new Object();
        let round = self.currentGame.winners.length - 1;
        winnerPlayer['id'] = self.potentialWinnersFull[winnerIndex].id;
        winnerPlayer['name'] = self.potentialWinnersFull[winnerIndex].name;
        winnerPlayer['numbers'] = self.potentialWinnersFull[winnerIndex].numbers;
        winnerPlayer['winnerDetails'] = self.potentialWinnersFull[winnerIndex].winnerDetail;
        winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
        self.currentGame.winners[round].fullGame.push(winnerPlayer);
        self.checkIfFinished();
      }, 1000);
      setTimeout(function(){ 
        self.showUntieRaffle = false;
        self.checkingUntieFull = false;
        self.currentUntieNumbers = [];
      }, 3000);
    } 
  }

  getRandomNumber2(min, max, type, clicks) {
    let self = this;
    self.spinningRaffle = true;
    let newNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    if (self.isInArrayUntie(newNumber)) {
      self.getRandomNumber2(min, max, type, clicks);
    } else {
      setTimeout(function(){
        self.currentUntieNumbers.push(newNumber);
        self.unTieNumber = newNumber;
        self.spinningRaffle = false;
        switch(type) {
          case 'corners': {
            self.potentialWinnersCorners[clicks].untieScore = newNumber;
            self.cornersClick = clicks + 1;
            self.checkWinnerCorners();
          }
          break;
          case 'vertical': {
            self.potentialWinnersVertical[clicks].untieScore = newNumber;
            self.verticalClick = clicks + 1;
            self.checkWinnerVerticals();
          }
          break;
          case 'horizontal': {
            self.potentialWinnersHorizontal[clicks].untieScore = newNumber;
            self.horizontalClick = clicks + 1;
            self.checkWinnerHorizontals();
          } 
          break;
          case 'fullGame': {
            self.potentialWinnersFull[clicks].untieScore = newNumber;
            self.fullGameClick = clicks + 1;
            self.checkWinnerFullGame();
          } 
          break;
        }
        
      }, 5900);
    }
  }


  checkAbsentPlayer(player) {
    let found = false;
    this.currentGame.settings.absentPlayers.forEach(element => {
      if (element.id == player.id) {
        found = true;
      }
    });
    return found;
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
    if (!self.checkAbsentPlayer(player)) {
      if (player.corners == 4) {
        let winnerPlayer = new Object();
        winnerPlayer['id'] = player.id;
        winnerPlayer['name'] = player.name;
        winnerPlayer['numbers'] = player.numbers;
        winnerPlayer['winnerDetails'] = player.winnerDetail;
        winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
        winnerPlayer['absent'] = false;
        winnerPlayer['untieScore'] = 0;
        self.potentialWinnersCorners.push(winnerPlayer);
      }
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

    if(!this.checkAbsentPlayer(player)) {
      if (player.verticalB == 5) {
        let winnerPlayer = new Object();
        //player.winnerDetail += ' - Vertical - Columna B ';
        winnerPlayer['id'] = player.id;
        winnerPlayer['name'] = player.name;
        winnerPlayer['numbers'] = player.numbers;
        winnerPlayer['winnerDetails'] = player.winnerDetail;
        winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
        winnerPlayer['absent'] = false;
        winnerPlayer['untieScore'] = 0;
        self.potentialWinnersVertical.push(winnerPlayer); 
      }
      if (player.verticalI == 5) {
        let winnerPlayer = new Object();
       // player.winnerDetail += ' - Vertical - Columna I ';
        winnerPlayer['id'] = player.id;
        winnerPlayer['name'] = player.name;
        winnerPlayer['numbers'] = player.numbers;
        winnerPlayer['winnerDetails'] = player.winnerDetail;
        winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
        winnerPlayer['absent'] = false;
        winnerPlayer['untieScore'] = 0;
        self.potentialWinnersVertical.push(winnerPlayer); 
      }
      if (player.verticalN == 4) {
        let winnerPlayer = new Object();
       // player.winnerDetail += ' - Vertical - Columna N ';
        winnerPlayer['id'] = player.id;
        winnerPlayer['name'] = player.name;
        winnerPlayer['numbers'] = player.numbers;
        winnerPlayer['winnerDetails'] = player.winnerDetail;
        winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
        winnerPlayer['absent'] = false;
        winnerPlayer['untieScore'] = 0;
        self.potentialWinnersVertical.push(winnerPlayer); 
      }
      if (player.verticalG == 5) {
        let winnerPlayer = new Object();
       // player.winnerDetail += ' - Vertical - Columna G ';
        winnerPlayer['id'] = player.id;
        winnerPlayer['name'] = player.name;
        winnerPlayer['numbers'] = player.numbers;
        winnerPlayer['winnerDetails'] = player.winnerDetail;
        winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
        winnerPlayer['absent'] = false;
        winnerPlayer['untieScore'] = 0;
        self.potentialWinnersVertical.push(winnerPlayer); 
      }
      if (player.verticalO == 5) {
        let winnerPlayer = new Object();
       // player.winnerDetail += ' - Vertical - Columna O ';
        winnerPlayer['id'] = player.id;
        winnerPlayer['name'] = player.name;
        winnerPlayer['numbers'] = player.numbers;
        winnerPlayer['winnerDetails'] = player.winnerDetail;
        winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
        winnerPlayer['absent'] = false;
        winnerPlayer['untieScore'] = 0;
        self.potentialWinnersVertical.push(winnerPlayer); 
      } 
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

    if (!self.checkAbsentPlayer(player)) {
      if (player.horizontal1 == 5) {
        let winnerPlayer = new Object();
        winnerPlayer['id'] = player.id;
        winnerPlayer['name'] = player.name;
        winnerPlayer['numbers'] = player.numbers;
        winnerPlayer['winnerDetails'] = player.winnerDetail;
        winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
        winnerPlayer['absent'] = false;
        winnerPlayer['untieScore'] = 0;
        self.potentialWinnersHorizontal.push(winnerPlayer);
      }
      if (player.horizontal2 == 5) {
        let winnerPlayer = new Object();
        winnerPlayer['id'] = player.id;
        winnerPlayer['name'] = player.name;
        winnerPlayer['numbers'] = player.numbers;
        winnerPlayer['winnerDetails'] = player.winnerDetail;
        winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
        winnerPlayer['absent'] = false;
        winnerPlayer['untieScore'] = 0;
        self.potentialWinnersHorizontal.push(winnerPlayer);
      }
      if (player.horizontal3 == 4) {
        let winnerPlayer = new Object();
        winnerPlayer['id'] = player.id;
        winnerPlayer['name'] = player.name;
        winnerPlayer['numbers'] = player.numbers;
        winnerPlayer['winnerDetails'] = player.winnerDetail;
        winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
        winnerPlayer['absent'] = false;
        winnerPlayer['untieScore'] = 0;
        self.potentialWinnersHorizontal.push(winnerPlayer);
      }
      if (player.horizontal4 == 5) {
        let winnerPlayer = new Object();
        winnerPlayer['id'] = player.id;
        winnerPlayer['name'] = player.name;
        winnerPlayer['numbers'] = player.numbers;
        winnerPlayer['winnerDetails'] = player.winnerDetail;
        winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
        winnerPlayer['absent'] = false;
        winnerPlayer['untieScore'] = 0;
        self.potentialWinnersHorizontal.push(winnerPlayer);
      }
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
    
    if(!self.checkAbsentPlayer(player)) {
      if (player.fullGame == 24) {
        let winnerPlayer = new Object();
        winnerPlayer['id'] = player.id;
        winnerPlayer['name'] = player.name;
        winnerPlayer['numbers'] = player.numbers;
        winnerPlayer['winnerDetails'] = player.winnerDetail;
        winnerPlayer['selectedNumbers'] = self.currentGame.settings.selectedNumbers;
        winnerPlayer['absent'] = false;
        winnerPlayer['untieScore'] = 0;
        self.potentialWinnersFull.push(winnerPlayer);
      }
    }
    
  }

}

