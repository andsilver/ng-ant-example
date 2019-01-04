import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalDateComponent } from './approval-date.component';

describe('ApprovalDateComponent', () => {
  let component: ApprovalDateComponent;
  let fixture: ComponentFixture<ApprovalDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
