// consumer-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-consumer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <div class="consumer-layout">
      <app-navbar></app-navbar>
      <div class="content-wrapper">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .consumer-layout {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .content-wrapper {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .content-wrapper {
        padding: 16px;
      }
    }
  `]
})
export class ConsumerLayoutComponent {}