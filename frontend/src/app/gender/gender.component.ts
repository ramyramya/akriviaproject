import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenderComponent),
      multi: true
    }
  ]
})
export class GenderComponent implements ControlValueAccessor {
  genders = ['Male', 'Female', 'Other'];
  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle the disabled state if needed
  }

  onGenderChange(event: any) {
    this.value = event.value;
    this.onChange(this.value);
    this.onTouched();
  }
}