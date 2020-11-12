import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from './../../services/card.service';
import { GameService } from './../../services/game.service';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss']
})
export class CardDetailsComponent implements OnInit {
  currentCard = null;
  message = '';
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  games = [];

  constructor(
    private cardService: CardService,
    private route: ActivatedRoute,
    private gameService: GameService,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    this.getCard(this.route.snapshot.paramMap.get('id'));
    this.gameService.getAll().subscribe(
      data => {
        this.games = data;
        //console.log('games', this.games);
      }
    );
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
          alert(response);
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
    let requestData = new Object();
    requestData['emailTo'] =   this.currentCard.email;
    requestData['message'] = 'this is test message';
    requestData['subject'] = 'this is a test subject';
    this.cardService.sendEmail(requestData).subscribe((data) => {
      console.log('data', data);
    });
  }

}
