import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TokenValidaterService } from './token-validater.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    isSafari: boolean;
    public practiceIdSubject = new Subject<any>();
    practiceIdObservable = this.practiceIdSubject.asObservable();
    public routesSubject = new Subject<any>();
    routesObservable = this.routesSubject.asObservable();
    public cencelledSubject = new Subject<any>();
    cancelObservable = this.cencelledSubject.asObservable();
    public lateSubject = new Subject<any>();
    lateObservable = this.lateSubject.asObservable();
    public vetSubject = new Subject<any>();
    vetObservable = this.vetSubject.asObservable();
    public picSubject = new Subject<any>();
    picUpdate = this.picSubject.asObservable();
    public vetUpdateSubject = new Subject<any>();
    vetUpdateObservable = this.vetUpdateSubject.asObservable();
    public vhdPAUpdateSubject = new Subject<any>();
    vhdPAUpdateObservable = this.vhdPAUpdateSubject.asObservable();
    constructor(
        private tokenService: TokenValidaterService,
        private router: Router) { }

    /**
     * get user data stored in local storage
     */
    get getStorage(): any {
        if (JSON.parse(localStorage.getItem('result'))) {
            return JSON.parse(localStorage.getItem('result'));
        }
    }

    /**
     * get token stored in local storage
     */
    get getToken(): any {
        if (localStorage.getItem('accessToken')) {
            return localStorage.getItem('accessToken');
        } else {
            return false;
        }
    }
    get Logo(): any {
        return './assets/imgs/logo.png';
    }
    navigateByRole(): void {
        switch (this.getStorage['userroles.role.roleName']) {
            case 'VHDA': this.navigation('/vhdadmin'); break;
            case 'PA': this.navigation('/practiceadmin'); break;
            case 'VET':
                if (this.getStorage.practiceId === null) {
                    this.navigation('/auth/practiceselection');
                } else {
                    this.navigation('/vetpractice');
                }
                break;
            case 'PO': this.navigation('/pets'); break;
            default:
                break;
        }
    }

    navigation(path: string): void {
        this.router.navigateByUrl(path);
    }

    /**
     * detect the safari browser
     */
    public detectBrowser(): any {
        this.isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        return this.isSafari;
    }
    /**
     * get vet data stored in local storage
     */
    get getVetFromStorage(): any {
        if (JSON.parse(localStorage.getItem('vet'))) {
            return JSON.parse(localStorage.getItem('vet'));
        }
    }
}
