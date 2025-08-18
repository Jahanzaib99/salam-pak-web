import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryWhereFeAllComponent } from './category-where-fe-all.component';

describe('CategoryWhereFeAllComponent', () => {
  let component: CategoryWhereFeAllComponent;
  let fixture: ComponentFixture<CategoryWhereFeAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryWhereFeAllComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryWhereFeAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
