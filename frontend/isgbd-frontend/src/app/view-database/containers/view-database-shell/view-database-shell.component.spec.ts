import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDatabaseShellComponent } from './view-database-shell.component';

describe('ViewDatabaseShellComponent', () => {
  let component: ViewDatabaseShellComponent;
  let fixture: ComponentFixture<ViewDatabaseShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDatabaseShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDatabaseShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
