import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
@Component({
  selector: 'app-billing-officer-layout',
  templateUrl: './billing-officer-layout.html',
  imports:[RouterOutlet,NavbarComponent]
})
export class BillingOfficerLayoutComponent {}
