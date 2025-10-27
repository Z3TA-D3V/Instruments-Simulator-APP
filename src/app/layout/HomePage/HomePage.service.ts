import { Injectable } from "@angular/core";
import { Link } from "../../Models/HomePage/HomePage.model";

@Injectable({providedIn: 'root'})
export class HomePageService { 

    initLinks(): Link[] {
        return (
            [
                {
                    path: "instruments",
                    name: "Instruments"
                },
                {
                    path: "configuration",
                    name: "Configuration"
                }
            ]
        )
    }


}