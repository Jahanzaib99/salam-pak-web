import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';

import { AgmCoreModule } from '@agm/core';
import { ThreeDMapComponent } from './three-d-map/three-d-map.component';

@NgModule({
  declarations: [MapComponent, ThreeDMapComponent],
  imports: [
    CommonModule,
    MapRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAtb_QnG0oEVgIEpkci40sTrCy6hQS834',
      libraries: ['places'], // 👈 required for nearby places
    }),
  ],
})
export class MapModule {}
