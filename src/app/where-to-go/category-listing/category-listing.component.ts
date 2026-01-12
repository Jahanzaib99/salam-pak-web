import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-category-listing',
  templateUrl: './category-listing.component.html',
  styleUrls: ['./category-listing.component.scss'],
})
export class CategoryListingComponent implements OnInit {
  id: any;
  slug: any;
  data: any;
  locations: any;
  filteredRes: any[];
  topDestinations: any[] = [];
  p: number = 1;
  isLoadingTopDestinations: boolean = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly eventService: EventService
  ) {
    this.data = this.route.snapshot.data.category
      ? this.route.snapshot.data.category
      : this.route.snapshot.data.location;
    this.slug = this.data.location ? this.data.slug : '';

    this.route.snapshot.data.category
      ? this.getCategoryLocations(this.data._id)
      : this.getLocationsListing(this.slug);
  }

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    
    // Load top destinations
    this.loadTopDestinations();
  }

  loadTopDestinations() {
    this.isLoadingTopDestinations = true;
    
    if (this.route.snapshot.data.category) {
      // Get top featured destinations for this category
      this.eventService.getCategoryLocations(this.data._id).then((locs) => {
        // Filter featured locations and limit to 9
        const featured = locs.filter((i: any) => i.isFeatured === true);
        this.topDestinations = featured.slice(0, 9);
        this.isLoadingTopDestinations = false;
      });
    } else {
      // Get top destinations for this location/province
      this.eventService.getTrips(this.slug).then((locs) => {
        const featured = locs.filter((i: any) => i.isFeatured === true);
        this.topDestinations = featured.slice(0, 9);
        this.isLoadingTopDestinations = false;
      });
    }
  }

  getCategoryLocations(id: string) {
    this.eventService.getCategoryLocations(id).then((locs) => {
      this.filteredRes = locs.filter((i: any) => {
        return (i.isFeatured = true);
      });
    });
  }

  getLocationsListing(slug: string) {
    this.eventService.getTrips(slug).then((locs) => {
      this.filteredRes = locs.filter((i: any) => {
        return (i.isFeatured = true);
      });
    });
  }

  getRatingStars(rating?: any): string {
    // Get the value
    const val = parseFloat(rating);
    // Turn value into number/100
    const size = (val / 5) * 100;

    return size + '%';
  }
  public loadScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = '../../assets/js/where-to-go.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }
}
