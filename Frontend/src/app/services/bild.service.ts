import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BildService {
  private isCameraShotSubject = new BehaviorSubject<boolean>(false);
  isCameraShot$ = this.isCameraShotSubject.asObservable();


  constructor() { }

  setIsCameraShot(value: boolean) {
    this.isCameraShotSubject.next(value);
  }
}
