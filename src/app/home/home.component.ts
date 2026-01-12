import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { HomeService } from '../services/home.service';
import { EventService } from '../services/event.service';
import { Shell } from '../shell/shell.service';
import axios from 'axios';
import { environment } from '@env/environment';
import defaultImage1 from '../../assets/images/wheretogo/mountain.png';
import defaultImage2 from '../../assets/images/wheretogo/beaches.png';
import defaultImage3 from '../../assets/images/wheretogo/deserts.png';
import defaultImage4 from '../../assets/images/wheretogo/religioussites.png';
import defaultImage5 from '../../assets/images/wheretogo/historicalplaces.png';
import defaultImage6 from '../../assets/images/wheretogo/cities.png';

import defaultImage7 from '../../assets/images/whattodo/list1.png';
import defaultImage8 from '../../assets/images/whattodo/list2.png';
import defaultImage9 from '../../assets/images/whattodo/list3.png';
import defaultImage10 from '../../assets/images/whattodo/shopping.png';
import defaultImage11 from '../../assets/images/whattodo/spa.png';
import defaultImage12 from '../../assets/images/whattodo/hotel.png';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  locations: any;
  activities: any;
  categories: any;
  topDestinations: any[] = [];
  topTouristDestinationsCategoryId: string = ''; // Store the category ID
  images1 = [
    defaultImage1,
    defaultImage2,
    defaultImage3,
    defaultImage4,
    defaultImage5,
    defaultImage6,
  ];
  images2 = [
    defaultImage7,
    defaultImage8,
    defaultImage9,
    defaultImage10,
    defaultImage11,
    defaultImage12,
  ];
  isWhereToGo: boolean;
  show: boolean;
  weatherFlag = false;
  constructor(
    private homeService: HomeService,
    private eventService: EventService,
    private shellService: Shell
  ) {}

  ngOnInit() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    this.weatherFlag = true;
    this.isLoading = true;
    this.getLocations();
    this.getCategories();
    this.loadTopDestinations();
    this.loadMainScript();
    //  this.loadWeatherScript();
    this.homeService.countryMessage.subscribe((data: any) => {
      this.show = data.country == 'Pakistan' ? false : true;
    });
  }

  loadTopDestinations() {
    // First, get the 'top-tourist-destinations' category to get its ID
    this.homeService.getCategories('categoryType=destination&pageSize=0').then((categories: any) => {
      const topTouristCategory = categories.find((cat: any) => cat.slug === 'top-tourist-destinations');
      if (topTouristCategory) {
        this.topTouristDestinationsCategoryId = topTouristCategory._id;
      }
      
      // Get all provinces like Islamabad, Punjab, Sindh, Balochistan, KPK, etc.
      // Similar to how top-tourist-destinations category page works
      this.shellService.getProvinces().then((provinces: any) => {
        // Sort provinces alphabetically
        const sorted = provinces.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        
        // Show all provinces without filtering or limiting
        this.topDestinations = sorted;
      }).catch((error: any) => {
        console.log('Error loading top destinations (provinces):', error);
        // Fallback to featured locations if provinces fail
        axios
          .get(`${environment.serverUrl}/location?isFeatured=true&pageSize=0`)
          .then((response: any) => {
            this.topDestinations = response.data.data || [];
          })
          .catch((err: any) => {
            console.log('Error loading fallback destinations:', err);
            this.topDestinations = [];
          });
      });
    }).catch((error: any) => {
      console.log('Error loading category:', error);
      // Still try to load provinces even if category fetch fails
      this.shellService.getProvinces().then((provinces: any) => {
        const sorted = provinces.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        this.topDestinations = sorted;
      });
    });
  }

  getCategories() {
    let params = `isFeatured=true&pageSize=6`;
    this.homeService.getActivities(params).then((categories: any) => {
      this.isLoading = false;
      this.isWhereToGo = false;
      this.activities = categories.slice(0, 6);
    });
  }
  getLocations() {
    let params = `isFeatured=true&pageSize=6`;
    this.homeService.getCategories(params).then((locations: any) => {
      this.isLoading = false;
      this.isWhereToGo = true;
      this.categories = locations.slice(0, 6);
    });
  }

  public loadMainScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = '../../assets/js/main.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  // public loadWeatherScript() {
  //   let body = <HTMLDivElement>document.body;
  //   let script = document.createElement('script');
  //   script.innerHTML = '';
  //   script.src = 'assets/js/weather.js';
  //   // script.async = true;
  //   // script.defer = true;
  //   body.appendChild(script);
  //   this.weatherFlag = true;
  // }
}
