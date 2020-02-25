import { UserFormService } from './../../../../../modules/userManagement/services/userform.service';
import { UtilsService } from './../../../utils/utils.service';
import { NCPCalendarComponent } from './../../ncp-calendar.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { TaskItem, Attachment, Notes } from './../task-utils';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input, forwardRef, ViewChild } from '@angular/core';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { endOfDay, startOfDay } from 'date-fns';

import { ConfigService } from '../../../../services/config.service';
import { EventService } from '../../../../services/event.service';
import { Logger } from '../../../logger/logger';
import { TaskService } from '../task.services';
import { DateFormatService } from '../../../ncp-date-picker/services/ncp-date-picker.date.format.service';
import { Subject } from '@adapters/packageAdapter';

const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    },
    green: {
        primary: '#228B22',
        secondary: '#228B22'
    }
};
export const NCP_TASK_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NCPTaskComponent),
    multi: true
};
@Component({
    selector: 'ncp-task',
    templateUrl: 'ncp-task.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,

    providers: [NCP_TASK_CONTROL_VALUE_ACCESSOR]
})
export class NCPTaskComponent implements OnInit, ControlValueAccessor {
    private onChangeCallback: (taskInfoData: TaskItem) => void = () => { };
    @Input() taskListDependency: any[] = [];
    @Input() taskType: string = 'NEW';
    @Input() changeId: string;
    public taskInfo: TaskItem;
    @ViewChild('viewEditEventModal') viewEditEventModal;
    fileSize;
    uploadedFileList: any[] = [];
    changeSub: any = '';
    activeDayIsOpen: boolean = false;
    isReadOnlyFlag: boolean = false;
    isdisable: boolean = true;
    modalData: {
        action: string;
        event: CalendarEvent;
    };
    editableEvent: CalendarEvent<any>[] = [];
    // tslint:disable-next-line:member-ordering
    responsiblePersonsList: any[] = [];
    dependentTaskList: any[] = [];
    taskPriority = [
        { label: 'High', value: '01' },
        { label: 'Medium', value: '02' }
    ];
    taskStatus = [
        { label: 'New Task', value: 'New' },
        { label: 'In Progress', value: 'InProgress' },
        { label: 'Completed', value: 'Completed' }
    ];
    NCPDatePickerNormalOptions = {
        todayBtnTxt: 'Today',
        firstDayOfWeek: 'mo',
        alignSelectorRight: true,
        indicateInvalidDate: true,
        showDateFormatPlaceholder: true
    };

