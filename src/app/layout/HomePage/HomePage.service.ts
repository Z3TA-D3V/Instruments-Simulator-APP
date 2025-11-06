import { Injectable } from "@angular/core";
import { Link } from "../../Models/HomePage/HomePage.model";

@Injectable({providedIn: 'root'})
export class HomePageService { 

    private ICONS_BASE_PATH: string = '/assets/icon';
    
    initLinks(): Link[] {
        return (
            [
                {
                    path: "instruments",
                    name: "Instruments",
                    iconUrl: `${this.ICONS_BASE_PATH}/instruments-icon.svg`
                },
                {
                    path: "configuration",
                    name: "Configuration",
                    iconUrl: `${this.ICONS_BASE_PATH}/settings-svgrepo-com-icon.svg`
                },
                {
                    path: "about",
                    name: "About",
                    iconUrl: `${this.ICONS_BASE_PATH}/about-us-icon.svg`
                }
            ]
        )
    }


}