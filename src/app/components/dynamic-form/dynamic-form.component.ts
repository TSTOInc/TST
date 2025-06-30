import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { ID } from 'appwrite';
import { map, startWith } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { countries, statesByCountry, Option } from '../../data/location-data';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzAutocompleteModule
  ],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
      <nz-form-item *ngFor="let field of basicFields">
        <nz-form-label [nzFor]="field.key">{{ field.label }}</nz-form-label>
        <nz-form-control
          [nzValidateStatus]="form.controls[field.key]!"
          [nzErrorTip]="getErrorTip(form.controls[field.key]!, field)"
          nzHasFeedback
        >
          <ng-container [ngSwitch]="field.type">
            <input *ngSwitchCase="'text'" nz-input [formControlName]="field.key" [placeholder]="field.label" />
            <input *ngSwitchCase="'email'" nz-input type="email" [formControlName]="field.key" [placeholder]="field.label" />
            <input *ngSwitchCase="'number'" nz-input type="number" [formControlName]="field.key" [placeholder]="field.label" />
            <nz-select *ngSwitchCase="'select'" [formControlName]="field.key" [nzPlaceHolder]="field.label">
              <nz-option *ngFor="let opt of field.options" [nzLabel]="opt.label" [nzValue]="opt.value"></nz-option>
            </nz-select>
            <ng-container *ngSwitchCase="'autocomplete'">
              <input nz-input [nzAutocomplete]="autoColor" [formControlName]="field.key" [placeholder]="field.label" />
              <nz-autocomplete #autoColor>
                <nz-auto-option *ngFor="let opt of filteredOptions | async" [nzValue]="opt.value">
                  {{ opt.label }}
                </nz-auto-option>
              </nz-autocomplete>
            </ng-container>
            <input *ngSwitchDefault nz-input [formControlName]="field.key" [placeholder]="field.label" />
          </ng-container>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item formArrayName="plates" style="margin-top: 24px;">
        <nz-form-label nzRequired nzSpan="24" style="font-weight: bold; font-size: 16px;">Plates</nz-form-label>
        <div *ngFor="let plateGroup of plates.controls; let i = index" [formGroupName]="i" style="display: flex; gap: 12px; align-items: flex-start; margin-bottom: 16px;">
          <nz-form-control style="flex: 2;">
            <input nz-input formControlName="plate" placeholder="Plate" />
          </nz-form-control>

          <nz-form-control style="flex: 2;">
            <input nz-input formControlName="country" placeholder="Country" [nzAutocomplete]="countryAuto" />
            <nz-autocomplete #countryAuto>
              <nz-auto-option *ngFor="let opt of (filteredCountryOptionsArray[i] | async)" [nzValue]="opt.label">
                {{ opt.label }}
              </nz-auto-option>
            </nz-autocomplete>
          </nz-form-control>

          <nz-form-control style="flex: 2;">
            <input nz-input formControlName="state" placeholder="State" [nzAutocomplete]="stateAuto" />
            <nz-autocomplete #stateAuto>
              <nz-auto-option *ngFor="let opt of (plateStateOptions[i] | async)" [nzValue]="opt.label">
                {{ opt.label }}
              </nz-auto-option>
            </nz-autocomplete>
          </nz-form-control>

          <button nz-button nzType="link" nzDanger (click)="removePlate(i)" [disabled]="plates.length === 1">Remove</button>
        </div>

        <button nz-button nzType="dashed" (click)="addPlate()" style="width: 100%">+ Add Plate</button>
      </nz-form-item>

      <div style="text-align: right; margin-top: 24px;">
        <button nz-button nzType="primary" [disabled]="form.invalid">Save Truck</button>
      </div>
    </form>
  `
})
export class DynamicFormComponent implements OnInit {
  @Input() type!: string;
  @Input() data?: any;

  form!: FormGroup;
  basicFields: any[] = [];

  filteredOptions!: Observable<Option[]>;
  filteredCountryOptionsArray: Observable<Option[]>[] = [];
  plateStateOptions: Observable<Option[]>[] = [];

  countryOptions: Option[] = countries;

  private colorOptions = [
    { label: 'Black', value: 'Black' }, { label: 'White', value: 'White' }, { label: 'Silver', value: 'Silver' },
    { label: 'Gray', value: 'Gray' }, { label: 'Red', value: 'Red' }, { label: 'Blue', value: 'Blue' },
    { label: 'Green', value: 'Green' }, { label: 'Yellow', value: 'Yellow' }, { label: 'Brown', value: 'Brown' },
    { label: 'Beige', value: 'Beige' }, { label: 'Gold', value: 'Gold' }, { label: 'Orange', value: 'Orange' },
    { label: 'Purple', value: 'Purple' }, { label: 'Pink', value: 'Pink' }, { label: 'Turquoise', value: 'Turquoise' }
  ];

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.basicFields = this.getFieldsForType(this.type);

    const controls: any = {};
    this.basicFields.forEach(f => {
      const validators = [];
      if (f.required) validators.push(Validators.required);
      if (f.minLength) validators.push(Validators.minLength(f.minLength));
      if (f.maxLength) validators.push(Validators.maxLength(f.maxLength));
      controls[f.key] = [this.data?.[f.key] || '', validators];
    });

    this.form = this.fb.group({ ...controls, plates: this.fb.array([]) });

    if (this.data?.plates?.length) {
      this.data.plates.forEach((p: any) => this.plates.push(this.createPlateGroup(p)));
    } else {
      this.addPlate();
    }

    if (this.basicFields.some(f => f.key === 'color' && f.type === 'autocomplete')) {
      this.filteredOptions = this.form.get('color')!.valueChanges.pipe(
        startWith(''),
        map(value => this.filterColors(value || ''))
      );
    }
  }

  get plates(): FormArray {
    return this.form.get('plates') as FormArray;
  }

  createPlateGroup(data?: any): FormGroup {
    const group = this.fb.group({
      plate: [data?.plate || '', [Validators.required, Validators.pattern(/^[A-Z0-9\- ]+$/i)]],
      country: [data?.country || '', Validators.required],
      state: [data?.state || '', Validators.required]
    });

    const countryControl = group.get('country')!;
    const stateControl = group.get('state')!;

    this.filteredCountryOptionsArray.push(
      countryControl.valueChanges.pipe(
        startWith(countryControl.value || ''),
        map(value => this._filterOptions(value, this.countryOptions))
      )
    );

    this.plateStateOptions.push(
      combineLatest([
        countryControl.valueChanges.pipe(startWith(countryControl.value || '')),
        stateControl.valueChanges.pipe(startWith(stateControl.value || ''))
      ]).pipe(
        map(([countryVal, stateVal]) => {
          const states = statesByCountry[countryVal] || [];
          return this._filterOptions(stateVal, states);
        })
      )
    );

    countryControl.valueChanges.subscribe(() => {
      stateControl.setValue('');
    });

    return group;
  }

  addPlate() {
    this.plates.push(this.createPlateGroup());
  }

  removePlate(index: number) {
    if (this.plates.length > 1) {
      this.plates.removeAt(index);
      this.filteredCountryOptionsArray.splice(index, 1);
      this.plateStateOptions.splice(index, 1);
    }
  }

  filterColors(value: string) {
    const filterValue = value.toLowerCase();
    return this.colorOptions.filter(option => option.label.toLowerCase().includes(filterValue));
  }

  getFieldsForType(type: string) {
    if (type === 'trucks') {
      return [
        { key: 'unit_number', label: 'Unit Number', type: 'text', required: true },
        { key: 'vin', label: 'VIN', type: 'text', required: true },
        { key: 'make', label: 'Make', type: 'text' },
        { key: 'model', label: 'Model', type: 'text' },
        { key: 'color', label: 'Color', type: 'autocomplete', required: true, options: this.colorOptions },
        { key: 'transponder', label: 'Transponder', type: 'text' }
      ];
    }
    return [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'email' }
    ];
  }

  getErrorTip(control: AbstractControl | null, field: any) {
    if (!control || !control.errors || !control.touched) return undefined;
    if (control.hasError('required')) return `${field.label} is required`;
    if (control.hasError('minlength')) return `${field.label} is too short`;
    if (control.hasError('maxlength')) return `${field.label} is too long`;
    if (control.hasError('pattern')) return `Invalid ${field.label.toLowerCase()} format`;
    return undefined;
  }

  private _filterOptions(value: string, options: Option[]): Option[] {
    const filterValue = value ? value.toLowerCase() : '';
    return options.filter(opt => opt.label.toLowerCase().includes(filterValue));
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.CreateDocument('tst', this.type, ID.unique(), this.form.value);
    }
  }
}
