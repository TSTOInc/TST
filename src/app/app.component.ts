import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './services/auth/auth.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { LoaderComponent } from "./components/loader/loader.component";
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { SiderComponent } from './components/sider/sider.component';
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, NzAlertModule, NzSpinModule, LoaderComponent, NzBreadCrumbModule, NzIconModule, NzLayoutModule, NzMenuModule, SiderComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TST';
  isLoggedIn = true;
  isAuthChecked = false;

  constructor(private authService: AuthService) {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.authService.isAuthChecked$.subscribe(isAuthChecked => {
      this.isAuthChecked = isAuthChecked;
    });
  }
  

}
