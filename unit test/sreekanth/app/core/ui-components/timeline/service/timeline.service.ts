import { ConfigService } from '../../../services/config.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TimeLineService {
    public timelineConfig: any ;
    constructor(config: ConfigService) {
        var resp = config.getJSON( { key: 'META', path: 'timelineConfig' });
        resp.subscribe((data) => {
            if(data){
                this.timelineConfig = data;
            }
        });
     }

     getHeaderForType(eventCode){
        return this.timelineConfig[eventCode]['header'];
     }

     getIconForType(eventCode){
         return this.timelineConfig[eventCode]['icon'];
     }

     getDescForType(eventCode){
         return this.timelineConfig[eventCode]['desc'];
     }
     getKeyMapForType(eventCode){
         return this.timelineConfig[eventCode]['keyMap'];
     }
}