    showAllEvents: boolean = false;
    newAttachment: Attachment = {
        fileName: '',
        documentContent: '',
        seq: '',
    };
    newNotes: Notes = {
        comments: '',
        actionPoint: '',
        meetingStatus: ''
    }
    events: CalendarEvent[] = [];
    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                //     this.editableEvent = this.events.filter(iEvent => iEvent === event);
                //    this.viewEditEventModal.open();
                this.handleEvent('Edited', event);
                this.refresh.next();
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                this.handleEvent('Deleted', event);
                this.refresh.next();
            }
        }
    ];

    newTask: TaskItem = {
        taskID: '',
        title: 'New Task',
        taskType: 'TASK',
        details: '',
        responsiblePerson: '',
        priority: '02',
        startDate: '',
        endDate: '',
        color: JSON.parse(JSON.stringify(colors)).blue,
        draggable: true,
        startTime: '00:00:00',
        attachments: [JSON.parse(JSON.stringify(this.newAttachment))],
        notes: [JSON.parse(JSON.stringify(this.newNotes))],
        endTime: '00:00:00',
        dependentTask: '',
        reminder: '',
        status: 'New'
    };
    newEvent: CalendarEvent = {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        allDay: false,
        cssClass: "",
        color: JSON.parse(JSON.stringify(colors)).red,
        draggable: true,
        resizable: {
            beforeStart: true,
            afterEnd: true
        },
        actions: this.actions,
        meta: {
            user_technical: {},
            taskType: "",
            taskID: "",
        }
    };
    refresh: Subject<any> = new Subject();
    input = { 'taskID': '' };
    userListInputJson = {
        'user_name': '',
        'user_group': '',
        'user_status': '',
        'user_agency_code': '',
        'user_branch': ''
    }

    constructor(public config: ConfigService, public changeRef: ChangeDetectorRef,
        public logger: Logger, public eventHandler: EventService,
        public taskService: TaskService, public dateFormatService: DateFormatService,
        public ncpCalendarComponent: NCPCalendarComponent, public utilsService: UtilsService,
        public loaderConfig: ConfigService, public _logger: Logger,public userForsmService: UserFormService) {
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        let todayString = this.dateFormatService.formatDate(today);
        let taskStartDate = this.dateFormatService.formatDate(this.ncpCalendarComponent.newEvent.start);
        this.newTask.startDate = taskStartDate;
        this.newTask.endDate = taskStartDate;
        let retriveTaskListResponse = this.taskService.retrieveTask(this.input);
        retriveTaskListResponse.subscribe(
            (retriveTaskListResponseData) => {
                if (retriveTaskListResponseData.error) {
                    this.loaderConfig.setLoadingSub('no');
                    this._logger.error('error() ===>', 'error in technical user' + retriveTaskListResponseData.error);
                } else {
                    this.loaderConfig.setLoadingSub('no');
                    let code = 'taskID';
                    let desc = 'title';
                    let response = this.utilsService.convertArrayDataListToDropdownList(retriveTaskListResponseData, code, desc);
                    this.dependentTaskList = response;
                }
            }
        );

        let populateUserListResponse = this.userForsmService.getUserList(this.userListInputJson);
        populateUserListResponse.subscribe(
            (populateUserListResponseData) => {
                if (populateUserListResponseData.error) {
                    this.loaderConfig.setLoadingSub('no');
                    this._logger.error('error() ===>', 'error in technical user' + populateUserListResponseData.error);
                } else {
                    this.loaderConfig.setLoadingSub('no');
                    let code = 'user_party_id';
                    let desc = 'user_id';
                    let response = this.utilsService.convertArrayDataListToDropdownList(populateUserListResponseData, code, desc);
                    this.responsiblePersonsList = response;
                }
            }
        );
    }
    ngOnInit() {
        let taskStartDate = this.dateFormatService.formatDate(this.ncpCalendarComponent.newEvent.start);
        if (this.taskType === 'NEW' && this.ncpCalendarComponent.taskType === 'NEW') {
            this.newTask.startDate = taskStartDate;
            this.newTask.endDate = taskStartDate;
            this.taskInfo = JSON.parse(JSON.stringify(this.newTask));
        }
        this.changeSub = this.eventHandler.changeSub.subscribe((data) => {
            if (data.id === 'documentContent') {
                this.getMimeTypedata(data.value.value, data.value.index);
            } else if (data.id === 'editTask') {
                this.taskType = 'EDIT';
                this.writeValue(data.value);
                this.doEnableAddUpdateButton();
                this.changeRef.markForCheck();
            }
        });
        this.changeSub = this.eventHandler.changeSub.subscribe((data) => {
            if (data.id === 'documentContent') {
                this.getMimeTypedata(data.value.value, data.value.index);
            } else if (data.id === 'viewTask') {
                this.taskType = 'VIEW';
                this.isReadOnlyFlag = true;
                this.writeValue(data.value);
                this.setStatus();
                this.changeRef.markForCheck();
            }
        });
    }
    writeValue(obj: any): void {
        this.taskInfo = obj;
        if (this.taskType === 'NEW') {
            this.taskInfo = JSON.parse(JSON.stringify(this.newTask));
        } else if (this.taskType === 'EDIT') {
            this.taskInfo = JSON.parse(JSON.stringify(this.taskInfo));
        }else if (this.taskType === 'VIEW') {
            this.taskInfo = JSON.parse(JSON.stringify(this.taskInfo));
        }
        // this.changeRef.detectChanges();
    }
    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
        this.activeDayIsOpen = false;
        this.eventHandler.setEvent('change', action, event);
        this.refresh.next();
    }
    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void { }
    setDisabledState?(isDisabled: boolean): void {
    }
    addUploadDocument() {
        this.taskInfo.attachments.push(this.getNewAttachment());
        this.config.setLoadingSub('yes');
        this.changeRef.markForCheck();
        this.config.setLoadingSub('no');
    }

    addNotes() {
        this.taskInfo.notes.push(this.getNewNotes());
        this.config.setLoadingSub('yes');
        this.changeRef.markForCheck();
        this.config.setLoadingSub('no');
    }

    deleteuploadDocument(index) {
        this.config.setLoadingSub('yes');
        if (index !== -1) {
            this.taskInfo.attachments.splice(index, 1);
        }
        this.changeRef.markForCheck();
        this.config.setLoadingSub('no');
    }

    deleteNotes(index) {
        this.config.setLoadingSub('yes');
        if (index !== -1) {
            this.taskInfo.notes.splice(index, 1);
        }
        this.changeRef.markForCheck();
        this.config.setLoadingSub('no');
    }

    getMimeTypedata(file, index) {
        if (file['files'] && file['files'].length > 0) {
            this.uploadedFileList.push(file['files'][0]);
            let files: File = <File>file['files'][0];
            this.fileSize = files.size;
            this.config.setLoadingSub('yes');

            let temp = this.taskInfo.attachments;
            let attachGrp = temp[index-1];
            if (parseInt(this.fileSize) < parseInt((this.config.get('fileSize')))) {
                try {
                    let fr = new FileReader();
                    fr.readAsBinaryString(files);
                    fr.onload = function () {
                        attachGrp.mimeType = files.type.toString();
                        attachGrp.fileName = files.name.toString();
                        attachGrp.seq = index;
                        attachGrp.documentContent = btoa(fr.result.toString());
                    };
                } catch (e) {
                    this.logger.info(e, 'Error in Upload');
                }
            }
            this.changeRef.markForCheck();
            this.config.setLoadingSub('no');
        }
    }
    convertToEvent(task) {
        let event: CalendarEvent = JSON.parse(JSON.stringify(this.newEvent));
        event.title = task.title;
        // event.start = new Date(format(new Date(task.startDate), 'yyyy-dd-mm') + 'T' + task.startTime + 'Z');
        event.start = this.dateFormatService.parseDate(task.startDate);
        event.end = this.dateFormatService.parseDate(task.endDate);
        event.color = task.color;
        event.actions = this.newEvent.actions;
        let todayString = this.dateFormatService.formatDate(new Date());
        let eventStartDateString = this.dateFormatService.formatDate(event.start);
        let eventEndDateString = this.dateFormatService.formatDate(event.end);
        if (todayString <= eventEndDateString && task.status === 'InProgress') {
            event.color = colors.yellow;
            event.actions = this.ncpCalendarComponent.taskActions;
        } else if (task.status === 'Completed') {
            event.color = colors.green;
            event.actions = this.ncpCalendarComponent.completedTaskActions;
        } else if (todayString > eventEndDateString && task.status !== 'Completed') {
            event.color = colors.red;
            event.actions = this.ncpCalendarComponent.completedTaskActions;
        } else {
            event.color = task.color;
            event.actions = this.ncpCalendarComponent.taskActions;
        }
        event.draggable = true;
        event.meta.taskID = task.taskID;
        for (let i = 0; i < this.ncpCalendarComponent.events.length; i++) {
            if (this.ncpCalendarComponent.events[i].meta === event.meta) {
                this.ncpCalendarComponent.events.splice(i, 1);
            }

        }
        return event;
    }

    addTask() {
        this.ncpCalendarComponent.isTaskFlag = false;
        this.ncpCalendarComponent.isEventFlag = true;
        let createTaskResponse = this.taskService.createTask(this.taskInfo);
        createTaskResponse.subscribe(
            (taskData) => {
                if (taskData.error !== null && taskData.error !== undefined && taskData.error.length >= 1) {
                    this.config.setLoadingSub('no');
                } else {
                    this.config.setLoadingSub('no');
                    this.taskInfo.taskID = taskData.taskID;
                    this.eventHandler.setEvent('change', this.changeId, this.convertToEvent(this.taskInfo));
                    this.taskInfo = JSON.parse(JSON.stringify(this.newTask));
                }
            });
    }
    updateTask() {
        let updateTaskResponse = this.taskService.updateTask(this.taskInfo);
        updateTaskResponse.subscribe(
            (taskData) => {
                if (taskData.error !== null && taskData.error !== undefined && taskData.error.length >= 1) {
                    this.config.setLoadingSub('no');
                    this.taskInfo = JSON.parse(JSON.stringify(this.newTask));
                } else {
                    this.config.setLoadingSub('no');
                    this.taskInfo.taskID = taskData.taskID;
                    this.eventHandler.setEvent('change', this.changeId, this.convertToEvent(this.taskInfo));
                    this.taskInfo = JSON.parse(JSON.stringify(this.newTask));
                    this.ncpCalendarComponent.isTaskFlag = false;
                    this.ncpCalendarComponent.isEventFlag = true;
                }
            });
            this.ncpCalendarComponent.viewEditEventModal.close();
    }
    addEventModalclose() {
        if (this.taskType === 'EDIT') {
            this.ncpCalendarComponent.isTaskFlag = false;
            this.ncpCalendarComponent.viewEditEventModal.close();
            this.ncpCalendarComponent.isEventFlag = true;
            this.ncpCalendarComponent.addEventModal.close();

        } if (this.taskType === 'VIEW') {
            this.ncpCalendarComponent.isTaskFlag = false;
            this.ncpCalendarComponent.viewEditEventModal.close();
            this.ncpCalendarComponent.isEventFlag = true;
            this.ncpCalendarComponent.addEventModal.close();

        }else {
            this.ncpCalendarComponent.isTaskFlag = false;
            this.ncpCalendarComponent.addEventModal.close();
            this.ncpCalendarComponent.isEventFlag = true;
        }
    }
    doEnableAddUpdateButton() {
        if (this.taskInfo.responsiblePerson && this.taskInfo.startDate && this.taskInfo.endDate  && this.taskInfo.title) {
            this.isdisable = false;
        }
        else {
            this.isdisable = true;
        }
    }
    setStatus() {
        let todayString = this.dateFormatService.formatDate(new Date());
        let eventStartDateString = this.taskInfo.startDate;
        let eventEndDateString = this.taskInfo.endDate;
        if (todayString > eventEndDateString && this.taskInfo.status !== 'Completed') {
            this.taskInfo.status = "Overdue";
        }
    }
    getNewAttachment(){
        return {
            fileName: '',
            documentContent: '',
            seq: '',
        };
    }
    getNewNotes() {
        return {
            comments: '',
            actionPoint: '',
            meetingStatus: '',
        };
    }
}

