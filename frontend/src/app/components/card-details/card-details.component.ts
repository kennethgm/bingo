import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from './../../services/card.service';
import { GameService } from './../../services/game.service';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss']
})
export class CardDetailsComponent implements OnInit {
  currentCard = null;
  successMessage = '';
  message = '';
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  games = [];
  currentLink = '';
  currentDate = '';

  constructor(
    private cardService: CardService,
    private route: ActivatedRoute,
    private gameService: GameService,
    private router: Router,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    let self = this;
    this.message = '';
    this.getCard(this.route.snapshot.paramMap.get('id'));
    this.gameService.getAll().subscribe(
      data => {
        this.games = data;
        this.games.forEach(element => {
          if (element.id == self.currentCard.gameCode) {
            self.currentLink = element.zoomLink;
            self.currentDate = element.eventDate;
            //self.currentDate = self.datepipe.transform(element.startDate, "dd") + ' de '+ self.translate(self.datepipe.transform(element.startDate, "LLLL")) + ' a las ' + self.datepipe.transform(element.startDate, "hh:mm a") ;
           // console.log('currentLink', self.currentLink);
           // console.log('currentDate', self.currentDate);
          }
        });
        //console.log('games', this.games);
      }
    );
  }

  translate(month) {
    switch(month) {
      case 'January':
        return 'Enero';
      case 'February': 
        return 'Febrero';
      case 'March':
        return 'Marzo';
      case 'April':
        return 'Abril';
      case 'May':
        return 'Mayo';
      case 'June':
        return 'Junio';
      case 'July': 
        return 'Julio';
      case 'August':
        return 'Agosto';
      case 'September':
        return 'Setiembre';
      case 'October':
        return 'Octubre';
      case 'November':
        return 'Noviembre';
      case 'December':
        return 'Diciembre';
    }
  }

  getCard(id): void {
    this.cardService.get(id)
      .subscribe(
        data => {
          this.currentCard = data;
        //  console.log(data);
        },
        error => {
          console.log(error);
      }
    );
  }

 
  updateCard(): void {
    this.cardService.update(this.currentCard.id, this.currentCard)
      .subscribe(
        response => {
        //  console.log(response);
          this.message = 'El carton fue actualizado correctamente!';
        },
        error => {
          console.log(error);
        });
  }

  deleteCard(): void {
    if (confirm('Estas seguro que quieres borrar este carton?')) {
      this.cardService.delete(this.currentCard.id)
      .subscribe(
        response => {
        //  console.log(response);
        //  alert(response);
          this.router.navigate(['/']);

        },
        error => {
          console.log(error);
    });
    }
  }

  printCard() {
    window.print();
  }

  download(id) {
    //alert (id);
    let self = this;
    html2canvas(this.screen.nativeElement, {scrollY: -window.scrollY}).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
    //  console.log('screen', self.screen);
    //  console.log('canvas', canvas);
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = id + '.png';
      this.downloadLink.nativeElement.click();
    });
  }

  sendByEmail(){
    this.successMessage = '';
    let self = this;
    this.games.forEach(element => {
      if (element.id == self.currentCard.gameCode) {
        self.currentLink = element.zoomLink;
       /* let date = new Date(element.startDate);     
        element.startDate = date.setHours(date.getHours() - 6);  
        self.currentDate = self.datepipe.transform(element.startDate, "dd") + ' de '+ self.translate(self.datepipe.transform(element.startDate, "LLLL")) + ' a las ' + self.datepipe.transform(element.startDate, "hh:mm a") ;
       */ 
        self.currentDate = element.eventDate;
        //  console.log('currentLink', self.currentLink);
       // console.log('currentDate', self.currentDate);
      }
    });
    html2canvas(this.screen.nativeElement, {scrollY: -window.scrollY + 3, width:534, height: 558}).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();

      let requestData = new Object();
      requestData['emailTo'] =   this.currentCard.email;
      requestData['message'] = 'Saludos, \n\n Estimado(a) '+ this.currentCard.name + '\n\n De parte de Kerberos Producciones'+
      ' y su marca LaTómbolaCR es un placer servirle en este juego de tómbola virtual. '+
      ' \n Le deseamos la mejor de las suertes en el juego a realizarse el '+ this.currentDate +' \n '+
      'Adjuntamos la imágen de su cartón, con un código único y de uso exclusivo para este juego. \n\n '+
      'Este es link de acceso a la transimión: ' + this.currentLink + '\n\n'+
      'Se despide atentamente LaTómbolaCR, con una producción más de Kerberos Producciones. \nEsta es nuestra pagina de Facebook, SIGUENOS: https://www.facebook.com/keroproductions/ \n\n' +
      'Michael Martínez Castro. \n'+
      'Productor de Kerberos Producciones. \n'+
      'Contacto: 6161 2298 ';
      
      requestData['path'] = this.canvas.nativeElement.src; 
      requestData['subject'] = 'Cartón Oficial de La Tómbola CR';
      
      this.cardService.sendEmail(requestData).subscribe((data) => {
        this.successMessage = 'El cartón fue enviado correctamente.';
      });
      
    
    });
  }

}
