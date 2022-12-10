import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormatListComponent } from './components/format-list/format-list/format-list.component';
import { FormatListsComponent } from './components/format-list/format-lists/format-lists.component';
import { PokemonSetComponent } from './components/pokemon-set/pokemon-set/pokemon-set.component';
import { PokemonSetsComponent } from './components/pokemon-set/pokemon-sets/pokemon-sets.component';
import { RandomizerComponent } from './components/randomizer/randomizer.component';

const routes: Routes = [
  {path: '', redirectTo: 'format-lists', pathMatch: 'full'},
  {path: 'format-lists', component: FormatListsComponent},
  {path: 'format-list/edit/0', redirectTo: 'format-lists', pathMatch: 'full'},
  {path: 'format-list/edit/:id', component: FormatListComponent},
  {path: 'pokemon-sets', component: PokemonSetsComponent},
  {path: 'pokemon-set/edit/0', redirectTo: 'pokemon-sets', pathMatch: 'full'},
  {path: 'pokemon-set/edit/:id', component: PokemonSetComponent},
  {path: 'randomizer', component: RandomizerComponent},
  {path: '**', redirectTo: 'format-lists', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
