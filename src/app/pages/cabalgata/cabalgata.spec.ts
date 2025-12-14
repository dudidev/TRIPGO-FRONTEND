import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cabalgata } from './cabalgata';

describe('Cabalgata', () => {
  let component: Cabalgata;
  let fixture: ComponentFixture<Cabalgata>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cabalgata]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cabalgata);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
