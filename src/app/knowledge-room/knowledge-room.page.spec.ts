import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeRoomPage } from './knowledge-room.page';

describe('KnowledgeRoomPage', () => {
  let component: KnowledgeRoomPage;
  let fixture: ComponentFixture<KnowledgeRoomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowledgeRoomPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
