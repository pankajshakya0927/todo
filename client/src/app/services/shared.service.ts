import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private color = new Subject();
  $color = this.color.asObservable();

  setColor(paint: String) {
    this.color.next(paint);
  }
}
