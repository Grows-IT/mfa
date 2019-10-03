import { TestBed, async, inject } from '@angular/core/testing';

import { CategoriesGuard } from './categories.guard';

describe('CategoriesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoriesGuard]
    });
  });

  it('should ...', inject([CategoriesGuard], (guard: CategoriesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
