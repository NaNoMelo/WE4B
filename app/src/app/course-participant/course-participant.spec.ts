import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseParticipant } from './course-participant';

describe('CourseParticipant', () => {
  let component: CourseParticipant;
  let fixture: ComponentFixture<CourseParticipant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseParticipant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseParticipant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
