import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchBy',
    pure: true
})
export class SearchBy implements PipeTransform {
    transform(value: any, args: string[], args1: any[]): any {
        let filterby = args;
        if (value) {
            return filterby ? value.filter(data => this.filterByAll(data, filterby, args1)) : value;
        }

    }

    public filterByAll(data: any, filterby: any, columns: any[]): boolean {
        for (var i = 0; i < columns.length; i++) {
            if ((typeof data[columns[i].mapping] === 'string' && data[columns[i].mapping].toLowerCase().indexOf(filterby.toLowerCase().trim()) != -1) ||
                data[columns[i].mapping] == filterby) {
                return true;
            }
        }
        return false;
    }
}