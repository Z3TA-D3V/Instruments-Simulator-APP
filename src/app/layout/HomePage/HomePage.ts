import { Component, inject, signal, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Link } from '../../Models/HomePage/HomePage.model';
import { HomePageService } from './HomePage.service';
import { LinksComponent } from '../../components/Links.component';

@Component({
  selector: 'home-page',
  imports: [RouterOutlet, LinksComponent],
  templateUrl: './HomePage.html'
})
export class HomePage {
    homePageService = inject(HomePageService);
    protected readonly title = signal('This is the Home Page');

    links = signal(this.homePageService.initLinks());
    selectedLink = signal(this.links()[0]);

    constructor() {
        effect(() => {
            console.log("Links: ", this.links());
        });
    }



}
