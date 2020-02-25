import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'joinPipe'
})

export class JoinPipe implements PipeTransform {
    constructor() {
    }
    transform(arrayData:Array<any>, joinString:string): any {
        if(arrayData && arrayData.length>0){
            return arrayData.join(joinString);
        }else{
            return '';
        }
    }
}
