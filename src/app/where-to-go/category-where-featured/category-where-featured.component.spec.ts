import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryWhereFeaturedComponent } from './category-where-featured.component';

describe('CategoryWhereFeaturedComponent', () => {
  let component: CategoryWhereFeaturedComponent;
  let fixture: ComponentFixture<CategoryWhereFeaturedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryWhereFeaturedComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryWhereFeaturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
