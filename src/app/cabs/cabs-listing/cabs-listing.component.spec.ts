import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabsListingComponent } from './cabs-listing.component';

describe('CabsListingComponent', () => {
  let component: CabsListingComponent;
  let fixture: ComponentFixture<CabsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
