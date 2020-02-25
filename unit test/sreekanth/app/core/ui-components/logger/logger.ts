

import {Injectable, Optional} from '@angular/core';
import {Level} from './level';
import { ConfigService } from '../../../core/services/config.service';
/**
 * Logger options.
 * See {@link Logger}.
 *
 * level - How much detail you want to see in the logs, 0 being off, 1 being the less detailed, 5 being the most. Defaults to WARN.
 * global - Whether you want the created logger object to be exposed in the global scope. Defaults to true.
 * globalAs - The window's property name that will hold the logger object created. Defaults to 'logger'.
 * store - Whether you want the level config to be saved in the local storage so it doesn't get lost when you refresh. Defaults to false.
 * storeAs - The local storage key that will be used to save the level config if the store setting is true. Defaults to 'angular2.logger.level'.
 *
 * Created by Langley on 3/23/2016.
 *
 */
export class Options {
    level: Level;
    global: boolean;
    globalAs: string;
    store: boolean;
    storeAs: string;
}

// For browsers that don't implement the debug method, log will be used instead. Fixes #62.
const CONSOLE_DEBUG_METHOD = console['debug'] ? 'debug' : 'log';


const DEFAULT_OPTIONS: Options = {
    level: Level.LOG,
    global: true,
    globalAs: 'logger',
    store: false,
    storeAs: 'angular2.logger.level'
};

@Injectable()
export class Logger {

    public _level: Level;
    public _globalAs: string;
    public _store: boolean;
    public _storeAs: string;

    public Level: any = Level;
    config;
    constructor(config: ConfigService, @Optional() options?: Options) {
        this.config = config;
        this.config.loggerSub.subscribe((data) => {
            let logging = this.config.get('logging') ? this.config.get('logging') : false;  // getting logging value from ncp.config.json 
            if (!logging) {
                DEFAULT_OPTIONS['level'] = Level.OFF;
            }
            let { level, global, globalAs, store, storeAs } = Object.assign({}, DEFAULT_OPTIONS, options);
            this._level = level;
            this._globalAs = globalAs;
            this._storeAs = storeAs;

            global && this.global();

            if (store || this._loadLevel()) this.store();
        });
    }

    public _loadLevel = (): Level => Level[localStorage.getItem(this._storeAs) as string];

    public _storeLevel(level: Level) { localStorage[this._storeAs] = level; }

    error(message?: any, ...optionalParams: any[]) {
        this.isErrorEnabled() && console.error.apply(console, arguments);
    }

    warn(message?: any, ...optionalParams: any[]) {
        this.isWarnEnabled() && console.warn.apply(console, arguments);
    }

    info(message?: any, ...optionalParams: any[]) {
        this.isInfoEnabled() && console.info.apply(console, arguments);
    }

    debug(message?: any, ...optionalParams: any[]) {
        this.isDebugEnabled() && (<any>console)[CONSOLE_DEBUG_METHOD].apply(console, arguments);
    }

    log(message?: any, ...optionalParams: any[]) {
        this.isLogEnabled() && console.log.apply(console, arguments);
    }

    global = () => (<any>window)[this._globalAs] = this;

    store(): Logger {

        this._store = true;
        let storedLevel = this._loadLevel();
        if (storedLevel) { this._level = storedLevel; } else {
            this._storeLevel(this.level);
        }

        return this;

    }

    unstore(): Logger {
        this._store = false;
        localStorage.removeItem(this._storeAs);
        return this;
    }

    isErrorEnabled = (): boolean => this.level >= Level.ERROR;
    isWarnEnabled = (): boolean => this.level >= Level.WARN;
    isInfoEnabled = (): boolean => this.level >= Level.INFO;
    isDebugEnabled = (): boolean => this.level >= Level.DEBUG;
    isLogEnabled = (): boolean => this.level >= Level.LOG;

    get level(): Level { return this._level; }

    set level(level: Level) {
        this._store && this._storeLevel(level);
        this._level = level;
    }

}

export const LOGGER_SERVICES = [
    Logger
];
