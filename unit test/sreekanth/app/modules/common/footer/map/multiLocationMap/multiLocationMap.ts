/// <reference types="@types/googlemaps" />
import { CoreModule } from './../../../../../core/ncpapp.core.module';
import { CommonModule } from '@angular/common';
import { Component, AfterContentInit, NgModule, OnInit, ViewChild, ElementRef, NgZone, OnChanges, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Logger } from '../../../../../core/ui-components/logger';
import { ConfigService } from '../../../../../core/services/config.service';
import { UtilsService } from '../../../../../core/ui-components/utils/utils.service';
import { AgmCoreModule } from '@adapters/packageAdapter';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@adapters/packageAdapter';
import { GooglePlaceModule } from '@adapters/packageAdapter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HaversineService, GeoCoord } from '@adapters/packageAdapter';
import { TranslateService } from '@adapters/packageAdapter';
import { SharedModule } from '../../../../../core/shared/shared.module';
import { AllUiComponents } from '../../../../../core/ui-components';

@Component({
    selector: 'multi-location-map',
    templateUrl: './multiLocationMap.html'
})
export class MultiLocationMap implements OnInit, AfterContentInit {
    public options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    public markers: any;
    radius: any = 10;
    places: any;
    public latitude: number;
    public longitude: number;
    public currentLatitude: number;
    public currentLongitude: number;
    @Input() defaultLatitude: number;
    @Input() defaultLongitude: number;

    public searchControl: FormControl;
    public zoom: number;
    @Input() radiusList: any[] = [];
    brandingJson;
    trustedUrl;
    @ViewChild("search")
    public searchElementRef: ElementRef;
    searchedPlace: string = '';
    @Input() defaultLoactionAddress: string = '';
    apiKey: any;
    constructor(public sanitizer: DomSanitizer, public logger: Logger, public configService: ConfigService, public utilsService: UtilsService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private _haversineService: HaversineService, public translate: TranslateService) {
        let brandJsonData = this.configService.getCustom('branding');
        if (!brandJsonData) {
            this.configService.loggerSub.subscribe((data) => {
                if (data === 'brandingLoaded') {
                    brandJsonData = this.configService.getCustom('branding');
                    this.setMapDetails(brandJsonData);
                }
            });
        } else {
            this.setMapDetails(brandJsonData);
        }
        this.apiKey = this.configService.get('googlemapsApiKey');
    }
    setMapDetails(brandUrl) {
        this.brandingJson = brandUrl['map'];
        this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.brandingJson.iframe_src);
    }

    ngAfterContentInit() {

    }
    location(): void {
        let i = 0;
        this.places.forEach((val, idx) => {

            let placeLocation: GeoCoord = {
                latitude: val[0],
                longitude: val[1]
            };

            let currentLocation: GeoCoord = {
                latitude: this.currentLatitude,
                longitude: this.currentLongitude
            };

            let meters = this._haversineService.getDistanceInMeters(placeLocation, currentLocation);
            let kilometers = this._haversineService.getDistanceInKilometers(placeLocation, currentLocation);
            let miles = this._haversineService.getDistanceInMiles(placeLocation, currentLocation);
            val[2] = kilometers
            i = i + 1;
        });
        this.markers = this.places;

    }
    onChange(value: any) {
        this.radius = value;
        this.location();
    }
    getPlaces() {
        let placesResponse = this.configService.getJSON({ key: 'META', path: 'locations' });
        placesResponse.subscribe((data) => {
            if (data['error'] && data.error !== undefined
                && data.error.length >= 1) {
                this.logger.error(data['error']);
            } else {
                this.places = data['value'];
            }
        });

    }
    ngOnInit() {
        //set current position
        this.getPlaces();
        //create search FormControl
        this.searchControl = new FormControl();
        //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ["address"]
            });
            this.setCurrentPosition();
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    this.searchedPlace = place.formatted_address;
                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    this.currentLatitude = place.geometry.location.lat();
                    this.currentLongitude = place.geometry.location.lng();
                    this.zoom = 5;
                    this.location();
                });
            });
        });
    }
    private setCurrentPosition() {
        if ("geolocation" in navigator) {
            navigator.geolocation.watchPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                if (this.latitude) {
                    this.currentLatitude = this.defaultLatitude;
                    this.currentLongitude = this.defaultLongitude;
                }
                this.zoom = 6;
            });
        }
    }
}
@NgModule({
    declarations: [MultiLocationMap],
    imports: [CoreModule, CommonModule, FormsModule,
        ReactiveFormsModule, GooglePlaceModule, AllUiComponents, SharedModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC5Hmfnl9zUVWi4OtAETf4tNimssk1JaEg',
            libraries: ["places"]
        })],
    providers: [HaversineService],
    exports: [MultiLocationMap]
})
export class MultiLocationMapModule { }