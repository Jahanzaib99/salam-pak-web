import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, from } from 'rxjs';
import { EventService } from '../../services/event.service';

@Injectable({
  providedIn: 'root',
})
export class TripsResolveService implements Resolve<any> {
  constructor(private readonly eventService: EventService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const slug = route.params['slug'];
    const parentCategoryId = route.queryParams['parentCategoryId'];
    const categoryIds = parentCategoryId ? [parentCategoryId] : [];

    // Wrap the promise in an Observable
    return from(this.eventService.getTopTrips(slug, categoryIds));
  }
}
