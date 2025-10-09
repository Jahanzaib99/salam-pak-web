import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationComponent } from './destination.component';
import { PTDCCommonModule } from '@app/common/common.module';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  declarations: [DestinationComponent],
  imports: [
    CommonModule,
    CarouselModule.forRoot(),
    ShareButtonsModule.withConfig({
      debug: true,
    }),
    ShareIconsModule,
    PTDCCommonModule,
    RouterModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAtb_QnG0oEVgIEpkci40sTrCy6hQS834',
      libraries: ['places'], // 👈 required for nearby places
    }),
  ],
  exports: [DestinationComponent],
})
export class DestinationModule {}
