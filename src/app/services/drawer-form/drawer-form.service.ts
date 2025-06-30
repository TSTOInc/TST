// drawer-form.service.ts
import { Injectable } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';

@Injectable({
  providedIn: 'root'
})
export class DrawerFormService {
  constructor(private drawerService: NzDrawerService) {}

  openDrawer(type: string, data?: any) {
    this.drawerService.create({
      //remove last character of type
      nzTitle: `Add ${type.charAt(0).toUpperCase() + type.slice(1, -1)}`,
      nzContent: DynamicFormComponent,
      nzContentParams: { type, data },
      nzWidth: '480px'
    });
  }
}
