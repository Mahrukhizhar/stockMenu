import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDesignerComponent } from './menu-designer.component';

describe('MenuDesignerComponent', () => {
  let component: MenuDesignerComponent;
  let fixture: ComponentFixture<MenuDesignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuDesignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
