import { Component } from '@angular/core';

@Component({
    selector: 'app-contact-info',
    standalone: true,
    templateUrl: './contact-info.component.html',
    styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent {
    contactInfo = {
        company: 'Qode-Technologies',
        email: 'contact@dhahri.com',
        phone: '+216 56 028 064',
        address: '6000 Avenue Mohamed Ali, Gabès, Tunis'
    };
}
