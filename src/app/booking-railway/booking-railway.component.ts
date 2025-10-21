import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-railway',
  templateUrl: './booking-railway.component.html',
  styleUrls: ['./booking-railway.component.scss']
})
export class BookingRailwayComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.location.href = 'https://pakrail.gov.pk/';
  }

}
