import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cabs-listing',
  templateUrl: './cabs-listing.component.html',
  styleUrls: ['./cabs-listing.component.scss']
})
export class CabsListingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

}
