import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PTDCCommonModule } from '../common/common.module';

import { WhereToGoRoutingModule } from './where-to-go-routing.module';
import { WhereToGoComponent } from './where-to-go.component';
import { CategoryWhereComponent } from './category-where/category-where.component';
import { CategoryListingComponent } from './category-listing/category-listing.component';

import { AgmCoreModule } from '@agm/core';
import { TripsComponent } from './trips/trips.component';
import { DestinationModule } from '@app/destination/destination.module';

@NgModule({
  declarations: [
    WhereToGoComponent,
    CategoryWhereComponent,
    CategoryListingComponent,
    TripsComponent,
  ],
  imports: [
    CommonModule,
    PTDCCommonModule,
    WhereToGoRoutingModule,
    DestinationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD46iP7ge4FBUCIAk1SUUMAW5iJvjbBbcE',
    }),
  ],
})
export class WhereToGoModule {}
