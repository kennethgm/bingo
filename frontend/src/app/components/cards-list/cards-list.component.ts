import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { CardService } from 'src/app/services/card.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss']
})
export class CardsListComponent implements OnInit {

  cards: any;
  games: any;
  currentCard = null;
  currentIndex = -1;
  name = '';
  successMessage = '';
  currentLink = '';
  currentDate = '';
  openSubpage = false;
  cardsToSend = [];
  currentEmailId = 0;

  constructor(private cardService: CardService, private gameService: GameService) { }

  ngOnInit(): void {
    this.retrievecards();
    this.retrieveGames();
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

  
  retrieveGames(): void {
    this.gameService.getAll()
      .subscribe(
        data => {
          this.games = data;
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

  openSublist(id) {
    let element = document.getElementById("game-" + id);
    let icon_element = document.getElementById('icon-' + id);
    //console.log('element', element);
    //console.log('icon_element', icon_element);
    if (getComputedStyle(element, null).display == 'none') {
      element.setAttribute('style', 'display: block;');
      icon_element.setAttribute('class', 'open-submenu fa fa-caret-up');
    } else {
      element.setAttribute('style', 'display: none;');
      icon_element.setAttribute('class', 'open-submenu fa fa-caret-down');
    }
  }

  openPage(gameCode) {
    this.openSubpage = true;
    this.cardsToSend = [];
    this.currentEmailId = gameCode;
    this.cards.forEach(element => {
      if (element.gameCode == gameCode) {
        this.cardsToSend.push(element);
      }
    });
  }

  sendEmailAll(gameCode) {
    if(confirm('Esta seguro de que quiere enviar el correo a TODOS los participantes?')) {
      let index = 0;
      let self = this;
      this.cardsToSend.forEach(element => {
        if (index <= 10) {
          self.sendByEmail(element.id, gameCode, element);
        } else {
          /** TO DO THIS PART OF WAIT */
          setTimeout(function(){
            index = 0;
          }, 2000);
        }
        index++;
      });
    }
  }

  sendByEmail(id, gameCode, card){
    this.successMessage = '';
    let self = this;
    let item = document.getElementById("card-"+id+"-"+gameCode);
    let canvasElement = document.getElementById("canvas-"+id+"-"+gameCode);
    this.games.forEach(element => {
      if (element.id == gameCode) {
        self.currentLink = element.zoomLink;
        self.currentDate = element.eventDate;
      }
    });
    html2canvas(item, {scrollY: -window.scrollY + 3, width:534, height: 558}).then(canvas => {
      canvasElement.setAttribute('src',canvas.toDataURL());  

      let requestData = new Object();
      requestData['emailTo'] =   card.email;
      requestData['message'] = 'Saludos, \n\n Estimado(a) '+ card.name + '\n\n De parte de Kerberos Producciones'+
      ' y su marca LaTómbolaCR es un placer servirle en este juego de tómbola virtual. '+
      ' \n Le deseamos la mejor de las suertes en el juego a realizarse el '+ this.currentDate +' \n '+
      'Adjuntamos la imágen de su cartón, con un código único y de uso exclusivo para este juego. \n\n '+
      'Este es link de acceso a la transimión: ' + this.currentLink + '\n\n'+
      'Se despide atentamente LaTómbolaCR, con una producción más de Kerberos Producciones. \nEsta es nuestra pagina de Facebook, SIGUENOS: https://www.facebook.com/keroproductions/ \n\n' +
      'Michael Martínez Castro. \n'+
      'Productor de Kerberos Producciones. \n'+
      'Contacto: 6161 2298 ';
      
      requestData['path'] = canvasElement.getAttribute('src'); 
      requestData['subject'] = 'Cartón Oficial de La Tómbola CR';
      
      this.cardService.sendEmail(requestData).subscribe((data) => {
        this.successMessage = 'El cartón fue enviado correctamente.';
      });
      
    
    });
  }


}
