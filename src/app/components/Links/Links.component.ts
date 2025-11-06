import { Component, effect, inject, input, Input, InputSignal, Output, output, Signal, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Link } from '../../Models/HomePage/HomePage.model';
import { EventEmitter } from 'stream';

@Component({
  selector: 'links-component',
  imports: [RouterOutlet],
  templateUrl: './Links.html'
})
export class LinksComponent {

    links: InputSignal<Link[]> = input.required<Link[]>();
    linkSelected = output<Link>();

    linkSelectedSignal:WritableSignal<Link> = signal<Link>({name:"", "path":"", iconUrl:""});

    constructor() {
      effect(() => {
        const selectedLink = this.linkSelectedSignal();
        // Solo emitir si hay un link válido seleccionado
        if (selectedLink.path !== "") {
          this.linkSelected.emit(selectedLink);
        }
      });
    }

    onRedirect(link: Link) {
      this.linkSelectedSignal.set(link);
    }

}
