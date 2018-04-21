import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideItemComponent } from './aside-item.component';

describe('AsideItemComponent', () => {
  let component: AsideItemComponent;
  let fixture: ComponentFixture<AsideItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsideItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
