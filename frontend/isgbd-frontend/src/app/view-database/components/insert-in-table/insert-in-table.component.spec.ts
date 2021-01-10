import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertInTableComponent } from './insert-in-table.component';

describe('InsertInTableComponent', () => {
  let component: InsertInTableComponent;
  let fixture: ComponentFixture<InsertInTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertInTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertInTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
