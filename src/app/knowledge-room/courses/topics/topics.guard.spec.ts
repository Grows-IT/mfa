import { TestBed, async, inject } from '@angular/core/testing';

import { TopicsGuard } from './topics.guard';

describe('TopicsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopicsGuard]
    });
  });

  it('should ...', inject([TopicsGuard], (guard: TopicsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
