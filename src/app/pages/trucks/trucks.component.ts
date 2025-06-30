import { Component } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AuthService } from '../../services/auth/auth.service';
import { presetColors } from 'ng-zorro-antd/core/color';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzModalModule } from 'ng-zorro-antd/modal';
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
}
export interface Plate {
  $id: string;
  number: string;
  country: string;
  state: string;
  // Add any other fields defined in your 'plate' collection
}
@Component({
  selector: 'app-trucks',
  imports: [NzTableModule, NzDividerModule, NzTagModule, NzImageModule, NzCardModule, NzGridModule, RouterLink],
  templateUrl: './trucks.component.html',
  styleUrl: './trucks.component.scss'
})
export class TrucksComponent {
  listOfData: Vehicle[] = []
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authService.ListDocuments('tst', 'trucks')
      .then((vehicles: Vehicle[]) => {
        this.listOfData = vehicles;
      });
  }



  isModalVisible = false;
pdfUrl = '/assets/my-document.pdf'; // Adjust path as needed

openPdfModal(): void {
  this.isModalVisible = true;
}

handleCancel(): void {
  this.isModalVisible = false;
}

goToDetails(item: string) {
  this.authService.GetDocument('tst', 'trucks', item)
  .then((vehicle: Vehicle) => {
    console.log(vehicle);
    this.listOfData = [vehicle];
  });

}
}
