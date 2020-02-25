import { ConfigService } from '../services/config.service';
import { Logger } from '../ui-components/logger/logger';
import { AbstractFactory } from './abstractfactory';
import { FormBuilder } from '@angular/forms';
import { FactoryEntry } from './factoryentry';

export class FactoryProvider {
    public static populateComponentInstance(_config: ConfigService, _logger: Logger, formBuilder: FormBuilder) {
        let componentInstance = {
            loaderConfig: <ConfigService>_config,
            _logger: <Logger>_logger,
            formBuilder: <FormBuilder>formBuilder
        };
        return componentInstance;
    }

    /**
    * @summary Creates factory object from the entry given in FactoryEntry
    * @param {ConfigService} _config
    * @param {Logger} _logger
    * @param {FormBuilder} formBuilder
    * @return AbstractFactory
    */
    public static getFactoryInstance<AbstractFactory>(_config: ConfigService, _logger: Logger, formBuilder: FormBuilder) {
        let factory: any = FactoryEntry.getFactoryEntry();
        let instance = Object.create(factory.prototype);
        let componentInstance = this.populateComponentInstance(_config, _logger, formBuilder);
        factory.prototype.constructor.apply(instance, [componentInstance]);
        return instance;
    }
}
