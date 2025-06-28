import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Assingment } from './assingment';

describe('Assingment', () => {
  let component: Assingment;
  let fixture: ComponentFixture<Assingment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Assingment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Assingment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
