import { ActivityComponent } from "../activity/activity.component";
import { PolicyMovementComponent } from "../activity/policyActivity/policyMovement.component";
import { CurrencyEditComponent } from '../auxillary/currency/currencyEdit/currencyEdit.component';
import { CurrencyListComponent } from '../auxillary/currency/currencyList/currencyList.component';
import { NewCurrencyComponent } from '../auxillary/currency/newCurrency/newCurrency.component';
import { MakeEditComponent } from '../auxillary/makemodel/makeEdit/makeEdit.component';
import { MakeListComponent } from '../auxillary/makemodel/makemaintenance/makeList.component';
import { ModelEditComponent } from '../auxillary/makemodel/modelEdit/modelEdit.component';
import { ModelListComponent } from '../auxillary/makemodel/modelList/modelList.component';
import { NewModelComponent } from '../auxillary/makemodel/newModel/newModel.component';
import { NewMakeComponent } from '../auxillary/makemodel/newmake/newmake.component';
import { MiscSetupEditComponent } from '../auxillary/miscSetup/miscSetupEdit/miscSetupEdit.component';
import { MiscSetupListComponent } from '../auxillary/miscSetup/miscSetupList/miscSetupList.component';
import { NewMiscSetupComponent } from '../auxillary/miscSetup/newMiscSetup/newMiscSetup.component';
import { NewPostalCodeComponent } from '../auxillary/postalcode/newpostalcode/newPostalCode.component';
import { PostalCodeEditComponent } from '../auxillary/postalcode/postalcodeEdit/postalCodeEdit.component';
import { PostalCodeListComponent } from '../auxillary/postalcode/postalcodelist/postalCodeList.component';
import { BranchListComponent, NewBranchComponent } from '../branchManagement';
import { BranchEditComponent } from '../branchManagement/branchEdit/branchEdit';
import { CampaignDetailComponent } from "../campaigns/campaignDetail/campaignDetail.component";
import { CampaignsComponent } from "../campaigns/campaigns.component";
import { ClaimsComponent } from "../claims/claims.component";
import { FnolComponent } from "../claims/fnol/fnol.component";
import { Dashboard, UserprofileComponent } from "../common";
import { FaqComponent } from "../common/faq";
import { AllNotificationComponent } from "../common/navbar/userNotification/allNotification";
import { ReportComponent } from "../common/reports/report.component";
import { termsAndConditionsComponent } from "../common/termsAndConditions";
import { ModuleConstants, RouteConstants } from "../constants/module.constants";
import { CustomerFormComponent } from "../customer/customer-form/customer-form.component";
import { CustomerListComponent } from "../customer/customer-list/customer-list.component";
import { NewsCreationComponent } from "../news-announcement/news-creation/news-creation.component";
import { NewsDisplayComponent } from "../news-announcement/news-display/news-display.component";
import { NewsEditComponent } from "../news-announcement/news-edit/news-edit.component";
import { NewsManagementComponent } from "../news-announcement/news-management/news-management.component";
import { NewsViewComponent } from "../news-announcement/news-view/news-view.component";
import { BatchPaymentComponent } from "../payments/batchPayment/batchPayment.component";
import { PaymentHistoryComponent } from "../payments/paymentHistory/paymentHistory.component";
import { ProductComponent } from "../product";
import { ProductDetailsComponent } from "../product/product-details/product-details.component";
import { ReceiptComponent } from "../receipt/receipt/receipt.component";
import { NewRoleComponent, RoleListComponent } from '../roleManagement';
import { RoleEditComponent } from '../roleManagement/roleEdit/roleEdit';
import { PolicyEndorsementsComponent } from "../transaction/endorsement/policyEndorsements";
import { AviationComponent } from "../transaction/lineOfBusiness/aviation/aviation.component";
import { FireHomeComponent } from "../transaction/lineOfBusiness/fireInsurance/fireHome/fh.component";
import { MarineComponent } from "../transaction/lineOfBusiness/marine/marine.component";
import { PersonalMotorComponent } from "../transaction/lineOfBusiness/motor/personal/pm.component";
import { PersonalAccidentComponent } from "../transaction/lineOfBusiness/personalAccidental/pa.component";
import { TravelComponent } from "../transaction/lineOfBusiness/travel/travel.component";
import { NewUserGroupComponent, UserGroupListComponent } from '../userGroupManagement';
import { UserGroupEditComponent } from '../userGroupManagement/userGroupEdit/userGroupEdit';
import { NewUserComponent, UserListComponent } from "../userManagement";
import { UserEditComponent } from "../userManagement/userEdit/userEdit";
import { PoliciesComponent } from './../policyList/policies/policies.component';
import { LifeComponent } from './../transaction/lineOfBusiness/life/life.component';
import { ComponentDetails } from "./services/component.services";

