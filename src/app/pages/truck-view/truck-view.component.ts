import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { Router } from '@angular/router';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { RouterLink } from '@angular/router';

export interface Vehicle {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;

  unit_number: string;
  vin: string;
  make?: string;
  model?: string;
  color?: string; // Adjust as needed
  transponder?: string;

  plate?: Plate[];
  img?: string;
  inspections?: Inspection[];
  docs?: string[];
}
export interface Plate {
  $id: string;
  number: string;
  country: string;
  state: string;
  // Add any other fields defined in your 'plate' collection
}

export interface Inspection {
  $id: string;
  date: Date;
  documents: string[];
  // Add any other fields defined in your 'inspection' collection
}


@Component({
  selector: 'app-truck-view',
  imports: [
    CommonModule,
    NzTypographyModule,
    NzTagModule,
    NzPageHeaderModule,
    NzCollapseModule,
    NzTabsModule,
    NzTableModule,
    NzButtonModule,
    NzPopoverModule,
    NzIconModule,
    NzModalModule,
    NzDropDownModule,
    NzCardModule,
    NzGridModule
  ],
  templateUrl: './truck-view.component.html',
  styleUrl: './truck-view.component.scss'
})

export class TruckViewComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  truckId: any;
  truck: Vehicle | undefined;



  constructor(private authService: AuthService, private Router: Router, private sanitizer: DomSanitizer) {
    this.truckId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.authService.GetDocument('tst', 'trucks', this.truckId)
      .then((vehicle: Vehicle) => {
        this.truck = vehicle;
      });
  }

  onBack(): void {
    this.Router.navigate(['../'], { relativeTo: this.route });
  }


  isModalVisible = false;
  currentPdfSrc = '';
  safePdfSrc!: SafeResourceUrl;

  openPdfModal(pdfUrl: string): void {
    this.safePdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
    this.isModalVisible = true;
  }
  getDocTitle(item: string): string {
      if (!item) return '';
  const name = item.substring(item.lastIndexOf('/') + 1).split('?')[0];
  return decodeURIComponent(name);
  }
  handleCancel(): void {
    this.isModalVisible = false;
  }
}
