import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { EventService } from '../event.service';
@Injectable({
  providedIn: 'root',
})
export class TripDetailResolveService {
  constructor(private readonly eventService: EventService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.eventService.getTripDetail(route.params.id);
  }
}
