import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.scss']
})
export class ColorPaletteComponent {
  @Input() color: string = '';
  @Output() event: EventEmitter<string> = new EventEmitter<string>();

  public defaultColors: string[] = [
    '#ffffff',
    '#000105',
    '#3e6158',
    '#3f7a89',
    '#96c582',
    '#b7d5c4',
    '#bcd6e7',
    '#7c90c1',
    '#9d8594',
    '#dad0d8',
    '#4b4fce',
    '#4e0a77',
    '#a367b5',
    '#ee3e6d',
    '#d63d62',
    '#c6a670',
    '#f46600',
    '#cf0500',
    '#efabbd',
    '#8e0622',
    '#f0b89a',
    '#f0ca68',
    '#62382f',
    '#c97545',
    '#c1800b',
  ];

  constructor(private sharedService: SharedService, private bottomSheetRef: MatBottomSheetRef<ColorPaletteComponent>) {}

  changeColor(color: string): void {
    this.color = color;
    this.sharedService.setColor(this.color);
    this.bottomSheetRef.dismiss();
  }
}
