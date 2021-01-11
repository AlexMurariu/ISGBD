import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFromTableComponent } from './delete-from-table.component';

describe('DeleteFromTableComponent', () => {
  let component: DeleteFromTableComponent;
  let fixture: ComponentFixture<DeleteFromTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteFromTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFromTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
