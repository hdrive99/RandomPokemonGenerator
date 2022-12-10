import { Component } from '@angular/core';
import { RouterLinkI } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RandomPokemonGenerator';
  
  public routeLinks: RouterLinkI[] = [
    { label: "Format Lists", link: "format-lists" },
    { label: "Pokemon Sets", link: "pokemon-sets" },
    { label: "Randomizer", link: "randomizer" },
  ];

}
