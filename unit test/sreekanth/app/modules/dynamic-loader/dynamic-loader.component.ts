import {
    Component,
    OnDestroy,
    ComponentFactoryResolver,
    ViewContainerRef,
    AfterViewInit,
    ViewChild,
    ComponentRef,
    NgModuleFactoryLoader,
    Injector
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteConstants } from '../constants/module.constants';
import { CompProviderEntry } from './comp-provider-entry';
import { ComponentProvider } from './component.provider';
import { ComponentDetails } from './services/component.services';

@Component({
    template: `
    <div #vc></div>
    `
})
export class DynamicLoader implements OnDestroy, AfterViewInit {
    @ViewChild('vc', { read: ViewContainerRef }) _container: ViewContainerRef;
    private compInstance;

    constructor(private _injector: Injector,
        private loader: NgModuleFactoryLoader,
        private route: ActivatedRoute) {
    }

    ngAfterViewInit(): void {
        let componentProvider: ComponentProvider = CompProviderEntry.getCompProviderEntry().getInstance();
        this.route.params.subscribe(params => {
            const module = params['module'];
            const activity = params['activity'];
            let componentDetails: ComponentDetails = componentProvider.getComponentDetails(module, activity);
            this.createComponent(componentDetails.modulePath, componentDetails.component, componentDetails.routeConfig);
        });
    }

    ngOnDestroy(): void {
        if (this.compInstance) {
            this.compInstance.destroy();
        }
    }

    private createComponent(path, component, routeConfig) {
        this.loader.load(path).then((factory) => {
            const module = factory.create(this._injector);
            const resolver = module.componentFactoryResolver;
            const cmpFactory = resolver.resolveComponentFactory(component);
            if(routeConfig){
                this.route.snapshot.routeConfig.data = routeConfig;
            }
            this._container.clear();
            this.compInstance = this._container.createComponent(cmpFactory);
            this.compInstance.hostView.detectChanges();
            this.compInstance.onDestroy(() => {
                this.compInstance.changeDetectorRef.detach();
            });
        });
    }

}