import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, NgModule, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ConfigService } from './../../../core/services/config.service';

@Component({
    selector: 'chatbot',
    templateUrl: './chatbot.html',
    styles: [`.chatTooltip{
        position: fixed;
        bottom: 0;
        font-size: 25px;
        background: #6685c1;
        color: white;
        opacity: 0.9;
        right: 10px;
        border-radius: 3px;
        padding: 10px 15px;
        z-index:150;
        cursor: pointer;
    }`,
        `.chatWindow{
        position:fixed;
        bottom:0;
        right:0;
        z-index:150;
    }`,
        `.chatTooltipSpanFs{font-size:18px;}`,
        `.chatWindowClose{
    position: absolute;
    right: 2px;
    top: 2px;
    font-size: 20px;
    border: 1px solid white;
    border-radius: 3px;
}`]
})
export class ChatBot implements OnInit, AfterContentInit {

    enableChatWindow = false;
    src;
    public toggleChatWindow: boolean;

    constructor(private sanitizer: DomSanitizer, public configService: ConfigService) {
        this.src = this.sanitizer.bypassSecurityTrustResourceUrl('https://console.dialogflow.com/api-client/demo/embedded/62f78c03-53f1-4c18-b4c8-85189243edf3');
    }

    ngAfterContentInit(): void {
    }

    ngOnInit(): void {
        this.toggleChatWindow = false;
        if (this.configService._config['enableChatWindow']) {
            this.enableChatWindow = this.configService._config['enableChatWindow'];
        }
    }

}

@NgModule({
    declarations: [ChatBot],
    imports: [CommonModule],
    exports: [ChatBot]
})
export class ChatBotModule { }