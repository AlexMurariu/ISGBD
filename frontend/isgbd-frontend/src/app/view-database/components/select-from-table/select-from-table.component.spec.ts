import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFromTableComponent } from './select-from-table.component';

describe('SelectFromTableComponent', () => {
  let component: SelectFromTableComponent;
  let fixture: ComponentFixture<SelectFromTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectFromTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFromTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
