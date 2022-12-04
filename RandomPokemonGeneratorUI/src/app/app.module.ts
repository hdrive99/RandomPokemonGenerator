import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormatListsComponent } from './components/format-list/format-lists/format-lists.component';
import { FormatListComponent } from './components/format-list/format-list/format-list.component';
import { PokemonSetsComponent } from './components/pokemon-set/pokemon-sets/pokemon-sets.component';
import { PokemonSetComponent } from './components/pokemon-set/pokemon-set/pokemon-set.component';
import { RandomizerFormComponent } from './components/randomizer/randomizer-form/randomizer-form.component';
import { RandomizerOutputComponent } from './components/randomizer/randomizer-output/randomizer-output.component';

@NgModule({
  declarations: [
    AppComponent,
    FormatListsComponent,
    FormatListComponent,
    PokemonSetsComponent,
    PokemonSetComponent,
    RandomizerFormComponent,
    RandomizerOutputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
