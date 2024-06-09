import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BookingAirlineComponent } from './booking-airline/booking-airline.component';
import { BookingRailwayComponent } from './booking-railway/booking-railway.component';
import { ExplorePakistanComponent } from './explore-pakistan/explore-pakistan.component';

const routes: Routes = [
  // { path: '', pathMatch: 'full' redirectTo: 'home' },

  {
    path: 'where-to-go',
    loadChildren: () =>
      import('./where-to-go/where-to-go.module').then((m) => m.WhereToGoModule),
  },

  {
    path: 'what-to-do',
    loadChildren: () =>
      import('./what-to-do/what-to-do.module').then((m) => m.WhatToDoModule),
  },

  {
    path: 'accomodation',
    loadChildren: () =>
      import('./accommodation/accommodation.module').then(
        (m) => m.AccommodationModule
      ),
  },

  {
    path: 'booking',
    loadChildren: () =>
      import('./booking/booking.module').then((m) => m.BookingModule),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },

  {
    path: 'planning',
    loadChildren: () =>
      import('./planning/planning.module').then((m) => m.PlanningModule),
  },

  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then((m) => m.MapModule),
  },

  {
    path: 'trip',
    loadChildren: () => import('./trip/trip.module').then((m) => m.TripModule),
  },

  {
    path: 'event',
    loadChildren: () =>
      import('./event-detail/event-detail.module').then(
        (m) => m.EventDetailModule
      ),
  },

  {
    path: 'publications',
    loadChildren: () =>
      import('./publications/publications.module').then(
        (m) => m.PublicationsModule
      ),
  },
  {
    path: 'bookings',
    loadChildren: () =>
      import('./booking-module/booking-module.module').then(
        (m) => m.BookingModuleModule
      ),
  },
  {
    path: 'booking-accommodation',
    loadChildren: () =>
      import('./booking-module/booking-module.module').then(
        (m) => m.BookingModuleModule
      ),
  },
  {
    path: 'booking-airline', component: BookingAirlineComponent
  },
  {
    path: 'booking-railway', component: BookingRailwayComponent
  },
  {
    path: 'booking-bus',
    loadChildren: () =>
      import('./booking-buss/booking-buss.module').then(
        (m) => m.BookingBussModule
      ),
  },
  {
    path: 'explore-pakistan', component: ExplorePakistanComponent
  },

  { path: '**', component: HomeComponent, pathMatch: 'full' },

  // Fallback when no prior route is matched
  // { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
