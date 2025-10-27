import { Component, inject, input, Input, InputSignal, Signal, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Link } from '../Models/HomePage/HomePage.model';

@Component({
  selector: 'links-component',
  imports: [RouterOutlet],
  templateUrl: './Links.html'
})
export class LinksComponent {

    links: InputSignal<Link[]> = input.required<Link[]>();


    onButtonClick() {
        this.links().push({path: 'new-path', name: 'New Link'});
    }

}
