import { NgModule } from '@angular/core';
import { NewsDisplayComponent } from './news-display/news-display.component';
import { NewsEditComponent } from './news-edit/news-edit.component';
import { NewsViewComponent } from './news-view/news-view.component';
import { NewsCreationComponent } from './news-creation/news-creation.component';
import { NewsManagementComponent } from './news-management/news-management.component';
import { NewsAnnouncementComponent } from './news-announcement.component';
import { Routes, RouterModule } from '@angular/router'; 

const routes: Routes = [
{ path: '', component: NewsManagementComponent},
{ path: 'newsCreation', component: NewsCreationComponent},
{ path: 'newsManagement', component: NewsManagementComponent},
{ path: 'newsView', component: NewsViewComponent},
{ path: 'newsEdit', component: NewsEditComponent},
{ path: 'viewAllNews', component: NewsDisplayComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsRoutingModule { }

