import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SortableModule } from 'ngx-bootstrap/sortable';

import { AgmCoreModule } from '@agm/core';
import { PTDCCommonModule } from '@app/common/common.module';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { TripListingComponent } from './trip-listing/trip-listing.component';
import { TripRoutingModule } from './trip-routing.module';

@NgModule({
  declarations: [TripDetailComponent, TripListingComponent],
  imports: [
    CommonModule,
    PTDCCommonModule,
    SortableModule,
    TripRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAtb_QnG0oEVgIEpkci40sTrCy6hQS834',
      libraries: ['places'], // 👈 required for nearby places
    }),
  ],
})
export class TripModule {}
