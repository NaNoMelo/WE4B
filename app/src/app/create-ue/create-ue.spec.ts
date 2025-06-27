import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUe } from './create-ue';

describe('CreateUe', () => {
  let component: CreateUe;
  let fixture: ComponentFixture<CreateUe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
