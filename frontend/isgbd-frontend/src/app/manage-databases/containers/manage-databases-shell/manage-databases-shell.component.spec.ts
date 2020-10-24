import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDatabasesShellComponent } from './manage-databases-shell.component';

describe('ManageDatabasesShellComponent', () => {
  let component: ManageDatabasesShellComponent;
  let fixture: ComponentFixture<ManageDatabasesShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDatabasesShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDatabasesShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
