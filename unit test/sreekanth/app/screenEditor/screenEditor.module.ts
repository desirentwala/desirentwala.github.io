import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { JSONEditorModule } from 'ngx-jsoneditor';

import { CoreModule } from '../core';
import { NCPFormModule } from '../core/ncp-forms/ncp.forms.module';
import { SharedModule } from '../core/shared/shared.module';
import { BannerModule, BreadcrumbModule, MenubarModule, NavbarModule, UserProfileModule } from '../modules/common';
import { B2B2CHeaderModule } from '../modules/common/b2b2c/header/header';
import { NavbarModuleB2C } from '../modules/common/b2c/navbar/navbar';
import { FooterModule } from '../modules/common/footer';
import { EditorComponent } from './editor/editor.component';
import { EditorService } from './service/screenEditor.service';
import { ScreenStarterComponent } from './starter/starter.component';

const routes: Routes = [
    { path: 'starter', component: ScreenStarterComponent },
    { path: 'editor', component: EditorComponent },
    { path: '', component: ScreenStarterComponent },
    { path: '**', component: ScreenStarterComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ScreenEditorRoutingModule { }


@NgModule({
    imports: [CoreModule, ScreenEditorRoutingModule, NgxDnDModule, NCPFormModule, JSONEditorModule,  UserProfileModule, SharedModule, NavbarModule, MenubarModule, FooterModule, BreadcrumbModule, BannerModule,
        NavbarModuleB2C, B2B2CHeaderModule],
    exports: [ScreenStarterComponent, EditorComponent],
    declarations: [ScreenStarterComponent, EditorComponent],
    providers: [EditorService],
})
export class ScreenEditorModule { }


