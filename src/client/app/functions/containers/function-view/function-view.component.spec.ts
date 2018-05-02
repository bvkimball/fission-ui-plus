import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionViewComponent } from './function-view.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FunctionViewComponent', () => {
  let component: FunctionViewComponent;
  let fixture: ComponentFixture<FunctionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [ FunctionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
