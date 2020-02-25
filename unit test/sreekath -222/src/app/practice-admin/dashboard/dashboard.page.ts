import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  title: string;
  vetAppointment = [
    {vet: 'Dr.Annual', noAppointment: '10'},
    {vet: 'Dr.Mery', noAppointment: '6'},
    {vet: 'Dr.Scort', noAppointment: '4'},
    {vet: 'Dr.Swag', noAppointment: '2'},
  ];

  items = [
    {action: 'Refunds', count: '10'},
    {action: 'Appt. updates', count: '8'},
    {action: 'Cancellations', count: '6'},
  ];

  links = [
    {link: 'Schedule an Appointment', path: 'slotscheduling'},
    {link: 'Add a New Customer', path: 'customer'},
    {link: 'Add a New Vet', path: 'vet'},
  ];

  notifications = [
    {event: '5:30pm auto assigned to Dr.Mery', schedule: true},
    {event: '5:30pm auto assigned to Dr.Mery'},
    {event: '5:30pm auto assigned to Dr.Mery'},
    {event: '5:30pm auto assigned to Dr.Mery'},
    {event: '5:30pm auto assigned to Dr.Mery', cancellation: true},
    {event: '5:30pm auto assigned to Dr.Mery', schedule: true},
  ];
  constructor( private router: Router) {
  }

  ngOnInit() {

  }

  quickNavigation(path) {
    if (path === 'vet') {
      this.router.navigate([`/practiceadmin/slotscheduling`], { queryParams: { nav: path } });
    } else {
      this.router.navigate([`/practiceadmin/${path}`]);
    }
  }

}
