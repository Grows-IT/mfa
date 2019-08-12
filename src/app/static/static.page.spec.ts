import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticPage } from './static.page';

describe('StaticPage', () => {
  let component: StaticPage;
  let fixture: ComponentFixture<StaticPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaticPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
