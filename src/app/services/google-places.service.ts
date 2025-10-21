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

  // Get nearby places using Google Places API with support for multiple types
  getNearbyPlaces(lat: number, lng: number, type: string, radius: number = 5000): Observable<PlaceResult[]> {
    return new Observable(observer => {
      // Set a timeout to prevent hanging requests
      const timeout = setTimeout(() => {
        observer.error('Request timeout - Google Places API took too long to respond');
      }, 30000); // 30 second timeout
      // Wait for Google Maps to be loaded
      if (typeof google === 'undefined' || !google.maps) {
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          // Retry after a short delay
          setTimeout(() => {
            this.getNearbyPlaces(lat, lng, type, radius).subscribe({
              next: (result) => observer.next(result),
              error: (error) => observer.error(error)
            });
          }, 1000);
        } else {
          clearTimeout(timeout);
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
        clearTimeout(timeout);
        observer.error('Google Places API not available');
        return;
      }

      // Handle multiple types for better accuracy
      const typesToSearch = this.getMultipleTypes(type);
      let completedSearches = 0;
      let allResults: PlaceResult[] = [];
      let hasError = false;

      if (typesToSearch.length === 0) {
        observer.next([]);
        observer.complete();
        return;
      }

      typesToSearch.forEach(searchType => {
        try {
          const request = {
            location: new google.maps.LatLng(lat, lng),
            radius: radius,
            type: searchType
          };

          this.placesService.nearbySearch(request, (results: any[], status: any) => {
            completedSearches++;
            
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
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
              allResults = allResults.concat(places);
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              // No results for this type, continue
            } else {
              console.warn(`Places search failed for type ${searchType}:`, status);
            }

            // When all searches are complete, return results
            if (completedSearches === typesToSearch.length) {
              clearTimeout(timeout);
              if (hasError && allResults.length === 0) {
                observer.error('All place searches failed');
              } else {
                // Remove duplicates based on place_id
                const uniqueResults = allResults.filter((place, index, self) => 
                  index === self.findIndex(p => p.place_id === place.place_id)
                );
                observer.next(uniqueResults);
                observer.complete();
              }
            }
          });
        } catch (error) {
          console.error('Error in places search:', error);
          completedSearches++;
          hasError = true;
          
          if (completedSearches === typesToSearch.length) {
            clearTimeout(timeout);
            if (allResults.length === 0) {
              observer.error('Places search failed');
            } else {
              observer.next(allResults);
              observer.complete();
            }
          }
        }
      });
    });
  }

  // Get multiple related types for better search accuracy using only official Google types
  private getMultipleTypes(type: string): string[] {
    const typeGroups: { [key: string]: string[] } = {
      // Food & Drink
      'restaurant': ['restaurant', 'meal_takeaway'],
      'cafe': ['cafe'],
      'bar': ['bar'],
      'bakery': ['bakery'],
      'food': ['meal_takeaway'],
      
      // Accommodation
      'lodging': ['lodging'],
      'hotel': ['lodging'],
      'hotels': ['lodging'],
      
      // Transportation
      'gas_station': ['gas_station'],
      'gas': ['gas_station'],
      'fuel': ['gas_station'],
      'gas_stations': ['gas_station'],
      
      // Financial
      'atm': ['atm'],
      'atms': ['atm'],
      'bank': ['bank'],
      'banks': ['bank'],
      
      // Health
      'hospital': ['hospital'],
      'hospitals': ['hospital'],
      'pharmacy': ['pharmacy'],
      
      // Shopping
      'shopping_mall': ['shopping_mall'],
      'store': ['store'],
      'shops': ['store'],
      'supermarket': ['supermarket'],
      'super_markets': ['supermarket'],
      'super_market': ['supermarket'],
      
      // Recreation
      'park': ['park'],
      'parks': ['park'],
      'tourist_attraction': ['tourist_attraction'],
      'attractions': ['tourist_attraction'],
      'amusement_park': ['amusement_park'],
      'zoo': ['zoo'],
      'museum': ['museum'],
      
      // Services
      'post_office': ['post_office'],
      'police': ['police'],
      'fire_station': ['fire_station'],
      
      // Education
      'school': ['school'],
      'university': ['university'],
      
      // Religious
      'church': ['church'],
      'mosque': ['mosque'],
      'synagogue': ['synagogue'],
      'hindu_temple': ['hindu_temple'],
      
      // Entertainment
      'movie_theater': ['movie_theater'],
      'night_club': ['night_club'],
      
      // Sports and Adventure - using only official Google types
      'gym': ['gym'],
      'sports_and_adventures': ['gym', 'stadium', 'sports_complex'],
      'sports': ['gym'],
      'adventures': ['gym'],
      'adventure': ['gym'],
      'fitness_center': ['fitness_center'],
      'stadium': ['stadium'],
      'sports_complex': ['sports_complex'],
      
      // Outdoor activities
      'campground': ['campground'],
      'campings': ['campground'],
      'camping': ['campground'],
      'airport': ['airport'],
      'airports': ['airport'],
      
      // Other
      'bakeries': ['bakery'],
      'hiking': ['park'],
      'mountain_trail': ['park'],
      'family_trip': ['tourist_attraction'],
      'family_tips': ['tourist_attraction'], // Handle both old and new naming
      'group_houses': ['lodging'],
      'cafe_or_dhabba': ['cafe']
    };

    return typeGroups[type] || [type];
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

  // Map filter types to official Google Places API types only
  getGooglePlaceType(filterType: string): string {
    const typeMapping: { [key: string]: string } = {
      // Official Google Places API types only
      'restaurant': 'restaurant',
      'cafe': 'cafe',
      'bar': 'bar',
      'bakery': 'bakery',
      'meal_takeaway': 'meal_takeaway',
      'food': 'meal_takeaway',
      
      'lodging': 'lodging',
      'hotel': 'lodging',
      'hotels': 'lodging',
      
      'gas_station': 'gas_station',
      'gas': 'gas_station',
      'fuel': 'gas_station',
      'gas_stations': 'gas_station',
      
      'atm': 'atm',
      'atms': 'atm',
      
      'bank': 'bank',
      'banks': 'bank',
      
      'hospital': 'hospital',
      'hospitals': 'hospital',
      
      'pharmacy': 'pharmacy',
      
      'shopping_mall': 'shopping_mall',
      'store': 'store',
      'shops': 'store',
      
      'supermarket': 'supermarket',
      'super_markets': 'supermarket',
      'super_market': 'supermarket',
      
      'park': 'park',
      'parks': 'park',
      
      'tourist_attraction': 'tourist_attraction',
      'attractions': 'tourist_attraction',
      
      'amusement_park': 'amusement_park',
      'zoo': 'zoo',
      'museum': 'museum',
      
      'post_office': 'post_office',
      'police': 'police',
      'fire_station': 'fire_station',
      
      'school': 'school',
      'university': 'university',
      
      'church': 'church',
      'mosque': 'mosque',
      'synagogue': 'synagogue',
      'hindu_temple': 'hindu_temple',
      
      'movie_theater': 'movie_theater',
      'night_club': 'night_club',
      
      // Sports and Adventure - using official Google types
      'sports_and_adventures': 'gym',
      'sports': 'gym',
      'adventures': 'gym',
      'adventure': 'gym',
      'gym': 'gym',
      'fitness_center': 'fitness_center',
      'stadium': 'stadium',
      'sports_complex': 'sports_complex',
      
      'campground': 'campground',
      'campings': 'campground',
      'camping': 'campground',
      
      'airport': 'airport',
      'airports': 'airport',
      
      'bakeries': 'bakery',
      
      // Outdoor activities
      'hiking': 'park',
      'mountain_trail': 'park',
      'family_trip': 'tourist_attraction',
      'family_tips': 'tourist_attraction', // Handle both old and new naming
      'group_houses': 'lodging',
      'cafe_or_dhabba': 'cafe'
    };

    return typeMapping[filterType] || 'establishment';
  }
}
