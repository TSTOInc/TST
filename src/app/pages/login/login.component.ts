import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [NzButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  login() {
    this.authService.login('a@m.com', '12345678');
  }
  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

}
