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
import { CategoryWhereAllComponent } from './category-where-all/category-where-all.component';
import { CategoryWhereFeAllComponent } from './category-where-fe-all/category-where-fe-all.component';
import { CategoryWhereFeaturedComponent } from './category-where-featured/category-where-featured.component';

@NgModule({
  declarations: [
    WhereToGoComponent,
    CategoryWhereComponent,
    CategoryWhereAllComponent,
    CategoryWhereFeAllComponent,
    CategoryWhereFeaturedComponent,
    CategoryListingComponent,
    TripsComponent,
  ],
  imports: [
    CommonModule,
    PTDCCommonModule,
    WhereToGoRoutingModule,
    DestinationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCPhOFre2UhYgZPRNw_qD8CaGQ36pUqaQA',
    }),
  ],
})
export class WhereToGoModule {}
