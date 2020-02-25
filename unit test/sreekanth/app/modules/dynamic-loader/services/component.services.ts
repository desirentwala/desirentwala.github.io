export class ComponentDetails {
    public modulePath: string;
    public component: any;
    public routeConfig: Object
    constructor(modulePath:string, component?: any){
        this.modulePath = modulePath;
        if(component){
            this.component = component;
        }
    }
}