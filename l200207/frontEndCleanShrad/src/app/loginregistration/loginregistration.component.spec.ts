import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginregistrationComponent } from './loginregistration.component';

describe('LoginregistrationComponent', () => {
  let component: LoginregistrationComponent;
  let fixture: ComponentFixture<LoginregistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginregistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
