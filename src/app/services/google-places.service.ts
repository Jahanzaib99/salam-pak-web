import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

declare var google: any;

export interface PlaceResult {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  price_level?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesService {

  private placesService: any;
  private map: any;
  private retryCount = 0;
  private maxRetries = 5;

  constructor() {
    this.initializePlacesService();
  }

  private initializePlacesService() {
    if (typeof google !== 'undefined' && google.maps) {
      this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
    }
  }

  // Get nearby places using Google Places API
  getNearbyPlaces(lat: number, lng: number, type: string, radius: number = 5000): Observable<PlaceResult[]> {
    return new Observable(observer => {
      // Wait for Google Maps to be loaded
      if (typeof google === 'undefined' || !google.maps) {
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          // Retry after a short delay
          setTimeout(() => {
            this.getNearbyPlaces(lat, lng, type, radius).subscribe(observer);
          }, 1000);
        } else {
          observer.error('Google Maps API not loaded after maximum retries');
        }
        return;
      }

      // Reset retry count on successful load
      this.retryCount = 0;

      if (!this.placesService) {
        this.initializePlacesService();
      }

      if (!this.placesService) {
        observer.error('Google Places API not available');
        return;
      }

      const request = {
        location: new google.maps.LatLng(lat, lng),
        radius: radius,
        type: type
      };

      this.placesService.nearbySearch(request, (results: any[], status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const places = results.map(place => ({
            place_id: place.place_id,
            name: place.name,
            vicinity: place.vicinity,
            rating: place.rating,
            price_level: place.price_level,
            geometry: {
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
            },
            types: place.types
          }));
          observer.next(places);
          observer.complete();
        } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          // No results found, return empty array instead of error
          observer.next([]);
          observer.complete();
        } else {
          console.error('Places request failed:', status);
          observer.error(`Places request failed: ${status}`);
        }
      });
    });
  }

  // Get place details by place_id
  getPlaceDetails(placeId: string): Observable<any> {
    return new Observable(observer => {
      if (!this.placesService) {
        this.initializePlacesService();
      }

      if (!this.placesService) {
        observer.error('Google Places API not available');
        return;
      }

      const request = {
        placeId: placeId,
        fields: ['name', 'formatted_address', 'rating', 'price_level', 'photos', 'reviews', 'opening_hours']
      };

      this.placesService.getDetails(request, (place: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          observer.next(place);
          observer.complete();
        } else {
          console.error('Place details request failed:', status);
          observer.error(`Place details request failed: ${status}`);
        }
      });
    });
  }

  // Map filter types to Google Places types
  getGooglePlaceType(filterType: string): string {
    const typeMapping: { [key: string]: string } = {
      'gas_station': 'gas_station',
      'atm': 'atm',
      'restaurant': 'restaurant',
      'hospital': 'hospital',
      'lodging': 'lodging',
      'amusement_park': 'amusement_park',
      'bank': 'bank',
      'cafe': 'cafe',
      'food': 'meal_takeaway',
      'shopping_mall': 'shopping_mall',
      'park': 'park',
      'tourist_attraction': 'tourist_attraction',
      'hiking': 'park',
      'mountain_trail': 'park',
      'family_tips': 'tourist_attraction',
      'group_houses': 'lodging',
      'cafe_or_dhabba': 'cafe',
      'shops': 'store'
    };

    return typeMapping[filterType] || 'establishment';
  }
}
