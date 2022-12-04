import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { RouterLinkI } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'RandomPokemonGenerator';
  public routeLinks: RouterLinkI[] = [
    { label: "Format Lists", link: "format-lists" },
    { label: "Pokemon Sets", link: "pokemon-sets" },
    { label: "Randomizer", link: "randomizer-form" },
  ];
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() { }
}
