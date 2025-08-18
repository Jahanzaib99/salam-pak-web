import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import axios from 'axios';
import { data } from 'jquery';

const routes = {
  quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`,
  locations: () => `/location`,
  categories: (params: any) => `/category?${params}`,
  activities: (params: any) => `/activity?${params}`,
  visa: () => `/visa/availability`,
  cities: () => `/location?locationType=city`,
  events: (selectedDate: any) =>
    `/events?status=published&pageSize=0&dateTo=${selectedDate}&dateFrom=${selectedDate}`,
  whereToGoCategories: () => `/category?categoryType=destination&pageSize=0`,
  singleBlog: (slug: string) =>
    `https://www.findmyadventure.pk/api/blog/${slug}`,
  checkCountry: () => `https://extreme-ip-lookup.com/json/`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  readonly messageSource = new BehaviorSubject('');

  countryMessage = this.messageSource.asObservable();

  changeMessage(message: any): void {
    this.messageSource.next(message);
  }

  constructor(private httpClient: HttpClient) {
    this.checkCountry().subscribe((res: any) => {
      // console.log(res);
    });
  }

  getRandomQuote(context: RandomQuoteContext): Observable<string> {
    return this.httpClient.get(routes.quote(context)).pipe(
      map((body: any) => body.value),
      catchError(() => of('Error, could not load joke :-('))
    );
  }

  getLocations() {
    return axios
      .get(`${environment.serverUrl}/` + routes.locations())
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
    // return this.httpClient.get(routes.locations()).pipe(
    //   map((body: any) => body.data),
    //   catchError(() => of('Error, could not load joke :-('))
    // );
  }
  getCategories(params: any) {
    return axios
      .get(`${environment.serverUrl}/` + routes.categories(params))
      .then(function (response) {
          let data = response.data.data;

          // Move item with slug 'top-tourist-destinations' to the top
          const prioritizedSlug = 'top-tourist-destinations';
        
          data.sort((a: any, b: any) => {
            if (a.slug === prioritizedSlug) return -1;
            if (b.slug === prioritizedSlug) return 1;
            return 0; // keep original order for others
          });
          
          return data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    // return this.httpClient.get(routes.categories(params)).pipe(
    //   map((body: any) => body.data),
    //   catchError(() => of('Error, could not load joke :-('))
    // );
  }
  getActivities(params: any) {
    return axios
      .get(`${environment.serverUrl}/` + routes.activities(params))
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
    // return this.httpClient.get(routes.activities(params)).pipe(
    //   map((body: any) => body.data),
    //   catchError(() => of('Error, could not load joke :-('))
    // );
  }
  getVisaList() {
    return axios
      .get(`${environment.serverUrl}/` + routes.visa())
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
    // return this.httpClient.get(routes.visa()).pipe(
    //   map((body: any) => body.data),
    //   catchError(() => of('Error, could not load joke :-('))
    // );
  }
  getBlogs() {
    return this.httpClient.get(environment.blogUrl + '/wp-json/wp/v2/posts');
    // .pipe(map((body: any) => body.data));
  }

  getWhereToGoCategories() {
    return axios
      .get(`${environment.serverUrl}/` + routes.whereToGoCategories())
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
    // axios
    //   .get(routes.whereToGoCategories())
    //   .then((response) => {
    //     // Handle successful response
    //     console.log(response.data);
    //   })
    //   .catch((error) => {
    //     // Handle error
    //     console.error(error);
    //   });
    // return this.httpClient.get(routes.whereToGoCategories()).pipe(
    //   map((body: any) => body.data),
    //   catchError((error: any) => of(error.message))
    // );
  }
  getSingleBlog(slug: string) {
    // https://www.findmyadventure.pk/api/blog/a-travellers-perspective-on-the-lockdown
    return this.httpClient.get(routes.singleBlog(slug)).pipe(
      map((body: any) => body.data),
      catchError(() => of('Error, could not load joke :-('))
    );
  }

  getCities() {
    return axios
      .get(`${environment.serverUrl}/` + routes.cities())
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
    // return this.httpClient.get(routes.cities()).pipe(
    //   map((body: any) => body.data),
    //   catchError(() => of('Error, could not load joke :-('))
    // );
  }

  getEvents(selectedDate: any) {
    return axios
      .get(`${environment.serverUrl}/` + routes.events(selectedDate))
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
    // return this.httpClient.get(routes.events(selectedDate)).pipe(
    //   map((body: any) => body.data),
    //   catchError(() => of('Error, could not load joke :-('))
    // );
  }

  checkCountry() {
    return this.httpClient.get(routes.checkCountry()).pipe(
      map((body: any) => {
        if (body) {
          this.changeMessage(body);
        }
      }),
      catchError(() => of('Error, could not load joke :-('))
    );
  }
}
