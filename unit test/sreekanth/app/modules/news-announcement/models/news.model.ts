import { FormBuilder, FormGroup } from '@angular/forms';


export class NewsModel {
    newsCreationModel;

    constructor(public _newsCreationModel: FormBuilder) {

        this.newsCreationModel = this._newsCreationModel;
    }
    getNewsCreationModel() {
        return this.newsCreationModel.group({
            newsTitle: [''],
            newsType: [''],
            creationDate: [''],
            startDate: [''],
            endDate: [''],
            newsDetails: [''],
            isArticleImpo: [false],
            newsID: [''],
            newsTypeCode:['']
        });
    }
    getNewsListModel() {
        return this._newsCreationModel.group({
            newsID: ['']

        });
    }

    getNewsCheckBoxArray() {
        return this._newsCreationModel.group({
            newsCheckBox: ['']

        });
    }
}
