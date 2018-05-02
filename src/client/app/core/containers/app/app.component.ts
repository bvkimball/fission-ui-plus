import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { PingService } from '../../../shared/services/ping.services';
import { Observable } from 'rxjs/Observable';
import { Store, Select } from 'ngxs';
import { AuthState, Logout } from '../../../auth/auth.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @Select(AuthState.isLoggedIn) loggedIn$: Observable<boolean>;
  @ViewChild('snav') sidenav: MatSidenav;
  pongMessage$: Observable<any>;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private store: Store, private pingService: PingService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 200px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.pongMessage$ = this.pingService.getPong();
  }

  ping() {
    this.pingService.sendPing(new Date());
  }

  signout() {
    this.store.dispatch(new Logout());
    this.sidenav.close();
  }

}
