import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabsListingComponent } from './cabs-listing/cabs-listing.component';
import { CabsRoutingModule } from './cabs-routing.module';

@NgModule({
  declarations: [CabsListingComponent],
  imports: [
    CommonModule,
    CabsRoutingModule
  ]
})
export class CabsModule { }
