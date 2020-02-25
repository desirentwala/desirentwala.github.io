export var moduleRoute = [
    { loadChildren: 'app/modules/transaction/transaction.module#TransactionModules' },
    { loadChildren: 'app/modules/activity/activity.module#ActivityModule' },
    { loadChildren: 'app/modules/customer/customer.module#CustomerModule' },
    { loadChildren: 'app/modules/news-announcement/news-announcement.module#NewsAnnouncementModule' },
    { loadChildren: 'app/modules/product/product.module#ProductModule' },
    { loadChildren: 'app/modules/userManagement/user.module#UserModules' },
    { loadChildren: 'app/modules/claims/claims.module#ClaimModules' },
    { loadChildren: 'app/modules/campaigns/campaigns.module#CampaignsModule' },
    { loadChildren: 'app/modules/payments/payments.module#PaymentsModule' },
    { loadChildren: 'app/modules/receipt/receipt.module#ReceiptModule' },
    { loadChildren: 'app/modules/policyList/policies.module#PoliciesModule' },
    { loadChildren: 'app/modules/branchManagement/branch.module#BranchModules' },
    { loadChildren: 'app/modules/userGroupManagement/usergroup.module#UserGroupModule' },
    { loadChildren: 'app/modules/auxillary/makemodel/makemodel.module#MakemodelModule'},
    { loadChildren: 'app/modules/auxillary/postalcode/postalcode.module#PostalCodeModule'},
	{ loadChildren: 'app/modules/roleManagement/role.module#RoleModule' },
	{ loadChildren: 'app/modules/auxillary/miscSetup/miscSetup.module#MiscSetupModule'},
    { loadChildren: 'app/modules/auxillary/currency/currency.module#CurrencyModule'}
];