import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanningRoutingModule } from './planning-routing.module';
import { PlanningComponent } from './planning.component';

import { SortableModule } from 'ngx-bootstrap/sortable';

import { AgmCoreModule } from '@agm/core';
import { PTDCCommonModule } from '@app/common/common.module';
import { PlanListingComponent } from './plan-listing/plan-listing.component';

@NgModule({
  declarations: [PlanningComponent, PlanListingComponent],
  imports: [
    CommonModule,
    PTDCCommonModule,
    SortableModule,
    PlanningRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAtb_QnG0oEVgIEpkci40sTrCy6hQS834',
      libraries: ['places'], // 👈 required for nearby places
    }),
  ],
})
export class PlanningModule {}
