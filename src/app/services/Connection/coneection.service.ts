// connection.service.ts
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  private onlineSubject = new BehaviorSubject<boolean>(navigator.onLine);

  constructor(private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      const online$ = fromEvent(window, 'online').pipe(mapTo(true));
      const offline$ = fromEvent(window, 'offline').pipe(mapTo(false));

      merge(online$, offline$).subscribe(status => {
        this.ngZone.run(() => this.onlineSubject.next(status));
      });
    });
  }

  get isOnline$(): Observable<boolean> {
    return this.onlineSubject.asObservable();
  }
}