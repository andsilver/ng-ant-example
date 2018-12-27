import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaxModuleComponent } from './create-tax-module.component';

describe('CreateTaxModuleComponent', () => {
  let component: CreateTaxModuleComponent;
  let fixture: ComponentFixture<CreateTaxModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTaxModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTaxModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
