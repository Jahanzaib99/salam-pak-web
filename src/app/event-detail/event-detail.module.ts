import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PTDCCommonModule } from '@app/common/common.module';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';

import { NgxPaginationModule } from 'ngx-pagination';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { AccomodationHomeSearchDetailComponent } from './accomodation-home-search-detail/accomodation-home-search-detail.component';
import { EventDetailRoutingModule } from './event-detail-routing.module';
import { EventListingComponent } from './event-listing/event-listing.component';

@NgModule({
  declarations: [
    EventDetailComponent,
    AccomodationHomeSearchDetailComponent,
    EventListingComponent,
  ],
  imports: [
    CommonModule,
    // CarouselModule.forRoot(),
    ShareButtonsModule.withConfig({
      debug: true,
    }),
    ShareIconsModule,
    PTDCCommonModule,
    RouterModule,
    EventDetailRoutingModule,
    NgxPaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAtb_QnG0oEVgIEpkci40sTrCy6hQS834',
      libraries: ['places'], // 👈 required for nearby places
    }),
  ],
  exports: [],
})
export class EventDetailModule {}
