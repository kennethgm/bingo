import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from './../../services/card.service';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.css']
})
export class CardDetailsComponent implements OnInit {
  currentCard = null;
  message = '';

  constructor(
    private cardService: CardService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    this.getCard(this.route.snapshot.paramMap.get('id'));
  }

  getCard(id): void {
    this.cardService.get(id)
      .subscribe(
        data => {
          this.currentCard = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

 
  updateCard(): void {
    this.cardService.update(this.currentCard.id, this.currentCard)
      .subscribe(
        response => {
          console.log(response);
          this.message = 'The card was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  deleteCard(): void {
    this.cardService.delete(this.currentCard.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/cards']);
        },
        error => {
          console.log(error);
        });
  }
}
