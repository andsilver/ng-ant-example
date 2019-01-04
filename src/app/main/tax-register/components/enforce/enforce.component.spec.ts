import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnforceComponent } from './enforce.component';

describe('EnforceComponent', () => {
  let component: EnforceComponent;
  let fixture: ComponentFixture<EnforceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnforceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnforceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
