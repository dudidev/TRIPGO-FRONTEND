import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NocturnaComponent } from './nocturna.component';

describe('NocturnaComponent', () => {
  let component: NocturnaComponent;
  let fixture: ComponentFixture<NocturnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NocturnaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NocturnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
