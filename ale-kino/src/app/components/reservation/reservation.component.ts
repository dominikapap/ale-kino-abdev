import { MovieInfoService } from '../../services/movie-info.service';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

interface Ticket {
  type: string;
  price: number;
}

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  constructor(private movieInfo: MovieInfoService,
    private activatedRoute: ActivatedRoute) {}

  rowLetters: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  rowNumbers: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ];
  ticketTypes: Ticket[] = [
    {
      type: 'bilet normalny',
      price: 2,
    },
    {
      type: 'bilet ulgowy',
      price: 11,
    },
    {
      type: 'bilet rodzinny',
      price: 30,
    },
    {
      type: 'voucher',
      price: 25,
    },
  ];

  isSelected: boolean = false;
  moveTitle: string = '';
  icon: any = 'trash-can';

  ngOnInit(): void {
    // const id = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log(id);
    this.movieInfo.selectedMovieTitle$$.subscribe((title) => {
      this.moveTitle = title;
    });
  }

  addSeat(letter: string, number: number) {
    console.log('seat was clicked', letter, number);
    this.isSelected = true;
  }
}
