
export interface EventObject {
    eventId: string;
    triggerEvent: string;
    isRunWithOutId: boolean;
    isCreateSubscribtion: boolean;
    path: string;
    subscribtionKey: string;
    subscribtionType: string;
    inputParams: InputParam[];
    eventBody: EventBody[];
    output: Output[];
}

export interface EventBody {
    operation: string;
    operationProcedure: OperationProcedure[];
    isOperationHaveOutput: boolean;
    operationOutputVar: string;
    order: number;
    subOperations: EventBody[];
}

export interface OperationProcedure {
    order: number;
    isOperationOutput?: boolean;
    operationOutputVar?: string;
    inputParamIndex?: number;
    isFromInputParams?: boolean;
    inputParam?: InputParam;
    operator?: string;
    isOperation?: boolean;
    operation?: string;
    operationProcedure?: OperationProcedure[];
}

export interface InputParam {
    isDerivedValue: boolean;
    staticValue: string;
    isFromGroupValue: boolean;
    path: string;
    keyName: string;
    isEventValue: boolean;
    eventDataKey: string;
}

export interface Output {
    isUpdateView: boolean;
    viewDetails: ViewDetail[];
    isUpdateFormGroup: boolean;
    formDetails: FormDetail[];
}

export interface FormDetail {
    path: string;
    valueName: string;
    keyName: string;
    fillPath: boolean;
    isGroup: boolean;
    isArray: boolean;

}

export interface ViewDetail {
    elementId: string;
    key: string;
    valueName: string;
    reCurringId: boolean;
}

export const Operations = {
    IF: 'if',
    ELSE: 'else',
    FOR: 'for'
}

export const subscriptionType = {
    VALUECHANGES: 'valueChanges',
    STATUSCHANGES: 'statusChanges'
}
