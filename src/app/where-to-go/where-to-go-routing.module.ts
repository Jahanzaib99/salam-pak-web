import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DestinationComponent } from '@app/destination/destination.component';
import { CategoryResolveService } from '../services/resolver-services/category-resolve.service';

import { LocationResolveService } from '../services/resolver-services/location-resolve.service';
import { CategoryListingComponent } from './category-listing/category-listing.component';
import { CategoryWhereComponent } from './category-where/category-where.component';

import { TripsResolveService } from './trips/trips-resolve.service';
import { TripsComponent } from './trips/trips.component';

import { WhereToGoComponent } from './where-to-go.component';
import { CategoryWhereFeaturedComponent } from './category-where-featured/category-where-featured.component';
import { CategoryWhereAllComponent } from './category-where-all/category-where-all.component';
import { CategoryWhereFeAllComponent } from './category-where-fe-all/category-where-fe-all.component';

const routes: Routes = [
  { path: '', component: WhereToGoComponent },

  {
    path: 'category/:slug',
    component: CategoryWhereComponent,
    resolve: {
      category: CategoryResolveService,
    },
  },
  {
    path: 'location/:slug/featured',
    component: CategoryWhereFeaturedComponent,
    resolve: {
      location: LocationResolveService,
      trip: TripsResolveService,
      category: CategoryResolveService
    },
  },
  {
    path: 'location/:slug/all',
    component: CategoryWhereAllComponent,
    resolve: {
      location: LocationResolveService,
      trip: TripsResolveService,
      
    },
  },
  {
    path: 'category/:slug/listing',
    component: CategoryListingComponent,
    resolve: {
      category: CategoryResolveService,
    },
  },
  {
    path: 'location/:slug/featured-all',
    component: CategoryWhereFeAllComponent,
    resolve: {
      location: LocationResolveService,
    },
  },

  {
    path: 'category/:category/location/:slug',
    component: DestinationComponent,
    resolve: { location: LocationResolveService },
  },

  {
    path: 'locations/:slug',
    component: TripsComponent,
    resolve: {
      trip: TripsResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhereToGoRoutingModule {}
