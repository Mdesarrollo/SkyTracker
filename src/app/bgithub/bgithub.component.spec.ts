import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgithubComponent } from './bgithub.component';

describe('BgithubComponent', () => {
  let component: BgithubComponent;
  let fixture: ComponentFixture<BgithubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BgithubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgithubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
