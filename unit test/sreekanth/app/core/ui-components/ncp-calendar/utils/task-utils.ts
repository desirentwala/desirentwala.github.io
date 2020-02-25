export interface TaskItem {
    taskID?: string;
    taskType: string;
    title: string;
    details: string;
    responsiblePerson: string;
    priority: string;
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
    dependentTask: string;
    color: EventColor;
    draggable?: boolean;
    attachments?: Attachment[];
    notes?: Notes[];
    reminder: string;
    status: string;
}
export interface EventColor {
    primary: string;
    secondary: string;
}
export interface Attachment {
    noteID?: any;
    mimeType?: any;
    fileName: any;
    documentContent: any;
    seq: any;
}
export interface Notes {
    comments: any;
    actionPoint: any;
    meetingStatus: any;
}
