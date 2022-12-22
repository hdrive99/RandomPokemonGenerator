import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PokemonSetAdd } from '../models/pokemon-set-add.model';
import { PokemonSetFormatListAdd } from '../models/pokemon-set-format-list-add.model';
import { PokemonSetUpdate } from '../models/pokemon-set-update.model';
import { PokemonSet } from '../models/pokemon-set.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonSetService {

  constructor(
    private http: HttpClient
  ) { }

  create(model: PokemonSetAdd): Observable<number> {
    return this.http.post<number>(`${environment.BASE_API_PATH}/PokemonSet`, model);
  }

  delete(pokemonSetId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.BASE_API_PATH}/PokemonSet/${pokemonSetId}`);
  }

  getAll(): Observable<PokemonSet[]> {
    return this.http.get<PokemonSet[]>(`${environment.BASE_API_PATH}/PokemonSet`);
  }

  getAllTruncated(): Observable<PokemonSet[]> {
    return this.http.get<PokemonSet[]>(`${environment.BASE_API_PATH}/PokemonSet/GetTruncated`);
  }

  get(pokemonSetId: number): Observable<PokemonSet> {
    return this.http.get<PokemonSet>(`${environment.BASE_API_PATH}/PokemonSet/${pokemonSetId}`);
  }

  update(model: PokemonSetUpdate): Observable<boolean> {
    return this.http.put<boolean>(`${environment.BASE_API_PATH}/PokemonSet`, model);
  }

  addFormatList(model: PokemonSetFormatListAdd): Observable<boolean> {
    return this.http.post<boolean>(`${environment.BASE_API_PATH}/PokemonSet/FormatList`, model);
  }

  deleteFormatList(model: PokemonSetFormatListAdd): Observable<boolean> {
    return this.http.request<boolean>('delete', `${environment.BASE_API_PATH}/PokemonSet/FormatList`, {body: model});
  }

  // Returns array of JSON objects containing imported sets that are mapped to PokemonSet properties
  importPokemonSet(importSet): Observable<any[]> {
    return this.http.post<any>(`${environment.SHOWDOWN_LOCAL_SERVER_PATH}/importSet`, {model: importSet});
  }

  unpackAndExportSets(exportSet): Observable<any> {
    return this.http.post<any>(`${environment.SHOWDOWN_LOCAL_SERVER_PATH}/unpackAndExportSets`, {model: exportSet});
  }
}
