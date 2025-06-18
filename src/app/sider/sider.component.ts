import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sider',
  imports: [NzMenuModule, NzLayoutModule, NzIconModule, NzBreadCrumbModule, NzSpinModule, NzAlertModule, RouterOutlet, RouterLink],
  templateUrl: './sider.component.html',
  styleUrl: './sider.component.scss'
})
export class SiderComponent {

}
