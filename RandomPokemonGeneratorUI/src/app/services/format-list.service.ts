import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormatListAdd } from '../models/format-list-add.model';
import { FormatListPokemonSetAdd } from '../models/format-list-pokemon-set-add.model';
import { FormatListUpdate } from '../models/format-list-update.model';
import { FormatList } from '../models/format-list.model';

@Injectable({
  providedIn: 'root'
})
export class FormatListService {

  constructor(
    private http: HttpClient
  ) { }

  create(model: FormatListAdd): Observable<number> {
    return this.http.post<number>(`${environment.BASE_API_PATH}/FormatList`, model);
  }

  delete(formatListId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.BASE_API_PATH}/FormatList/${formatListId}`);
  }

  getAll(): Observable<FormatList[]> {
    return this.http.get<FormatList[]>(`${environment.BASE_API_PATH}/FormatList`, { observe: 'body' });
  }

  get(formatListId: number): Observable<FormatList> {
    return this.http.get<FormatList>(`${environment.BASE_API_PATH}/FormatList/${formatListId}`, { observe: 'body' });
  }

  update(model: FormatListUpdate): Observable<boolean> {
    return this.http.put<boolean>(`${environment.BASE_API_PATH}/FormatList`, model);
  }

  addPokemonSet(model: FormatListPokemonSetAdd): Observable<boolean> {
    return this.http.post<boolean>(`${environment.BASE_API_PATH}/FormatList/PokemonSet`, model);
  }

  deletePokemonSet(model: FormatListPokemonSetAdd): Observable<boolean> {
    return this.http.request<boolean>('delete', `${environment.BASE_API_PATH}/FormatList/PokemonSet`, { body: model });
  }
}
