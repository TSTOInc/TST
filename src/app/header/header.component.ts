import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout'; 
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-header',
  imports: [NzLayoutModule, NzIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
