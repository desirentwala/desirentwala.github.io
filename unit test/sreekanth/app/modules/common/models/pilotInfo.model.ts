import { FormBuilder } from '@angular/forms';
import { DefaultPolicyModel } from '../services/defaultModel.service';

export class PilotInfo {
    _pilotInfoForm: FormBuilder;
    _uasOperatingInfo;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._pilotInfoForm = this.quoteModelInstance._formBuilderInstance;
        let uasOperatingInfo = quoteModelInstance.getUasOperatingInfoModel();
        this._uasOperatingInfo = uasOperatingInfo;
    }
    getPilotInfo() {
        return this._pilotInfoForm.group({
            appID: [' '],
            appFullName: [''],
            agricultureImg: [''],
            agricultureSpraying: [''],
            dtTransfer: [''],
            newsGather: [''],
            fishSpotting: [''],
            inspection: [''],
            lawEnforce: [''],
            powerLine: [''],
            movieMaking: [''],
            surveyLance: [''],
            weddingPhoto: [''],
            other: [''],
            firstName: [''],
            lastName: [''],
            addrLine1: [''],
            addrLine2: [''],
            cityCd: [''],
            cityDesc: [''],
            stateCd: [''],
            stateDesc: [''],
            zip: [''],
            email: [''],
            cityAd: [''],
            stateAd: [''],
            isPilotCertified: [''],
            certificationNo: [''],
            certificationTypeCode: [''],
            certificationTypeDesc: [''],
            pilotFName: [''],
            pilotLName: [''],
            key: [''],
            pilotName: [''],
            pilotAge: [''],
            airmanCertificate: [''],
            totalHoursFlown: [''],
            permits: [''],
            unmannedHours: [''],
            flightsin12: [''],
            totalNo: [''],
            onlineUAS: [''],
            inpersonUAS: [''],
            aircraftIncident: [''],
            aircraftIncidentex: [''],
            federalAviation: [''],
            federalAviationex: [''],
            automobiledriver: [''],
            automobiledriverex: [''],
            influenceofAlcohal: [''],
            influenceofAlcohalex: [''],
            fileName: [''],
            mimeType: [''],
            documentContent: [''],
            insuranceInspection:[''],
            aircraftPilotPermit:[''],
            transportUAS:[''],
            student:[''],
            recreational:[''],
            private:[''],
            commercialpilot:[''],
            airlineTrans:[''],
            flightInstr:[''],
            uasOperatingInfo: this._pilotInfoForm.array([
                this._uasOperatingInfo.getUasOperatingInfoModel()
            ]),
            recurrentInfo: this._pilotInfoForm.array([
                this.getInitialRecurrent()
            ]),
            operatingInfo: this._pilotInfoForm.array([
                this.addOperatingExperience()
            ]),
            addPilotInfo: this._pilotInfoForm.array([
                this.getPilotInfoModal()
            ])
        });
    }
    getInitialRecurrent() {
        return this._pilotInfoForm.group({
            namefacility: [''],
            modelOperated: [''],
            dateattended: [''],
            edited: [''],
            deleted: ['']
        });
    }

    addOperatingExperience() {
        return this._pilotInfoForm.group({
            makemodel: [''],
            totalhrs: [''],
            totalFlight: [''],
            edited: [''],
            deleted: ['']
        });
    }

    getPilotInfoModal() {
        return this._pilotInfoForm.group({
            name: [''],
            remotePilotCertificateNumber: ['']
        });
    }
}