export class ComponentProvider {

    protected componentMap: Map<String, ComponentDetails>;
    private static _instance: ComponentProvider;
    protected constructor() {
    }

    protected loadComponent() {
        this.componentMap = new Map();
        let componentDetails = this.getTravelComponent();
        this.componentMap.set(ModuleConstants.TRANSACTION + "/" + RouteConstants.TRAVEL, componentDetails);
        componentDetails = this.getMotorComponent();
        this.componentMap.set(ModuleConstants.TRANSACTION + "/" + RouteConstants.MOTOR, componentDetails);
        componentDetails = this.getFireComponent();
        this.componentMap.set(ModuleConstants.TRANSACTION + "/" + RouteConstants.FIRE, componentDetails);
        componentDetails = this.getPAComponent();
        this.componentMap.set(ModuleConstants.TRANSACTION + "/" + RouteConstants.PA, componentDetails);
        componentDetails = this.getLifeComponent();
        this.componentMap.set(ModuleConstants.TRANSACTION + "/" + RouteConstants.LIFE, componentDetails);
        componentDetails = this.getAviationComponent();
        this.componentMap.set(ModuleConstants.TRANSACTION + "/" + RouteConstants.AVIATION, componentDetails);
        componentDetails = this.getEndtComponent();
        this.componentMap.set(ModuleConstants.TRANSACTION + "/" + RouteConstants.ENDT, componentDetails);
        componentDetails = this.getMarineComponent();
        this.componentMap.set(ModuleConstants.TRANSACTION + "/" + RouteConstants.MARINE, componentDetails);

        componentDetails = this.getCustListComponent();
        this.componentMap.set(ModuleConstants.CUSTOMER, componentDetails);
        this.componentMap.set(ModuleConstants.CUSTOMER + "/" + RouteConstants.CUST_LIST, componentDetails);
        componentDetails = this.getCustFormComponent();
        this.componentMap.set(ModuleConstants.CUSTOMER + "/" + RouteConstants.ADD_CUST, componentDetails);

        componentDetails = this.getNewsMgmtComponent();
        this.componentMap.set(ModuleConstants.NEWS, componentDetails);
        this.componentMap.set(ModuleConstants.NEWS + "/" + RouteConstants.NEWS_MGMNT, componentDetails);
        componentDetails = this.getNewsCreationComponent();
        this.componentMap.set(ModuleConstants.NEWS + "/" + RouteConstants.NEWS_CREATION, componentDetails);
        componentDetails = this.getNewsViewComponent();
        this.componentMap.set(ModuleConstants.NEWS + "/" + RouteConstants.NEWS_VIEW, componentDetails);
        componentDetails = this.getNewsEditComponent();
        this.componentMap.set(ModuleConstants.NEWS + "/" + RouteConstants.NEWS_EDIT, componentDetails);
        componentDetails = this.getNewsDisplayComponent();
        this.componentMap.set(ModuleConstants.NEWS + "/" + RouteConstants.ALL_NEWS, componentDetails);

        componentDetails = this.getProductComponent();
        this.componentMap.set(ModuleConstants.PRODUCT, componentDetails);
        componentDetails = this.getProductDetComponent();
        this.componentMap.set(ModuleConstants.PRODUCT + "/" + RouteConstants.PRODUCT_DETAILS, componentDetails);

        componentDetails = this.getNewUserComponent();
        this.componentMap.set(ModuleConstants.USERMGMT, componentDetails);
        this.componentMap.set(ModuleConstants.USERMGMT + "/" + RouteConstants.NEW_USER, componentDetails);
        componentDetails = this.getUserListComponent();
        this.componentMap.set(ModuleConstants.USERMGMT + "/" + RouteConstants.USER_LIST, componentDetails);
        componentDetails = this.getUserEditComponent();
        this.componentMap.set(ModuleConstants.USERMGMT + "/" + RouteConstants.USER_EDIT, componentDetails);


        componentDetails = this.getNewBranchComponent();
        this.componentMap.set(ModuleConstants.BRNCHMGMT, componentDetails);
        this.componentMap.set(ModuleConstants.BRNCHMGMT + "/" + RouteConstants.NEW_BRANCH, componentDetails);
        componentDetails = this.getBranchListComponent();
        this.componentMap.set(ModuleConstants.BRNCHMGMT + "/" + RouteConstants.BRANCH_LIST, componentDetails);
        componentDetails = this.getBranchEditComponent();
        this.componentMap.set(ModuleConstants.BRNCHMGMT + "/" + RouteConstants.BRANCH_EDIT, componentDetails);

        componentDetails = this.getNewUserGroupComponent();
        this.componentMap.set(ModuleConstants.USRGRPMGMT, componentDetails);
        this.componentMap.set(ModuleConstants.USRGRPMGMT + "/" + RouteConstants.NEW_USER_GROUP, componentDetails);
        componentDetails = this.getUserGroupListComponent();
        this.componentMap.set(ModuleConstants.USRGRPMGMT + "/" + RouteConstants.USER_GROUP_LIST, componentDetails);
        componentDetails = this.getUserGroupEditComponent();
        this.componentMap.set(ModuleConstants.USRGRPMGMT + "/" + RouteConstants.USER_GROUP_EDIT, componentDetails);


        componentDetails = this.getActivityComponent();
        this.componentMap.set(ModuleConstants.ACTIVITY, componentDetails);
        componentDetails = this.getPolicyMovmntComponent();
        this.componentMap.set(ModuleConstants.ACTIVITY + "/" + RouteConstants.POLICYMVMNT, componentDetails);

        componentDetails = this.getClaimsComponent();
        this.componentMap.set(ModuleConstants.CLAIMS, componentDetails);
        componentDetails = this.getFnolComponent();
        componentDetails.routeConfig = { 'momentType': 'FT' };
        this.componentMap.set(ModuleConstants.CLAIMS + "/" + RouteConstants.FNOL, componentDetails);
        this.componentMap.set(ModuleConstants.CLAIMS + "/" + RouteConstants.FNOL_OPEN_Held, componentDetails);
        this.componentMap.set(ModuleConstants.CLAIMS + "/" + RouteConstants.FNOLENQ, componentDetails);
        this.componentMap.set(ModuleConstants.CLAIMS + "/" + RouteConstants.FNOL_NOT_CLM, componentDetails);

        componentDetails = this.getFnolComponent();
        componentDetails.routeConfig = { 'momentType': 'NT' };
        this.componentMap.set(ModuleConstants.CLAIMS + "/" + RouteConstants.NT_NEW_CLM, componentDetails);
        this.componentMap.set(ModuleConstants.CLAIMS + "/" + RouteConstants.NT_NOT_CLM, componentDetails);
        this.componentMap.set(ModuleConstants.CLAIMS + "/" + RouteConstants.NT_OPEN_HELD, componentDetails);
        this.componentMap.set(ModuleConstants.CLAIMS + "/" + RouteConstants.NTENQ, componentDetails);

        componentDetails = this.getCampaignsComponent();
        this.componentMap.set(ModuleConstants.CAMPAIGN, componentDetails);
        componentDetails = this.getCampaignDetComponent();
        this.componentMap.set(ModuleConstants.CAMPAIGN + "/" + RouteConstants.CAMP_DETAILS, componentDetails);

        componentDetails = this.getBatchPaymentComponent();
        this.componentMap.set(ModuleConstants.PAYMENT, componentDetails);
        this.componentMap.set(ModuleConstants.PAYMENT + "/" + RouteConstants.BATCH_PAYMENT, componentDetails);
        componentDetails = this.getPaymentHistComponent();
        this.componentMap.set(ModuleConstants.PAYMENT + "/" + RouteConstants.PAYMENT_HIST, componentDetails);

        componentDetails = this.getReceiptComponent();
        this.componentMap.set(ModuleConstants.RECEIPT, componentDetails);
        this.componentMap.set(ModuleConstants.RECEIPT + "/" + RouteConstants.RECEIPT, componentDetails);

        componentDetails = this.getPoliciesComponent();
        this.componentMap.set(ModuleConstants.POLICIES, componentDetails);
        this.componentMap.set(ModuleConstants.POLICIES + "/" + RouteConstants.POLICIES, componentDetails);


        componentDetails = this.getHomeComponent();
        this.componentMap.set(RouteConstants.HOME, componentDetails);

        componentDetails = this.getFAQComponent();
        this.componentMap.set(RouteConstants.FAQ, componentDetails);

        componentDetails = this.getTermsCondtComponent();
        this.componentMap.set(RouteConstants.TERMS_CONDT, componentDetails);

        componentDetails = this.getUserProfileComponent();
        this.componentMap.set(RouteConstants.USER_PROFILE, componentDetails);

        componentDetails = this.getNotificationComponent();
        this.componentMap.set(RouteConstants.NOTIFICATION, componentDetails);

        componentDetails = this.getReportComponent();
        this.componentMap.set(RouteConstants.REPORT, componentDetails);

        componentDetails = this.getNewRoleComponent();
        this.componentMap.set(ModuleConstants.ROLEMGMT, componentDetails);
        this.componentMap.set(ModuleConstants.ROLEMGMT + "/" + RouteConstants.NEW_ROLE, componentDetails);
        componentDetails = this.getRoleListComponent();
        this.componentMap.set(ModuleConstants.ROLEMGMT + "/" + RouteConstants.ROLE_LIST, componentDetails);
        componentDetails = this.getRoleEditComponent();
        this.componentMap.set(ModuleConstants.ROLEMGMT + "/" + RouteConstants.ROLE_EDIT, componentDetails);
    
        componentDetails = this.getNewMakeComponent();
        this.componentMap.set(ModuleConstants.MAKEMODEL, componentDetails);
        this.componentMap.set(ModuleConstants.MAKEMODEL + "/" + RouteConstants.NEW_MAKE, componentDetails);
        componentDetails = this.getMakeListComponent()
        this.componentMap.set(ModuleConstants.MAKEMODEL + "/" + RouteConstants.MAKE_LIST, componentDetails);
        componentDetails = this.getMakeEditComponent();
        this.componentMap.set(ModuleConstants.MAKEMODEL + "/" + RouteConstants.MAKE_EDIT, componentDetails);

        componentDetails = this.getNewModelComponent();
        this.componentMap.set(ModuleConstants.MAKEMODEL + "/" + RouteConstants.NEW_MODEL, componentDetails);
        componentDetails = this.getModelListComponent()
        this.componentMap.set(ModuleConstants.MAKEMODEL + "/" + RouteConstants.MODEL_LIST, componentDetails);
        componentDetails = this.getModelEditComponent();
        this.componentMap.set(ModuleConstants.MAKEMODEL + "/" + RouteConstants.MODEL_EDIT, componentDetails);

        componentDetails = this.getNewPostalCodeComponent();
        this.componentMap.set(ModuleConstants.POSTALCODE, componentDetails);
        this.componentMap.set(ModuleConstants.POSTALCODE + "/" + RouteConstants.NEW_POSTALCODE, componentDetails);
        componentDetails = this.getPostalCodeListComponent();
        this.componentMap.set(ModuleConstants.POSTALCODE + "/" + RouteConstants.POSTALCODE_LIST, componentDetails);
        componentDetails = this.getPostalCodeEditComponent();
        this.componentMap.set(ModuleConstants.POSTALCODE + "/" + RouteConstants.POSTALCODE_EDIT, componentDetails); 
        
        componentDetails = this.getNewMiscSetupComponent();
        this.componentMap.set(ModuleConstants.MISCSETUP, componentDetails);
        this.componentMap.set(ModuleConstants.MISCSETUP + "/" + RouteConstants.NEW_MISCSETUP, componentDetails);
        componentDetails = this.getMiscSetupListComponent();
        this.componentMap.set(ModuleConstants.MISCSETUP + "/" + RouteConstants.MISCSETUP_LIST, componentDetails);
        componentDetails = this.getMiscSetupEditComponent();
        this.componentMap.set(ModuleConstants.MISCSETUP + "/" + RouteConstants.MISCSETUP_EDIT, componentDetails);

        componentDetails = this.getNewCurrencyComponent();
        this.componentMap.set(ModuleConstants.CURRENCY, componentDetails);
        this.componentMap.set(ModuleConstants.CURRENCY + "/" + RouteConstants.NEW_CURRENCY, componentDetails);
        componentDetails = this.getCurrencyListComponent();
        this.componentMap.set(ModuleConstants.CURRENCY + "/" + RouteConstants.CURRENCY_LIST, componentDetails);
        componentDetails = this.getCurrencyEditComponent();
        this.componentMap.set(ModuleConstants.CURRENCY + "/" + RouteConstants.CURRENCY_EDIT, componentDetails);
    }

