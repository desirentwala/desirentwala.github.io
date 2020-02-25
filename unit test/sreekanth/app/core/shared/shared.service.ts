import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { TranslateService } from '@adapters/packageAdapter';
import { Subject } from '@adapters/packageAdapter';
import { environment } from '../../../environments/environment';
import { ScreenManipulationHandler } from '../../modules/common/services/screen-manipulation-handler.service';
import { ScreenManipulatorEvent } from '../../modules/common/services/screen-manipulator-event.service';
import { ElementConstants } from '../../modules/transaction/constants/ncpElement.constants';
import { ConfigService } from '../services/config.service';
import { Logger } from '../ui-components/logger';
import { PickListHelper } from '../ui-components/utils/picklist.helper.service';

@Injectable()
export class SharedService {
    translateServices;
    userGroupList;
    permissions;
    public loggerSub = new Subject();
    usersUserGroupList = new Array();
    subOrdinateUserList = new Array();
    userPermissions: string;
    constructor(
        public config: ConfigService,
        public translate: TranslateService,
        public log: Logger,
        public localStorage: LocalStorageService,
        public screenManipulatorHandler: ScreenManipulationHandler,
        public screenManipulatorEvent: ScreenManipulatorEvent,
        public pickListHelper: PickListHelper) {

        log.info('Shared service is initiated');
        translate.addLangs(environment.languages);
        this.translateServices = translate;
        let lang = 'en';
        if (this.config.currentLangName) {
            lang = this.config.currentLangName;
        }
        translate.setDefaultLang(lang);
        translate.getTranslation(lang).subscribe(data => {
            this.config.setI18NLang(data);
            this.config.i18NLang = data;
        });
        translate.onLangChange.subscribe(
            (data) => {
                if (data.translations) {
                    let curLang = this.translateServices.currentLang;
                    let defaultLang = this.translateServices.defaultLang;
                    let translations = this.translateServices.translations;
                    this.config.setI18NLang(data.translations);
                    this.config.i18NLang = data.translations;
                    this.config.currentLangName = data.lang;
                    if (Object.keys(translations[curLang]).length <= 0) {
                        translate.currentLang = defaultLang;
                        this.config.currentLangName = defaultLang;
                        this.config.setI18NLang(translations[defaultLang]);
                        this.config.i18NLang = translations[defaultLang];
                        translate.use(defaultLang);
                        this.config.loggerSub.next('langLoaded');
                    }
                }
                translate.getTranslation(this.config.currentLangName);
            }
        );
    }
    getInstant(key: any) {
        let instantValue = key;
        if (key) {
            this.translateServices.get(key).subscribe(data => {
                instantValue = data;
            });
        }
        return instantValue;
    }
    doShowElement(ele) {
        return this.screenManipulatorHandler.screenManipulatorConfig[ele];
    }
    doTriggerScreenManipulatorEvent(value?) {
        this.screenManipulatorEvent.setEvent(value || {});
    }

    /* To get Screen  Configurational settings */
    getScreenConfiguration() {
        return this.screenManipulatorHandler.configBuffer;
    }

    enablePermissions(object) {
        this.permissions = {
            "suEditOption": false,
            "ugEditOption": false,
            "suShareOption": false,
            "suReAssignOption": false,
            "ugShareOption": false,
            "ugReAssignOption": false,
        };
        this.userPermissions = this.config.getCustom('userPermissions');
        this.userGroupList = this.config.getCustom('userGroups');
        if (this.config.getCustom('user_id') === object.b2bUserId && this.userPermissions) {
            if (String(this.userPermissions).includes(ElementConstants.sharePermissionId)) {
                this.permissions['suShareOption'] = true;
            }
            if (String(this.userPermissions).includes(ElementConstants.reAssignPermissionId)) {
                this.permissions['suReAssignOption'] = true;
            }
            if (this.userGroupList && this.userGroupList instanceof Array && this.userGroupList.length > 0) {
                for (let i = 0; i < this.userGroupList.length; i++) {
                    if (String(this.userGroupList[i].permissionId).includes(ElementConstants.sharePermissionId)) {
                        this.permissions.ugShareOption = true;
                    }
                    if (String(this.userGroupList[i].permissionId).includes(ElementConstants.reAssignPermissionId)) {
                        this.permissions.ugReAssignOption = true;
                    }
                }
            }
            this.loggerSub.next(this.permissions);
        } else {
            this.pickListHelper.getAUXData(this.subOrdinateUserList, "ChildUsers", String(this.config.getCustom('user_id')))
            this.pickListHelper.InputArrayLoaded.subscribe((subordinateUserListData) => {
                if (subordinateUserListData && !subordinateUserListData['error'] && subordinateUserListData instanceof Array) {
                    for (let i = 0; i < subordinateUserListData.length; i++) {
                        this.subOrdinateUserList.push(subordinateUserListData[i].value);
                    }
                    if (this.subOrdinateUserList && this.subOrdinateUserList.length > 0 && this.userPermissions) {
                        if (this.subOrdinateUserList.includes(object.b2bUserId)) {
                            if (String(this.userPermissions).includes(ElementConstants.writePermissionId)) {
                                this.permissions.suEditOption = true;
                            }
                            if (String(this.userPermissions).includes(ElementConstants.reAssignPermissionId)) {
                                this.permissions.suReAssignOption = true;
                            }
                            if (String(this.userPermissions).includes(ElementConstants.sharePermissionId)) {
                                this.permissions.suShareOption = true;
                            }
                        }
                    }
                    this.loggerSub.next(this.permissions);
                } else if(this.userGroupList && this.userGroupList instanceof Array && this.userGroupList.length>0) {
                    this.pickListHelper.getAUXData(this.usersUserGroupList, "UsersUG", object.b2bUserId)
                    this.pickListHelper.InputArrayLoaded.subscribe((usersUserGroupListData) => {
                        if (usersUserGroupListData && !usersUserGroupListData['error'] && usersUserGroupListData instanceof Array && usersUserGroupListData.length>0) {
                            for (let i = 0; i < usersUserGroupListData.length; i++) {
                                this.usersUserGroupList.push(usersUserGroupListData[i].value);
                            }
                            if(this.usersUserGroupList && this.usersUserGroupList instanceof Array && this.usersUserGroupList.length>0){
                                for (let i = 0; i < this.userGroupList.length; i++) {
                                    if (this.usersUserGroupList.includes(this.userGroupList[i].code)) {
                                        if (String(this.userGroupList[i].permissionId).includes(ElementConstants.sharePermissionId)) {
                                            this.permissions.ugShareOption = true;
                                        }
                                        if (String(this.userGroupList[i].permissionId).includes(ElementConstants.reAssignPermissionId)) {
                                            this.permissions.ugReAssignOption = true;
                                        }
                                        if (String(this.userGroupList[i].permissionId).includes(ElementConstants.groupWritePermissionId)) {
                                            this.permissions.ugEditOption = true;
                                        }
                                    }
                                }
                            }
                        }
                        this.loggerSub.next(this.permissions);
                    });
                }
            });
        }
        return this.loggerSub;
    }
}
