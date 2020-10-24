import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDatabaseShellComponent } from './select-database-shell.component';

describe('SelectDatabaseShellComponent', () => {
  let component: SelectDatabaseShellComponent;
  let fixture: ComponentFixture<SelectDatabaseShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDatabaseShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDatabaseShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
