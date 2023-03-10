import {
  Component,
  ElementRef,
  HostListener,
  forwardRef,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: '[text-editable]',
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditableComponent),
      multi: true,
    },
  ],
  styles: [
    `
      :host {
        padding: 4px 0;
      }
      :host[disabled='true'] {
        pointer-events: none;
        background: #f9f9f9;
      }
      :host:empty::before {
        content: attr(placeholder);
        color: #9d9d9d;
      }
    `,
  ],
})
export class TextEditableComponent implements ControlValueAccessor, AfterViewInit {
  @HostListener('input') callOnChange() {
    this.onChange(this.el.nativeElement.textContent);
  }
  @HostListener('blur') callOnTouched() {
    this.onTouched();
  }

  onChange!: (value: string) => void; // init by this.registerOnChange
  onTouched!: () => void; // init by this.registerOnTouched

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.el.nativeElement.setAttribute('contenteditable', 'true');
  }

  // called when model is written to view. (model -> view)
  writeValue(value: string) {
    this.el.nativeElement.textContent = value || '';
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  // called when element property disabled is changed
  setDisabledState(val: boolean): void {
    this.el.nativeElement.setAttribute('disabled', String(val));
    this.el.nativeElement.setAttribute('contenteditable', String(!val));
  }
}
