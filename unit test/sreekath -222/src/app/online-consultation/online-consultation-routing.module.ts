import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideosessionLandingPage } from './videosession-landing/videosession-landing.page';
import { VideosessionPage } from './videosession/videosession.page';
const routes: Routes = [
  {
    path: '',
    redirectTo:'startvideo'
  },
  {
    path: 'startvideo',
    component: VideosessionLandingPage
  },
  {
    path: 'videosession',
    component: VideosessionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineConsultationPageRoutingModule {}
