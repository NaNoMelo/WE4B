import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUe } from './edit-ue';

describe('EditUe', () => {
  let component: EditUe;
  let fixture: ComponentFixture<EditUe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