    public getComponentDetails(module, activity): ComponentDetails {
        let componentDetails: ComponentDetails;
        if (!this.componentMap) {
            this.loadComponent();
        }
        let path = activity;
        if (module) {
            path = module + "/" + activity;
        }
        componentDetails = this.componentMap.get(path);
        return componentDetails;
    }

    protected getNotificationComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/all.modules#AllModules', AllNotificationComponent);
    }

    protected getReportComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/all.modules#AllModules', ReportComponent);
    }

    protected getHomeComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/all.modules#AllModules', Dashboard);
    }

    protected getFAQComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/all.modules#AllModules', FaqComponent);
    }

    protected getTermsCondtComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/all.modules#AllModules', termsAndConditionsComponent);
    }

    protected getUserProfileComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/all.modules#AllModules', UserprofileComponent);
    }

    protected getTravelComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/transaction/transaction.module#TransactionModules', TravelComponent);
    }

    protected getMotorComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/transaction/transaction.module#TransactionModules', PersonalMotorComponent);
    }

    protected getFireComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/transaction/transaction.module#TransactionModules', FireHomeComponent);
    }

    protected getPAComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/transaction/transaction.module#TransactionModules', PersonalAccidentComponent);
    }

    protected getLifeComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/transaction/transaction.module#TransactionModules', LifeComponent);
    }

    protected getEndtComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/transaction/transaction.module#TransactionModules', PolicyEndorsementsComponent);
    }

    protected getCustListComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/customer/customer.module#CustomerModule', CustomerListComponent);
    }

    protected getCustFormComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/customer/customer.module#CustomerModule', CustomerFormComponent);
    }

    protected getNewsMgmtComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/news-announcement/news-announcement.module#NewsAnnouncementModule', NewsManagementComponent);
    }

    protected getNewsCreationComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/news-announcement/news-announcement.module#NewsAnnouncementModule', NewsCreationComponent);
    }

    protected getNewsViewComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/news-announcement/news-announcement.module#NewsAnnouncementModule', NewsViewComponent);
    }

    protected getNewsEditComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/news-announcement/news-announcement.module#NewsAnnouncementModule', NewsEditComponent);
    }

    protected getNewsDisplayComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/news-announcement/news-announcement.module#NewsAnnouncementModule', NewsDisplayComponent);
    }

    protected getProductComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/product/product.module#ProductModule', ProductComponent);
    }

    protected getProductDetComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/product/product.module#ProductModule', ProductDetailsComponent);
    }

    protected getNewUserComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/userManagement/user.module#UserModules', NewUserComponent);
    }

    protected getUserListComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/userManagement/user.module#UserModules', UserListComponent);
    }

    protected getUserEditComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/userManagement/user.module#UserModules', UserEditComponent);
    }

    protected getActivityComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/activity/activity.module#ActivityModule', ActivityComponent);
    }

    protected getPolicyMovmntComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/activity/activity.module#ActivityModule', PolicyMovementComponent);
    }

    protected getFnolComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/claims/claims.module#ClaimModules', FnolComponent);
    }

    protected getClaimsComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/claims/claims.module#ClaimModules', ClaimsComponent);
    }

    protected getCampaignsComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/campaigns/campaigns.module#CampaignsModule', CampaignsComponent);
    }

    protected getCampaignDetComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/campaigns/campaigns.module#CampaignsModule', CampaignDetailComponent);
    }

    protected getBatchPaymentComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/payments/payments.module#PaymentsModule', BatchPaymentComponent);
    }

    protected getPaymentHistComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/payments/payments.module#PaymentsModule', PaymentHistoryComponent);
    }

    protected getReceiptComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/receipt/receipt.module#ReceiptModule', ReceiptComponent);
    }
    protected getPoliciesComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/policyList/policies.module#PoliciesModule', PoliciesComponent);
    }
    protected getAviationComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/transaction/transaction.module#TransactionModules', AviationComponent);
    }

    public static getInstance() {
        return this._instance || (this._instance = new this());
    }

    protected getNewUserGroupComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/userGroupManagement/usergroup.module#UserGroupModule', NewUserGroupComponent);
    }

    protected getUserGroupListComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/userGroupManagement/usergroup.module#UserGroupModule', UserGroupListComponent);
    }

    protected getUserGroupEditComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/userGroupManagement/usergroup.module#UserGroupModule', UserGroupEditComponent);
    }

    protected getBranchEditComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/branchManagement/branch.module#BranchModules', BranchEditComponent);
    }

    protected getNewBranchComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/branchManagement/branch.module#BranchModules', NewBranchComponent);
    }

    protected getBranchListComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/branchManagement/branch.module#BranchModules', BranchListComponent);
    }

    protected getRoleEditComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/roleManagement/role.module#RoleModule', RoleEditComponent);
    }

    protected getNewRoleComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/roleManagement/role.module#RoleModule', NewRoleComponent);
    }

    protected getRoleListComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/roleManagement/role.module#RoleModule', RoleListComponent);
    }

    protected getMakeEditComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/auxillary/makemodel/makemodel.module#MakemodelModule', MakeEditComponent);
    }

    protected getNewMakeComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/auxillary/makemodel/makemodel.module#MakemodelModule', NewMakeComponent);
    }

    protected getMakeListComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/auxillary/makemodel/makemodel.module#MakemodelModule', MakeListComponent);
    }

    protected getNewModelComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/auxillary/makemodel/makemodel.module#MakemodelModule', NewModelComponent);
    }

    protected getModelListComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/auxillary/makemodel/makemodel.module#MakemodelModule', ModelListComponent);
    }

    protected getModelEditComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/auxillary/makemodel/makemodel.module#MakemodelModule', ModelEditComponent);
    }
    protected getNewPostalCodeComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/auxillary/postalcode/postalcode.module#PostalCodeModule', NewPostalCodeComponent);
    }
    protected getPostalCodeListComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/auxillary/postalcode/postalcode.module#PostalCodeModule', PostalCodeListComponent);
    }
    protected getPostalCodeEditComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/auxillary/postalcode/postalcode.module#PostalCodeModule', PostalCodeEditComponent);
    }
    protected getNewMiscSetupComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/auxillary/miscSetup/miscSetup.module#MiscSetupModule', NewMiscSetupComponent);
    }
    protected getMiscSetupListComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/auxillary/miscSetup/miscSetup.module#MiscSetupModule', MiscSetupListComponent);
    }
    protected getMiscSetupEditComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/auxillary/miscSetup/miscSetup.module#MiscSetupModule', MiscSetupEditComponent);
    }
    protected getNewCurrencyComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/auxillary/currency/currency.module#CurrencyModule', NewCurrencyComponent);
    }
    protected getCurrencyListComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/auxillary/currency/currency.module#CurrencyModule', CurrencyListComponent);
    }
    protected getCurrencyEditComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/auxillary/currency/currency.module#CurrencyModule', CurrencyEditComponent);
    }

    protected getMarineComponent(): ComponentDetails {
        return new ComponentDetails('app/modules/transaction/transaction.module#TransactionModules', MarineComponent);
    }

}
