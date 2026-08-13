import { Component } from '@angular/core';
import { FpKeyFeaturesComponent } from '../common/fp-key-features/fp-key-features.component';
import { FpWidgetsComponent } from '../common/fp-widgets/fp-widgets.component';
import { FpTestimonialsComponent } from '../common/fp-testimonials/fp-testimonials.component';
import { FpTeamComponent } from '../common/fp-team/fp-team.component';
import { FpFaqComponent } from '../common/fp-faq/fp-faq.component';
import { FpContactComponent } from '../common/fp-contact/fp-contact.component';
import { FpCtaComponent } from '../common/fp-cta/fp-cta.component';
import { FpBannerComponent } from '../common/fp-banner/fp-banner.component';
import { FpProjectsComponent } from '../common/fp-projects/fp-projects.component';
import { FpAboutUsComponent } from '../common/fp-about-us/fp-about-us.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [FpBannerComponent, FpKeyFeaturesComponent, FpWidgetsComponent, FpTestimonialsComponent, FpTeamComponent, FpFaqComponent, FpContactComponent, FpCtaComponent,FpProjectsComponent, FpAboutUsComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {}