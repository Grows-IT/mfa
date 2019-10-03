import { TestBed, async, inject } from '@angular/core/testing';

import { ActivitiesGuard } from './activities.guard';

describe('ActivitiesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivitiesGuard]
    });
  });

  it('should ...', inject([ActivitiesGuard], (guard: ActivitiesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
