import { Component, inject, signal, effect } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HomePageService } from './HomePage.service';
import { LinksComponent } from '../../components/Links/Links.component';
import { InstrumentViewer } from '../../components/InstrumentViewer/InstrumentViewer';
import { Link } from '../../Models/HomePage/HomePage.model';

@Component({
  selector: 'home-page',
  imports: [RouterOutlet, LinksComponent],
  templateUrl: './HomePage.html'
})
export class HomePage {
    private router = inject(Router);
    homePageService = inject(HomePageService);
    protected readonly title = signal('This is the Home Page');
    links = signal(this.homePageService.initLinks());

    constructor() {
        effect(() => {
            console.log("Links: ", this.links());
        });
    }

    onLinkSelected($link: Link) {
        console.log("HomePage - Link selected: ", $link);
        this.router.navigate([$link.path]);
    }



}
