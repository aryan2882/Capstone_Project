import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive ,NavigationEnd} from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { UserRole, RoleNames } from '../../../core/models/user';
import { MatCard } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatChip } from '@angular/material/chips';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  imports:[MatCard,MatIcon,MatDivider,MatChip,MatMenu,MatMenuTrigger,RouterLink,
    MatToolbar,MatButtonModule,MatMenuModule,MatIconModule,RouterLinkActive,CommonModule]
})
export class NavbarComponent implements OnInit {
  currentUser: any;
  userRole: number | null = null;
  UserRole = UserRole;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    
    // Reload user data on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadUserData();
    });
  }

  loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userRole = this.authService.getUserRole();
    this.cdr.detectChanges();
    
    console.log('Navbar loaded - User:', this.currentUser);
    console.log('Navbar loaded - Role:', this.userRole);
  }

  getRoleName(): string {
    return this.userRole ? RoleNames[this.userRole] : 'User';
  }

  logout(): void {
    this.authService.logout();
  }

  // Use routerLink navigation instead of manual navigation
  // This is handled by [routerLink] in template
}