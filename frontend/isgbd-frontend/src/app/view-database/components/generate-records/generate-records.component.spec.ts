import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateRecordsComponent } from './generate-records.component';

describe('GenerateRecordsComponent', () => {
  let component: GenerateRecordsComponent;
  let fixture: ComponentFixture<GenerateRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
