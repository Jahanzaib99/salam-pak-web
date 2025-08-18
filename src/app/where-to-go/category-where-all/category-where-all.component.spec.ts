import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryWhereAllComponent } from './category-where-all.component';

describe('CategoryWhereAllComponent', () => {
  let component: CategoryWhereAllComponent;
  let fixture: ComponentFixture<CategoryWhereAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryWhereAllComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryWhereAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
