import { DateFormatService } from './../ncp-date-picker/services/ncp-date-picker.date.format.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { endOfDay, isSameDay, isSameMonth, startOfDay } from 'date-fns';
import { Observable ,  Subject } from '@adapters/packageAdapter';

import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { Logger } from '../logger/logger';
import { TaskItem } from './utils/task-utils';
import { TaskService } from './utils/task.services';
import { EventItem, Notes } from './utils/calendar-utils';

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

interface NotificationsMeta {
    id: number;
    type: string;
    allowedUsers: string[];
}
@Component({
    selector: 'ncp-calendar',
    templateUrl: 'ncp-calendar.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NCPCalendarComponent implements OnInit {

    @ViewChild('modalContent') modalContent;
    @ViewChild('addEventModal') addEventModal;
    @ViewChild('viewEditEventModal') viewEditEventModal;
    @ViewChild('notesModal') notesModal;
    @ViewChild('viewTasksModal') viewTasksModal;
    @ViewChild('viewEventsModal') viewEventsModal;
    @Input() user_technical: any;
    enableViewButtonFlag: boolean = true;
    view: string = 'month';
    public taskInfo: TaskItem;
    public eventInfo = [];
    public taskInfoList: any;
    taskNotificationFlag: boolean = false;
    taskType: any = 'NEW';
    changeSub: any = '';
    viewDate: Date = new Date();
    locale: String = '';
    events$: Observable<Array<CalendarEvent>>;
    modalData: {
        action: string;
        event: CalendarEvent;
    };
    editableEvent: CalendarEvent<any>[] = [];
    loading;
    isTaskFlag: boolean = false;
    isEventFlag: boolean = true;
    existingTaskList: any = [];
    fullExistingTaskList: any = [];
    limitedExistingTaskList: any = [];
    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.editableEvent = this.events.filter(iEvent => iEvent === event);
                this.viewEditEventModal.open();
                this.handleEvent('Edited', event);
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                this.handleEvent('Deleted', event);
            }
        }
    ];
    taskActions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.editableEvent = this.events.filter(iEvent => iEvent === event);
                //    this.viewEditEventModal.open();
                this.handleTask('Edited', event);
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                this.handleTask('Deleted', event);
            }
        }
    ];
    completedTaskActions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-eye"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.editableEvent = this.events.filter(iEvent => iEvent === event);
                this.handleTask('View', event);
            }
        }
    ];
    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [];
    activeDayIsOpen: boolean = false;
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
    tableDetails = ['NCPLabel.title', 'NCPLabel.primarycolor', 'NCPLabel.startsat', 'NCPLabel.endsat'];
    showAllTableDetails = ['NCPLabel.title', 'NCPLabel.details', 'NCPLabel.primarycolor', 'NCPLabel.startsat', 'NCPLabel.endsat', 'NCPLabel.remove'];
    editTableDetails = ['NCPLabel.title', 'NCPLabel.primaryColor', 'NCPLabel.startsat', 'NCPLabel.endsat'];
    showAllEvents: boolean = false;
    existingEventList: any = [];
    newNotes: Notes = {
        comments: '',
        actionPoint: '',
        meetingStatus: ''
    };
    newTask: EventItem = {
        notes: [JSON.parse(JSON.stringify(this.newNotes))]
    }
    constructor(public config: ConfigService, public changeRef: ChangeDetectorRef,
        public logger: Logger, public eventHandler: EventService,
        public taskService: TaskService, public dateFormatService: DateFormatService
    ) {
        this.config.taskNotificationFlag.subscribe((data: any) => {
            this.taskNotificationFlag = data;
            if (this.taskNotificationFlag) {
                this.viewTasksModalOpen();
            }
        });
        this.taskInfo = JSON.parse(JSON.stringify(this.newTask));
    }
    ngOnInit() {
          let userLang = this.config.getCustom('user_lang');
          this.locale = userLang;
        let input = { 'taskID': '' };
        this.changeSub = this.eventHandler.changeSub.subscribe((data) => {
            if (data.id === 'taskInfo') {
                this.events.push(data.value);
                this.refresh.next();
                this.addEventModal.close();
                this.clearNewEvent();
            } else if (data.id === 'Edited') {
                this.isTaskFlag = true;
                this.editableEvent = [data.value];
                input.taskID = data.value.meta.taskID;
                let todayString = this.dateFormatService.formatDate(new Date());
                let endDateString = this.dateFormatService.formatDate(data.value.end)
                if (endDateString >= todayString) {
                    this.editableEvent = [data.value];
                    input.taskID = data.value.meta.taskID;
                    this.taskType = 'EDIT';
                    this.viewEditEventModal.open();
                    let retriveTaskResponse = this.taskService.retrieveTask(input);
                    retriveTaskResponse.subscribe(
                        (taskData) => {
                            if (taskData.error !== null && taskData.error !== undefined && taskData.error.length >= 1) {
                                this.config.setLoadingSub('no');
                            } else {
                                this.taskInfoList = taskData;
                                this.config.setLoadingSub('no');
                                this.eventHandler.setEvent('change', 'editTask', this.taskInfoList[0]);
                                if (this.taskInfoList[0].hasOwnProperty("taskType") && this.taskInfoList[0].taskType === 'TASK') {
                                    this.isTaskFlag = true;
                                    this.isEventFlag = false;
                                }
                                else {
                                    this.isEventFlag = true;
                                    this.isTaskFlag = false;
                                }
                            }
                        });
                }

            } else if (data.id === 'Deleted') {
                input.taskID = data.value.meta.taskID;
                this.deleteTask(input);
                this.refresh.next();
            } else if (data.id === 'View') {
                this.isTaskFlag = true;
                this.editableEvent = data.value;
                input.taskID = data.value.meta.taskID;
                this.taskType = 'EDIT';
                this.viewEditEventModal.open();
                let retriveTaskResponse = this.taskService.retrieveTask(input);
                retriveTaskResponse.subscribe(
                    (taskData) => {
                        if (taskData.error !== null && taskData.error !== undefined && taskData.error.length >= 1) {
                            this.config.setLoadingSub('no');
                        } else {
                            this.taskInfoList = taskData;
                            this.config.setLoadingSub('no');
                            this.eventHandler.setEvent('change', 'viewTask', this.taskInfoList[0]);
                            if (this.taskInfoList[0].hasOwnProperty("taskType") && this.taskInfoList[0].taskType === 'TASK') {
                                this.isTaskFlag = true;
                                this.isEventFlag = false;
                            }
                            else {
                                this.isEventFlag = true;
                                this.isTaskFlag = false;
                            }
                        }
                    });
            }

        });
        this.getTaskDetails(input);

        let getTaskListResponse = this.taskService.getTaskList(input);
        getTaskListResponse.subscribe(
            (taskData) => {
                if (taskData.error !== null && taskData.error !== undefined && taskData.error.length >= 1) {
                    this.config.setLoadingSub('no');
                } else {
                    if (taskData) {
                        this.existingTaskList = taskData;
                        for (let i = 0; i < this.existingTaskList.length; i++) {
                            this.existingTaskList[i].details = JSON.parse(this.existingTaskList[i].details);
                        }
                        this.fullExistingTaskList = this.existingTaskList;
                        for (let i = 0; i < 5; i++) {
                            this.limitedExistingTaskList[i] = this.existingTaskList[i];
                        }
                        this.existingTaskList = this.limitedExistingTaskList;
                        this.config.setLoadingSub('no');
                    } else {
                        this.config.setLoadingSub('no');
                    }
                }
            });
    }
    getTaskDetails(inputData) {
        let retriveTaskResponse = this.taskService.retrieveTask(inputData);
        retriveTaskResponse.subscribe(
            (taskData) => {
                if (taskData.error !== null && taskData.error !== undefined && taskData.error.length >= 1) {
                    this.config.setLoadingSub('no');
                } else {
                    this.taskInfoList = taskData;
                    if (this.taskType !== 'EDIT') {
                        this.convertTaskToEvent(this.taskInfoList);
                    }
                    this.config.setLoadingSub('no');
                }
            });
    }
    deleteTask(inputData) {
        let deleteTaskResponse = this.taskService.deleteTask(inputData);
        deleteTaskResponse.subscribe(
            (taskData) => {
                if (taskData.error !== null && taskData.error !== undefined && taskData.error.length >= 1) {
                    this.config.setLoadingSub('no');
                } else {
                    this.refresh.next();
                    this.config.setLoadingSub('no');
                }
            });
    }
    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    eventTimesChanged({
        event,
        newStart,
        newEnd
    }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    }
    openTaskDetail() {
        this.isTaskFlag = true;
        this.isEventFlag = false;
        //  this.ngOnInit();
    }
    openEventDetail() {
        this.isTaskFlag = false;
        this.isEventFlag = true;
    }
    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
        this.activeDayIsOpen = false;
    }
    handleTask(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
        this.activeDayIsOpen = false;
        this.eventHandler.setEvent('change', action, event);
    }
    convertTaskToEvent(taskList) {
        for (let i in taskList) {
            let tempEvent: CalendarEvent = JSON.parse(JSON.stringify(this.newEvent));
            tempEvent = this.convertToEvent(taskList[i]);
            this.events.push(tempEvent);
            this.refresh.next();
        }
        this.changeRef.markForCheck();
    }
    addEvent() {
        if (this.isTaskFlag) {
            this.events.push(this.convertToEvent(this.taskInfo));
        }
        else {
            let event = JSON.parse(JSON.stringify(this.newEvent))
            event.start = this.dateFormatService.formatDate(this.newEvent.start);
            event.end = this.dateFormatService.formatDate(this.newEvent.end);

            this.events.push(this.newEvent);
            this.isTaskFlag = false;
            this.isEventFlag = true;
            this.eventInfo.push(event);
            this.eventInfo.push(this.taskInfo.notes);
            event.notes = this.taskInfo.notes;

            let createEventResponse = this.taskService.createTask(event);
            createEventResponse.subscribe(
                (eventData) => {
                    this.config.setLoadingSub('no');
                });
            this.refresh.next();
            this.addEventModal.close();
            this.clearNewEvent();
        }
    }
    convertToEvent(task) {
        let event: CalendarEvent = JSON.parse(JSON.stringify(this.newEvent));
        event.title = task.title;
        if (task.hasOwnProperty("taskType")) {
            event.start = this.dateFormatService.parseDate(task.startDate);
            event.end = this.dateFormatService.parseDate(task.endDate);
            let todayString = this.dateFormatService.formatDate(new Date());
            let eventStartDateString = this.dateFormatService.formatDate(event.start);
            let eventEndDateString = this.dateFormatService.formatDate(event.end);
            if (todayString <= eventEndDateString && task.status === 'InProgress') {
                event.color = colors.yellow;
                event.actions = this.taskActions;
            } else if (task.status === 'Completed') {
                event.color = colors.green;
                event.actions = this.completedTaskActions;
            } else if (todayString > eventEndDateString && task.status !== 'Completed') {
                event.color = colors.red;
                task.status = "Overdue";
                event.actions = this.completedTaskActions;
            } else {
                event.color = task.color;
                event.actions = this.taskActions;
            }
            event.meta.taskID = task.taskID;
        }
        else {
            event.start = this.dateFormatService.parseDate(task.start)
            event.end = this.dateFormatService.parseDate(task.end)
            event.meta.taskType = task.meta.taskType;
            event.meta.taskID = task.meta.taskID;
            event.actions = this.taskActions;
            event.color = task.color;
        }
        event.draggable = true;

        return event;
    }
    openAddEventModal(date: Date): void {
        this.newEvent.title = null;
        this.newEvent.start = startOfDay(date);
        this.newEvent.end = endOfDay(date);
        this.newEvent.color = JSON.parse(JSON.stringify(colors)).red;
        this.newEvent.meta.taskType = "EVENT";
        this.newEvent.actions = this.actions;
        this.addEventModal.open();
    }
    doSetTechnicalUsersArray() {
        for (let u in this.user_technical) this.newEvent.meta.user_technical[this.user_technical[u].code] = false;
    }
    clearNewEvent() {
        this.newEvent = {
            title: null,
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
        }
    }
    addEventModalclose() {
        this.addEventModal.close();
    }
    viewTasksModalOpen() {
        let input = { 'taskID': '' };
        this.config.setLoadingSub('yes');
        this.viewTasksModal.open();
        let getTaskListResponse = this.taskService.getTaskList(input);
        getTaskListResponse.subscribe(
            (taskData) => {
                if (taskData.error !== null && taskData.error !== undefined && taskData.error.length >= 1) {
                    this.config.setLoadingSub('no');
                } else {
                    if (taskData) {
                        this.existingTaskList = taskData;
                        for (let i = 0; i < this.existingTaskList.length; i++) {
                            this.existingTaskList[i].details = JSON.parse(this.existingTaskList[i].details);
                        }
                        this.fullExistingTaskList = this.existingTaskList;
                        for (let i = 0; i < 5; i++) {
                            this.limitedExistingTaskList[i] = this.existingTaskList[i];
                        }
                        this.setStatus();
                        this.existingTaskList = this.limitedExistingTaskList;
                        this.changeRef.markForCheck()
                        this.config.setLoadingSub('no');
                    } else {
                    }
                }
            });
    }

    viewEventsModalOpen() {
        let input = { 'taskID': '' };
        this.config.setLoadingSub('yes');
        this.viewEventsModal.open();
        let getTaskListResponse = this.taskService.retrieveTask(input);
        getTaskListResponse.subscribe(
            (taskData) => {
                if (taskData.error !== null && taskData.error !== undefined && taskData.error.length >= 1) {
                    this.config.setLoadingSub('no');
                } else {
                    this.existingEventList = [];
                    if (taskData) {
                        for (let i = 0; i < taskData.length; i++) {
                            if (taskData[i].meta) {
                                this.existingEventList.push(taskData[i]);
                            }
                        }
                        this.changeRef.markForCheck();
                        this.config.setLoadingSub('no');
                    } else {
                    }
                }
            });
    }

    ViewEventModal() {
        this.config.setLoadingSub('yes');
        this.addEventModal.open();
        this.config.setLoadingSub('no');
    }
    openReferenceTaskWindow(taskId) {
        let input = { 'taskID': '' };
        this.taskType = 'EDIT';
        this.viewTasksModal.close();
        this.viewEditEventModal.open();
        this.isTaskFlag = true;
        this.isEventFlag = false;
        input.taskID = taskId;
        let retriveTaskResponse = this.taskService.retrieveTask(input);
        retriveTaskResponse.subscribe(
            (taskData) => {
                if (taskData.error !== null && taskData.error !== undefined && taskData.error.length >= 1) {
                    this.config.setLoadingSub('no');
                } else {
                    this.taskInfoList = taskData;
                    this.config.setLoadingSub('no');
                    this.eventHandler.setEvent('change', 'viewTask', this.taskInfoList[0]);
                }
            });
    }

    openReferenceEventWindow(taskId) {
        let input = { 'taskID': '' };
        this.taskType = 'EDIT';
        this.viewEventsModal.close();
        this.viewEditEventModal.open();
        this.isTaskFlag = false;
        this.isEventFlag = true;
        input.taskID = taskId;
        let retriveTaskResponse = this.taskService.retrieveTask(input);
        retriveTaskResponse.subscribe(
            (taskData) => {
                if (taskData.error !== null && taskData.error !== undefined && taskData.error.length >= 1) {
                    this.config.setLoadingSub('no');
                } else {
                    this.taskInfoList = taskData;
                    this.config.setLoadingSub('no');
                    this.eventHandler.setEvent('change', 'viewTask', this.taskInfoList[0]);
                }
            });
    }

    showMoreRecords() {
        this.viewTasksModal.close();
        this.existingTaskList = this.fullExistingTaskList;
        this.viewTasksModal.open();
    }
    setStatus() {
        let todayString = this.dateFormatService.formatDate(new Date());
        for (let i = 0; i < this.existingTaskList.length; i++) {
            let eventStartDateString = this.existingTaskList[i].startDate;
            let eventEndDateString = this.existingTaskList[i].endDate;
            if (todayString > eventEndDateString && this.existingTaskList[i].details.status !== 'Completed') {
                this.existingTaskList[i].details.status = "Overdue";
            }
        }
    }
    updateEvent() {
        let event = JSON.parse(JSON.stringify(this.editableEvent[0]))
        event.start = this.dateFormatService.formatDate(this.editableEvent[0].start);
        event.end = this.dateFormatService.formatDate(this.editableEvent[0].end);
        let updateEventResponse = this.taskService.updateTask(event);
        updateEventResponse.subscribe(
            (eventData) => {
                if (eventData.error !== null && eventData.error !== undefined && eventData.error.length >= 1) {
                    this.config.setLoadingSub('no');
                } else {
                    this.config.setLoadingSub('no');
                    this.isTaskFlag = false;
                    this.viewEditEventModal.close();
                    this.isEventFlag = true;
                }
            });
    }

    deleteNotes(index) {
        this.config.setLoadingSub('yes');
        if (index !== -1) {
            this.taskInfo.notes.splice(index, 1);
        }
        this.changeRef.markForCheck();
        this.config.setLoadingSub('no');
    }

    addNotes() {
        this.taskInfo.notes.push(this.getNewNotes());
        this.config.setLoadingSub('yes');
        this.changeRef.markForCheck();
        this.config.setLoadingSub('no');
    }

    getNewNotes() {
        return {
            comments: '',
            actionPoint: '',
            meetingStatus: '',
        };
    }


}
