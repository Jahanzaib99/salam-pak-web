import {
  AfterContentChecked,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Shell } from '../shell/shell.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EventService } from '..//services/event.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterContentChecked {
  // @ViewChild(GoogleMap, { static: false }) map: GoogleMap

  markers: any = [];
  zoom = 0;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    // zoomControl: false,
    // scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  };
  locations: any = [];
  selectedLoc: any;
  surroundings: any = [
    { name: 'Restaurants', typeKey: 'restaurant' },
    { name: 'Hotels', typeKey: 'lodging' },
    { name: 'ATMs', typeKey: 'atm' },
    { name: 'Fuel', typeKey: 'gas_station' },
    { name: 'Pharmacies', typeKey: 'pharmacy' },
    { name: 'Hospitals', typeKey: 'hospital' },
    { name: 'Supermarkets', typeKey: 'supermarket' },
    { name: 'Cafes', typeKey: 'cafe' },
  ];
  selectedSurr: any;
  surroundingMakers: any = [];

  infoWondowData = {
    photo: '',
    alias: '',
    province: '',
    redirectLink: '',
  };
  

  constructor(
    private shellService: Shell,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private location: Location,
    private eventService: EventService
  ) {
    this.selectedLoc = this.route.snapshot.paramMap.get('slug');
  }

  ngAfterContentChecked(): void {
    if (this.locations.length > 0) {
      this.getGeoLoc(this.selectedLoc);
    }
  }

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    this.eventService.getAllCities().then((data: any) => {
      data.forEach((item: any) => {
        if (item.locationType === 'city') {
          this.locations.push(item);
        }
      });
    });

    // if (this.route.snapshot.paramMap != undefined) {
    this.selectedLoc = this.route.snapshot.paramMap.get('slug');
    // }
    if (!this.selectedLoc) {
      this.center = {
        lat: 33.6844,
        lng: 73.0479,
      };

      // infoWindow Data filled with Islamabad (in case when no location is selected) initially.
      this.infoWondowData.photo =
        'https://production9240.blob.core.windows.net/ptdc-thumbnails/6c4116ee-c183-4ff3-aa67-3519619326dd';
      this.infoWondowData.alias = 'Islamabad';
      this.infoWondowData.redirectLink =
        'where-to-go/category/federal/location/islamabad';
    }
  }

  getGeoLoc(loc: any) {
    if (this.selectedLoc && this.locations) {
      var obj = this.locations.filter((i: any) => {
        return i.slug == loc;
      });

      // navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: obj[0]?.location?.coordinates[1],
        lng: obj[0]?.location?.coordinates[0],
      };
      // });
      // this.surroundings = this.sortSurroundings(obj[0].surroundings);
      this.infoWondowData.photo = obj[0].thumbnail;
      this.infoWondowData.alias = obj[0].alias;
      this.infoWondowData.redirectLink = `where-to-go/category/${obj[0].parentProvince}/${obj[0].type}/${obj[0].name}`;
    }
  }

  navigateOnClick(loc: any) {
    this.selectedLoc = loc.slug;
    this.center = {
      lat: loc.location.coordinates[1],
      lng: loc.location.coordinates[0],
    };

    let url = `/map/cities/${loc.slug}`;

    this.location.go(url);
    this.getGeoLoc(this.selectedLoc);
  }

  getSurrounding = (data: any) => {
    this.selectedSurr = data.name;
    this.eventService
      .getSurroundings([this.center.lat, this.center.lng], data.typeKey)
      .then((data: any) => {
        this.surroundingMakers = data.data.map((place: any) => ({
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          name: place.name,
          vicinity: place.vicinity,
          type: data.typeKey,
          icon: place.icon
        }));
        // console.log(this.surroundingMakers);
      });
  };

  sortSurroundings(data: any) {
    return data.sort((a: any, b: any) => {
      let nameA = a.name.toLowerCase(),
        nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }

      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });
  }
}
