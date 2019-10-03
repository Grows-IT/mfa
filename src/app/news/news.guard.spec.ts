import { TestBed, async, inject } from '@angular/core/testing';

import { NewsGuard } from './news.guard';

describe('NewsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsGuard]
    });
  });

  it('should ...', inject([NewsGuard], (guard: NewsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
