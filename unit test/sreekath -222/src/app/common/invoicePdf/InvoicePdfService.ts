import { Injectable } from '@angular/core';
import { logo } from './logo';
import { InvoiceService } from './invoice.service';
import { DateConvertorService } from '../services/date-convertor.service';
declare let jsPDF;
//import * as jsPDF from 'jspdf'
import * as moment from 'moment';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class InvoicePdfService {
    isMobile: boolean;
    loading: any;
    isIos: boolean;
    public jsPDF : any;
    constructor(
        private invoiceService: InvoiceService,
        private dateConvertorService: DateConvertorService,
        private file: File,
        private fileOpener: FileOpener,
        public loadingCtrl: LoadingController,
    ) {
        if (navigator.userAgent.match(/Android/i)
            // || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ) {
            if (navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
                this.isIos = true;
            }
            this.isMobile = true;
        } else {
            this.isMobile = false;
        }
    }
     public destroy(): void { }

    async presentLoading(msg) {
        this.loading = await this.loadingCtrl.create({
            message: msg
        });
        return await this.loading.present();
    }
    /**
     * service call to get appointment and booking details
     * @param bookingId booking id based on user selection
     */
    generateInvPDF(bookingId) {
        this.invoiceService.getAppointmentDetails(bookingId).subscribe((res) => {
            const appointmentSlot = this.dateConvertorService.slotConvertion(res.slot.startsAt, res.slot.duration);
            const pet = res.appointments.pop().pet;
            const bookings = {
                practiceName: res.slot.practice.practiceName,
                address1: res.slot.practice.address1,
                address2: res.slot.practice.address2,
                postCode: res.slot.practice.postCode,
                city: res.slot.practice.country,
                invoice: 'VHDA' + (res.id).toString(),
                vatNo: '123 456 789',
                vat: '2.00',
                bookingRef: (res.id).toString(),
                bookingDate: moment(res.updatedOn ? res.updatedOn : res.createdOn).format('ll'),
                petName: pet.petName,
                species: pet.species.speciesName,
                petOwnerName: pet.user.firstName,
                phone: pet.user.mobile,
                email: pet.user.email,
                day: appointmentSlot.date.day,
                slot: appointmentSlot.start + ' - ' + appointmentSlot.end,
                appointmentDate: moment(res.slot.startsAt).format('ll'),
                vetName: res.slot.user.firstName,
                bill: `${(res.practiceAppointmentType.customerFee).toString()}.00`,
                total: `${(res.practiceAppointmentType.customerFee).toString()}.00`
            };
            this.generateJsPDF(bookings);

        });
    }

    public generateJsPDF(invObj: any): void {
        // create the pdf in a4 size
            var doc = new jsPDF('p', 'pt', 'a4');

        // set the default initial values for pdfUtiles
        const pdfUtilities = {
            fontSizes: {
                HeadTitleFontSize: 30,
                HeadTitle2FontSize: 20,
                TitleFontSize: 16,
                SubTitleFontSize: 14,
                NormalFontSize: 12,
            },
            line: {
                normalSpacing: 12,
                lineHeights: 27,
                lineSpacing: 15,
                lineSpacing2: 50,
                lineNormalSpacing: 0,
                lineSmallSpacing: 2
            },
            rightStart: {
                col1: 550,
                col2: 450,
                col3: 420,
                col4: 430
            },
            X: {
                initialStart: 40,
                startX: 380,
                startX1: 470,
                startX2: 420
            },
            Y: {
                initialStart: 80,
            },
            image: {
                x: 30,
                y: 80,
                w: 150,
                h: 50
            }
        };
        // let height = 0.0;
        let tempY = pdfUtilities.Y.initialStart;

        const petData = `${invObj.petName}  (${invObj.species})`;
        const postcode = `${invObj.city} ${invObj.postCode}`;
        const appointmentDayAndSlot = `${invObj.day}, ${invObj.slot}`;
        const appointmentData = `Appointment with ${invObj.vetName}`;
        const billingAmount = `£ ${invObj.bill}`;
        const totalAmount = `£ ${invObj.total}`;
        // adding logo image
        doc.addImage(logo, 'png', pdfUtilities.image.x, pdfUtilities.image.y,
            pdfUtilities.image.w, pdfUtilities.image.h);
        doc.setFont('ProximaNova');
        doc.setFontSize(pdfUtilities.fontSizes.NormalFontSize);
        doc.setFontType('normal');
        doc.textAlign('7 Kings Road, Portsmouth,', { align: 'left' }, pdfUtilities.X.initialStart, tempY + pdfUtilities.image.x + 35);
        doc.textAlign('Southsea, PO5 4DJ', { align: 'left' }, pdfUtilities.X.initialStart, tempY + pdfUtilities.image.x + 45);


        // adding VHD details
        doc.setFont('ProximaNova');
        doc.setFontSize(pdfUtilities.fontSizes.NormalFontSize);
        doc.setFontType('bold');
        doc.textAlign(invObj.practiceName, { align: 'right' }, pdfUtilities.rightStart.col1, tempY += pdfUtilities.line.lineNormalSpacing);

        doc.setFontType('normal');
        const openstr = invObj.address1;
        const opentemp = openstr.match(/.{1,25}/g);
        opentemp.forEach((tempVal, index) => {
            doc.textAlign(`${tempVal}-`, { align: 'right' }, pdfUtilities.rightStart.col1, tempY += pdfUtilities.line.lineSpacing);
        });
        //   doc.textAlign(`${tempVal}`, { align: 'left' },
        //     pdfUtilities.X.startX - 2, pdfUtilities.Y.startY += pdfUtilities.line.lineSpacing, pdfUtilities.Y.startY + index * 10);
        // doc.textAlign(invObj.address1, { align: 'right' }, pdfUtilities.rightStart.col1, tempY += pdfUtilities.line.lineSpacing);

        if (invObj.address2) {
            const str = invObj.address2;
            const tempStr = str.match(/.{1,25}/g);
            tempStr.forEach((tempVal, index) => {
                doc.textAlign(`${tempVal}-`, { align: 'right' }, pdfUtilities.rightStart.col1, tempY += pdfUtilities.line.lineSpacing);
            });
        }
        doc.textAlign(postcode, { align: 'right' }, pdfUtilities.rightStart.col1, tempY += pdfUtilities.line.lineSpacing);

        // invoice
        doc.setFontSize(pdfUtilities.fontSizes.SubTitleFontSize);
        doc.textAlign('Invoice #', { align: 'right' }, pdfUtilities.rightStart.col4, tempY += pdfUtilities.line.lineSpacing2);
        doc.setFontSize(pdfUtilities.fontSizes.HeadTitle2FontSize);
        doc.textAlign(invObj.invoice, { align: 'right' }, pdfUtilities.rightStart.col1, tempY += pdfUtilities.line.lineSmallSpacing);

        // Booking address and billing details
        doc.setFontSize(pdfUtilities.fontSizes.NormalFontSize);
        doc.textAlign('Billing Address', { align: 'left' }, pdfUtilities.X.initialStart, tempY += pdfUtilities.line.lineSpacing2 + 20);

        doc.setFontSize(pdfUtilities.fontSizes.TitleFontSize);
        doc.setTextColor(68, 166, 198);
        doc.textAlign(petData, { align: 'left' },
            pdfUtilities.X.initialStart, tempY += pdfUtilities.line.lineHeights);

        doc.setTextColor(2, 7, 8);
        doc.setFontSize(pdfUtilities.fontSizes.NormalFontSize);
        doc.textAlign(invObj.petOwnerName, { align: 'left' }, pdfUtilities.X.initialStart, tempY += pdfUtilities.line.lineHeights);
        doc.textAlign('Date:', { align: 'left' }, pdfUtilities.X.startX, tempY);
        doc.textAlign(invObj.bookingDate, { align: 'left' }, pdfUtilities.X.startX1, tempY);
        doc.textAlign(invObj.phone, { align: 'left' }, pdfUtilities.X.initialStart, tempY += pdfUtilities.line.lineSpacing);
        doc.textAlign('Booking Ref:', { align: 'left' }, pdfUtilities.X.startX, tempY);
        doc.textAlign(invObj.bookingRef, { align: 'left' }, pdfUtilities.X.startX1, tempY);
        doc.textAlign(invObj.email, { align: 'left' }, pdfUtilities.X.initialStart, tempY += pdfUtilities.line.lineSpacing);
        // doc.textAlign('Vat No:', { align: 'left' }, pdfUtilities.X.startX, tempY);
        // doc.textAlign(invObj.vatNo, { align: 'left' }, pdfUtilities.X.startX1, tempY);
        doc.setDrawColor(0);
        doc.setFillColor(243, 243, 243);
        doc.rect(0, tempY + 10, 600, 200, 'F');

        // Appointment details
        doc.textAlign('Appointment details', { align: 'left' }, pdfUtilities.X.initialStart, tempY += pdfUtilities.line.lineSpacing2);
        doc.textAlign(invObj.appointmentDate, { align: 'left' }, pdfUtilities.X.initialStart, tempY += pdfUtilities.line.lineHeights);

        doc.setFontType('bold');
        doc.setFontSize(pdfUtilities.fontSizes.TitleFontSize);
        doc.textAlign(appointmentDayAndSlot, { align: 'left' }, pdfUtilities.X.initialStart, tempY += pdfUtilities.line.lineSpacing + 5);

        doc.setFontType('normal');
        doc.setFontSize(pdfUtilities.fontSizes.NormalFontSize);
        doc.textAlign(appointmentData, { align: 'left' }, pdfUtilities.X.initialStart, tempY += pdfUtilities.line.lineSpacing + 6);

        doc.setFontType('bold');
        doc.setFontSize(pdfUtilities.fontSizes.NormalFontSize + 5);
        doc.textAlign(billingAmount, { align: 'right' }, pdfUtilities.rightStart.col1, tempY);

        doc.line(pdfUtilities.X.initialStart, tempY += pdfUtilities.line.lineHeights, 550, tempY);

        // doc.textAlign('VAT', { align: 'right' }, pdfUtilities.rightStart.col2 + 20, tempY += pdfUtilities.line.lineSpacing + 10);
        // doc.textAlign(invObj.vat, { align: 'right' }, pdfUtilities.rightStart.col1, tempY);

        doc.setFontSize(pdfUtilities.fontSizes.NormalFontSize);
        doc.setDrawColor(0);
        doc.setFillColor(218, 218, 218);
        doc.rect(0, tempY += pdfUtilities.line.lineHeights * 2, 600, 100, 'F');

        doc.textAlign('TOTAL ', { align: 'right' }, pdfUtilities.X.startX2, tempY += pdfUtilities.line.lineHeights + 10);

        doc.setFontType('bold');
        doc.setFontSize(pdfUtilities.fontSizes.HeadTitleFontSize);
        doc.textAlign(totalAmount, { align: 'right' }, pdfUtilities.rightStart.col1, tempY + 3);
        const pdfOutput = doc;
        // save or downloading the invoice
        if (this.isMobile) {
            // this.presentLoading('Creating PDF file...');
            const pdfOutput = doc.output('blob');
            // using ArrayBuffer will allow you to put image inside PDF
            const buffer = new ArrayBuffer(pdfOutput.length);
            const array = new Uint8Array(buffer);
            for (let i = 0; i < pdfOutput.length; i++) {
                array[i] = pdfOutput.charCodeAt(i);
            }

            var blob = new Blob([pdfOutput], { type: 'application/pdf' });

            //Determine a native file path to save to
            // let filePath =  this.file.externalRootDirectory;

            // using ArrayBuffer will allow you to put image inside PDF
            let directory;
            if (this.isIos) {
                directory = this.file.documentsDirectory;
            } else {
                directory = this.file.externalApplicationStorageDirectory;
            }
            const fileName = `Invoice${invObj.invoice}.pdf`;
            //Write the file
            this.file.writeFile(directory, fileName, blob, { replace: true }).then((fileEntrys) => {
                //Open with File Opener plugin
                this.fileOpener.open(fileEntrys.toURL(), 'application/pdf')
                    .then(() => console.log('File is opened'))
                    .catch(err => console.error('Error openening file: ' + err));
            })
                .catch((err) => {
                    console.error("Error creating file: " + err);
                    throw err;  //Rethrow - will be caught by caller
                });
        } else {
            doc.save(`Invoice:${invObj.invoice}.pdf`);
        }
    }
}

