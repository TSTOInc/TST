import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  logOut() {
    this.authService.logout()
      .then(() => {
        console.log('Logged out successfully');
      })
      .catch(error => {
        console.error('Logout failed:', error);
      });
  }
}
