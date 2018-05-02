import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentListComponent } from './environment-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EnvironmentListComponent', () => {
  let component: EnvironmentListComponent;
  let fixture: ComponentFixture<EnvironmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [ EnvironmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
