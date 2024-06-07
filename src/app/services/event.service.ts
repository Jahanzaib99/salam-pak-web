import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import axios from 'axios';
const routes = {
  locations: (coordinates: any) =>
    `/getNearByLocations?coordinates=[${coordinates[1]}, ${coordinates[0]}]`,
  categories: () => `/category`,
  activityDetail: (slug: string) => `/activity/detail?slug=${slug}`,
  categoryDetail: (slug: string) => `/category/detail?slug=${slug}`,
  locationDetail: (slug: string) => `/location/detail?slug=${slug}`,
  accomodations: (params: string) => `/accommodations/search?${params}`,
  plan: (userId: string) => `/plans/${userId}`,
  getCategoryLocations: (id: string) =>
    `/location?parentCategories=["${id}"]&pageSize=0`,
  getActivityLocations: (id: string) =>
    `/location?parentActivities=["${id}"]&pageSize=0`,
  getHomeFeaturedEvents: (durationTo: number) =>
    `${environment.serverUrl}/trip/search?pageSize=0&status=published`,
  getTripDetail: (id: number) => `${environment.serverUrl}/trip/${id}`,
  getEventDetail: (id: number) => `${environment.serverUrl}/events/${id}`,
  accomodationCategories: () =>
    `/category?categoryType=accomodation&pageSize=6`,
  accomodations1: (params: string) => `/accomodation/search`,
  singleAccomodationCategory: (id: string) => `/category/detail?id=${id}`,
  room: (id: string) => `/accommodations/${id}`,
  getTrips: (slug?: string) => `/location?parentProvince=${slug}&pageSize=0`,
  getDestinationFilters: () => `/category?categoryType=destination`,
  getRelatedEvents: (id?: string) => `/events?status=published&city=${id}`,
  getNews: () => `/news`,
  getPlanDetails: (planId: any) => `/plans/${planId}/details`,
};

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private httpClient: HttpClient,
    private readonly router: Router
  ) {}
  getHomeFeaturedEvents(durationTo?: number): Observable<any> {
    return this.httpClient
      .get(routes.getHomeFeaturedEvents(durationTo))
      .pipe(map((body: any) => body.data));
  }
  getActivityDetail(slug: string) {
    return axios
      .get(`${environment.serverUrl}` + routes.activityDetail(slug))
      .then(function (response) {
        // handle success
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient.get(routes.activityDetail(slug)).pipe(map((body: any) => body.data));
  }
  getCategoryDetail(slug: string) {
    return axios
      .get(`${environment.serverUrl}` + routes.categoryDetail(slug))
      .then(function (response) {
        // handle success
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient.get(routes.categoryDetail(slug)).pipe(map((body: any) => body.data));
  }

  getLocationDetail(slug: string) {
    return axios
      .get(`${environment.serverUrl}` + routes.locationDetail(slug))
      .then(function (response) {
        // handle success
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient.get(routes.locationDetail(slug)).pipe(map((body: any) => body.data));
  }

  getCategories() {
    return this.httpClient
      .get(routes.categories())
      .pipe(map((body: any) => body.data));
  }

  getLocations(coordinates: any) {
    return axios
      .get(`${environment.serverUrl}` + routes.locations(coordinates))
      .then(function (response) {
        // handle success
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient.get(routes.locations(coordinates)).pipe(map((body: any) => body.data));
  }

  getUserWishList(userId: any) {
    return this.httpClient.get(
      `${environment.serverUrl}/user/wishlist/${userId}`
    );
  }

  userFeedback(feedbackObj: any) {
    return this.httpClient.post(`${environment.serverUrl}/review`, feedbackObj);
  }

  removeFromWishlist(locationId: any) {
    return this.httpClient.put(
      `${environment.serverUrl}/user/wishlist/remove`,
      { locationId }
    );
  }

  removeTripFromWishlist(tripId: any) {
    return this.httpClient.put(
      `${environment.serverUrl}/user/wishlist/remove`,
      { tripId }
    );
  }

  removeEventFromWishlist(eventId: any) {
    return this.httpClient.put(
      `${environment.serverUrl}/user/wishlist/remove`,
      { eventId }
    );
  }

  addToWishlist(locationId: any) {
    return this.httpClient.post(`${environment.serverUrl}/user/wishlist`, {
      locationId,
    });
  }

  addTripToWishlist(tripId: any) {
    return this.httpClient.post(`${environment.serverUrl}/user/wishlist`, {
      tripId,
    });
  }

  addEventToWishlist(eventId: any) {
    return this.httpClient.post(`${environment.serverUrl}/user/wishlist`, {
      eventId,
    });
  }

  addAccommodationToWishlist(accommodationId: any) {
    return this.httpClient.post(`${environment.serverUrl}/user/wishlist`, {
      accommodationId,
    });
  }

  deleteAccommodationFromWishlist(accommodationId: any) {
    return this.httpClient.put(
      `${environment.serverUrl}/user/wishlist/remove`,
      { accommodationId }
    );
  }

  getAccomodationsListing(params: string) {
    // debugger;
    return axios
      .get( `https://fgvcbva4d5.execute-api.ap-south-1.amazonaws.com/master/public/stays/property/public?${params}`)
      .then(function (response) {
        // handle success
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient
    //   .get(
    //     `https://fgvcbva4d5.execute-api.ap-south-1.amazonaws.com/master/public/stays/property/public?${params}`
    //   )
    //   .pipe(map((body: any) => body.data));
  }

  getAllPTDCAccomodations(params: any) {
    // console.log("here"); alert("jrere")
    return axios
      .get(`${environment.serverUrl}` + routes.accomodations(params))
      .then(function (response) {
        // handle success
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient.get(routes.accomodations(params));
  }
  getUserPlan(userId: string): Observable<any> {
    return this.httpClient
      .get(routes.plan(userId))
      .pipe(map((body: any) => body.data));
  }

  removeFromPlan(locationId: any): Observable<any> {
    return this.httpClient.put(`${environment.serverUrl}/user/plan/remove`, {
      locationId,
    });
  }

  removeTripFromPlan(tripId: any): Observable<any> {
    return this.httpClient.put(`${environment.serverUrl}/user/plan/remove`, {
      tripId,
    });
  }

  removeEventFromPlan(eventId: any): Observable<any> {
    return this.httpClient.put(`${environment.serverUrl}/user/plan/remove`, {
      eventId,
    });
  }

  addToPlan(locationId: any): Observable<any> {
    return this.httpClient.post(`${environment.serverUrl}/user/plan`, {
      locationId,
    });
  }

  addTripToPlan(tripId: any): Observable<any> {
    return this.httpClient.post(`${environment.serverUrl}/user/plan`, {
      tripId,
    });
  }

  addEventToPlan(eventId: any): Observable<any> {
    return this.httpClient.post(`${environment.serverUrl}/user/plan`, {
      eventId,
    });
  }

  removeAccommodationFromPlan(accommodationId: any): Observable<any> {
    return this.httpClient.put(`${environment.serverUrl}/user/plan/remove`, {
      accommodationId,
    });
  }

  addAccommodationToPlan(accommodationId: any): Observable<any> {
    return this.httpClient.post(`${environment.serverUrl}/user/plan`, {
      accommodationId,
    });
  }

  getCategoryLocations(id: string) {
    return axios
      .get(`${environment.serverUrl}/` + routes.getCategoryLocations(id))
      .then(function (response) {
        // handle success
        // console.log(response.data.data);
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient.get(routes.getCategoryLocations(id)).pipe(map((body: any) => body.data));
  }

  getActivityLocations(id: string) {
    return axios
      .get(`${environment.serverUrl}/` + routes.getActivityLocations(id))
      .then(function (response) {
        // handle success
        // console.log(response.data.data);
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient.get(routes.getActivityLocations(id)).pipe(map((body: any) => body.data));
  }
  getTripDetail(id: number) {
    // https://www.findmyadventure.pk/api/v2/events/?autoId=2762&trimmedSlug=rent-a-cycle-in-karachi
    return this.httpClient
      .get(routes.getTripDetail(id))
      .pipe(map((body: any) => body.data));
  }
  getAccomodationCategories(): Observable<any> {
    return this.httpClient
      .get(routes.accomodationCategories())
      .pipe(map((body: any) => body.data));
  }
  searchAccomodations(params: string): Observable<any> {
    return this.httpClient
      .get(routes.accomodations1(params))
      .pipe(map((body: any) => body.data));
  }
  getSingleAccomodationCategoryDetail(id: string) {
    // debugger;
    return axios
      .get(`${environment.serverUrl}/` + routes.singleAccomodationCategory(id))
      .then(function (response) {
        // handle success
        // console.log(response.data.data);
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
      
    // return this.httpClient
    //   .get(routes.singleAccomodationCategory(id))
    //   .pipe(map((body: any) => body.data));
  }
  getRoomDetail(id: string) {
    return axios
      .get(`${environment.serverUrl}/` + (routes.room(id)))
      .then(function (response) {
        // handle success
        // console.log(response.data.data);
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
      
    // return this.httpClient
    //   .get(routes.room(id))
    //   .pipe(map((body: any) => body.data));
  }
  getTrips(slug: string) {
    return axios
      .get(`${environment.serverUrl}/` + routes.getTrips(slug))
      .then(function (response) {
        // handle success
        // console.log(response.data.data);
        // handle success
        // console.log(response.data.data);
        var locations = response.data.data;

        locations = locations.sort((a: any, b: any) => parseInt(b.order) - parseInt(a.order));

        return locations;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient.get(routes.getTrips(slug)).pipe(map((body: any) => body.data));
  }

  getAccomodationEvents(slug: any, pageSize = 10, skip = 0, filter: any = '') {
    return this.httpClient.get(
      `${environment.serverUrl}/accommodations/search?city=${slug}&skip=${skip}&pageSize=${pageSize}&filter=${filter}`
    );
  }

  gethotels(data: any, pageSize = 10, skip = 0, filter: any = '') {
    return axios
      .get(
        `${environment.serverUrl}/hotel-search?cityName=${data.cityName}&dep_date=${data.dep_date}&return_date=${data.return_date}&no_of_adults=${data.no_of_adults}&no_of_children=${data.no_of_children}&rooms=${data.rooms}&skip=${skip}&pageSize=${pageSize}&sortBy=${filter}`
      )
      .then(function (response) {
        // handle success
        // console.log(response.data.data);
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }

  gethotelDetail(query: any) {
    return axios
      .get(
        `${environment.serverUrl}/hotel-details?refId=${query.refId}&hotelId=${query.hotelId}&hotelRefId=${query.hotelRefId}&hotelSource=${query.hotelSource}&rooms=${query.rooms}&no_of_children=${query.no_of_children}&no_of_adults=${query.no_of_adults}&checkout_date=${query.checkout_date}&checkin_date=${query.checkin_date}`
      )
      .then(function (response) {
        // handle success
        // console.log(response.data.data);
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }

  getbuss(data: any, pageSize = 10, skip = 0, filter: any = '') {
    // return this.httpClient.get(
    //   `${environment.serverUrl}/all_bus_services?origin_city_name=${data.origin_city_name}&destination_city_name=${data.destination_city_name}&date=${data.date}&skip=${skip}&pageSize=${pageSize}&sortBy=${filter}`
    // );

    return axios
      .get(
        `${environment.serverUrl}/all_bus_services?origin_city_name=${data.origin_city_name}&destination_city_name=${data.destination_city_name}&date=${data.date}&skip=${skip}&pageSize=${pageSize}&sortBy=${filter}`
      )
      .then(function (response) {
        // handle success
        // console.log(response.data.data);
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }

  getBusSeatInfo(data: any): Observable<any> {
    return this.httpClient.get(
      `${environment.serverUrl}/seats_info?origin_city_name=${data.departureCityName}&service_id=${data.serviceId}&destination_city_name=${data.arrivalCityName}&date=${data.date}&deptime=${data.departureTime}&time_id=${data.time_id}&schedule_id=${data.schedule_id}&route_id=${data.route_id}&totalSeats=${data.totalSeats}`
    );
  }

  getFlights(data: any, pageSize = 10, skip = 0, filter: any = '') {
    let query = data.return_date ? `&return_date=${data.return_date}` : '';
    // return this.httpClient.get(
    //   `${environment.serverUrl}/searchAir?cabin=${data.cabin}&departureCityName=${data.departureCityName}&destinationCityName=${data.destinationCityName}&dep_date=${data.dep_date}&no_of_adults=${data.no_of_adults}&no_of_children=${data.no_of_children}&no_of_infants=${data.no_of_infants}&skip=${skip}&pageSize=${pageSize}&sortBy=${filter}` +
    //     query
    // );

    return axios
      .get(
        `${environment.serverUrl}/searchAir?cabin=${data.cabin}&departureCityName=${data.departureCityName}&destinationCityName=${data.destinationCityName}&dep_date=${data.dep_date}&no_of_adults=${data.no_of_adults}&no_of_children=${data.no_of_children}&no_of_infants=${data.no_of_infants}&skip=${skip}&pageSize=${pageSize}&sortBy=${filter}` +
          query
      )
      .then(function (response) {
        // handle success
        console.log(response);
        return response.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }

  bookFlight(data: any) {
    return this.httpClient
      .post(`${environment.serverUrl}/airline/bookings`, data)
      .pipe(map((body: any) => body.data));
  }

  bookBus(data: any) {
    return this.httpClient
      .post(`${environment.serverUrl}/bus/bookings`, data)
      .pipe(map((body: any) => body.data));
  }

  bookHotel(data: any) {
    return this.httpClient
      .post(`${environment.serverUrl}/accomodations/bookings`, data)
      .pipe(map((body: any) => body.data));
  }

  getAccomodationTopHotels(slug: any, pageSize = 5, skip = 0) {
    return this.httpClient.get(
      `${environment.serverUrl}/accommodations/toHotels?city=${slug}&skip=${skip}&pageSize=${pageSize}`
    );
  }

  getFetrauredEvents(slug: any) {
    return axios
      .get(`${environment.serverUrl}/location?parentProvince=${slug}`)
      .then(function (response) {
        // handle success
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient.get(`${environment.serverUrl}/location?locationType=province&pageSize=0`);
    // return this.httpClient.get(`${environment.serverUrl}/location?parentProvince=${slug}`);
  }
  getDestinationFilters() {
    // i/category?categoryType=destination
    return axios
      .get(`${environment.serverUrl}` + routes.getDestinationFilters())
      .then(function (response) {
        // handle success
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient.get(routes.getDestinationFilters()).pipe(map((body: any) => body.data));
  }
  getSurroundings(coordinates: any, typeKey: any) {
    return axios
      .get(
        `${environment.serverUrl}/poi?coordinates=[${coordinates}]&typeKey=${typeKey}`
      )
      .then(function (response) {
        // handle success
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient
    //   .get(`${environment.serverUrl}/poi?coordinates=[${coordinates}]&typeKey=${typeKey}`)
    //   .pipe(map((body) => body));
  }

  getAllCities() {
    return axios
      .get(`${environment.serverUrl}/location?pageSize=0&skip=0`)
      .then(function (response) {
        // handle success
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient.get(`${environment.serverUrl}/location?pageSize=0&skip=0`);
  }

  getPressRelease() {
    return this.httpClient.get(
      `${environment.serverUrl}/press-release?skip=0&pageSize=0`
    );
  }

  getMedia() {
    return this.httpClient.get(
      `${environment.serverUrl}/media?skip=0&pageSize=0`
    );
  }

  getAllEvents() {
    return axios
      .get(`${environment.serverUrl}/events?pageSize=0&status=published`)
      .then(function (response) {
        // handle success
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient.get(`${environment.serverUrl}/events?pageSize=0&status=published`);
  }

  getEvents = (params: any) => {
    const _query = new URLSearchParams(params).toString();
    return axios
      .get(`${environment.serverUrl}/trip?${_query}`)
      .then(function (response) {
        // handle success
        console.log(response.data.data);
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient.get(`${environment.serverUrl}/trip/search?${_query}`).pipe(map((body: any) => body));
  };

  getEventDetail(id: number) {
    // https://www.findmyadventure.pk/api/v2/events/?autoId=2762&trimmedSlug=rent-a-cycle-in-karachi
    return this.httpClient
      .get(routes.getEventDetail(id))
      .pipe(map((body: any) => body.data));
  }

  getRelatedEvents = (id: any) => {
    return this.httpClient
      .get(routes.getRelatedEvents(id))
      .pipe(map((body: any) => body.data));
  };

  getNews() {
    return axios
      .get(`${environment.serverUrl}` + routes.getNews())
      .then(function (response) {
        // handle success
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient.get(routes.getNews()).pipe(map((body: any) => body.data));
  }

  getPlanDetails(planId: any) {
    return this.httpClient
      .get(routes.getPlanDetails(planId))
      .pipe(map((body: any) => body.data));
  }

  createUserPlan(userId: any, userData: any) {
    return this.httpClient
      .post(`${environment.serverUrl}/plans/${userId}`, userData)
      .pipe(map((body: any) => body.data));
  }

  addLocationToSelectedPlan(planId: any, obj: any) {
    // debugger;
    return this.httpClient
      .put(`${environment.serverUrl}/plans/${planId}/update`, obj)
      .pipe(map((body: any) => body.data));
  }

  deleteAPlan(planId: any) {
    return this.httpClient.delete(
      `${environment.serverUrl}/plans/${planId}/remove`
    );
  }

  deleteItemFromPlan(planId: any, params: any) {
    const _query = new URLSearchParams(params).toString();

    return this.httpClient
      .delete(`${environment.serverUrl}/plans/${planId}/update?${_query}`)
      .pipe(map((body: any) => body.data));
  }

  createBooking(data: any) {
    return this.httpClient
      .post(`${environment.serverUrl}/accomodations/bookings`, data)
      .pipe(map((body: any) => body.data));
  }

  createEventBooking(eventId: any, data: any) {
    // debugger;
    return this.httpClient
      .post(`${environment.serverUrl}/events/${eventId}/bookings`, data)
      .pipe(map((body: any) => body.data));
  }

  createTripBooking(tripId: any, data: any) {
    // debugger;
    return this.httpClient
      .post(`${environment.serverUrl}/trip/${tripId}/bookings`, data)
      .pipe(map((body: any) => body.data));
  }

  getPaymentMethods() {
    return this.httpClient.get(`${environment.serverUrl}/paymentMethods`);
  }

  placeBookMeOrder(data: any) {
    return this.httpClient
      .post(`${environment.serverUrl}/placeOrder`, data)
      .pipe(map((body: any) => body.data));
  }
}
