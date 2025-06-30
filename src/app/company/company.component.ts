import { Component, OnInit } from '@angular/core';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  imports: [NzTypographyModule],
  standalone: true
})
export class CompanyComponent implements OnInit {
  company: any; // Set this appropriately

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.GetDocument('tst', 'company', 'tst')
      .then((company: Company) => {
        this.company = company;
      });
  }

}

export interface Company {
    $id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    mc: string;
    dot: string;
    ein: string;
}