import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormTableComponent } from './dynamic-form-table.component';

describe('DynamicFormTableComponent', () => {
  let component: DynamicFormTableComponent;
  let fixture: ComponentFixture<DynamicFormTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
