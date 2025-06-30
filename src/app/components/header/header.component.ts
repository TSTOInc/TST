import { Component, NgModule, OnInit } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { DrawerFormService } from '../../services/drawer-form/drawer-form.service';
import { filter, first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NzLayoutModule, NzIconModule, NzButtonModule, NzDropDownModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  showAddButton = false;
  allowedUrls = ['/trucks', '/drivers', '/trailers', '/brokers', '/clients'];
  currentUrl = '';
  username = 'Guest';

  constructor(private authService: AuthService, private router: Router, private drawerForm: DrawerFormService) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        first()
      )
      .subscribe((event: NavigationEnd) => {
        this.updateButtonVisibility(event.urlAfterRedirects);
      });

    // Listen for subsequent navigation changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateButtonVisibility(event.urlAfterRedirects);
      });

    this.authService.username$.subscribe(username => {
      this.username = username;
    });
  }
  ngOnInit() { 
    this.updateButtonVisibility(this.router.url);
  }
  updateButtonVisibility(url: string) {
    this.currentUrl = this.router.url;
    this.showAddButton = this.allowedUrls.some(path => url === path);
  }
  logOut() {
    this.authService.logout()
      .then(() => {
        console.log('Logged out successfully');
      })
      .catch(error => {
        console.error('Logout failed:', error);
      });
  }
  addEntity() {
    const url = this.router.url.replace('/', '');
    this.drawerForm.openDrawer(url);
  }
}
