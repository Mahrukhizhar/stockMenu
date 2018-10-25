import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDesignerChildComponent } from './menu-designer-child.component';

describe('MenuDesignerChildComponent', () => {
  let component: MenuDesignerChildComponent;
  let fixture: ComponentFixture<MenuDesignerChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuDesignerChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDesignerChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
