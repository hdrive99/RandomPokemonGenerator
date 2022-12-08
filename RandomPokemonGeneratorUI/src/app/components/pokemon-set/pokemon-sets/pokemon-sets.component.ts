import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { PokemonSetAdd } from 'src/app/models/pokemon-set-add.model';
import { MyErrorStateMatcher } from 'src/app/services/my-error-state-matcher.service';
import { PokemonSetService } from 'src/app/services/pokemon-set.service';

@Component({
  selector: 'app-pokemon-sets',
  templateUrl: './pokemon-sets.component.html',
  styleUrls: ['./pokemon-sets.component.scss']
})
export class PokemonSetsComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  displayedColumns = ['id', 'setName', 'species', 'item', 'ability', 'terastallizeType', 'nature', 'formatListsCount'];
  tableColumnNames = ['ID', 'Set Name', 'Pokemon', 'Item', 'Ability', 'Tera Type', 'Nature', '# of Format Lists', 'Delete'];
  columnsToDisplayWithDelete = ['id', 'setName', 'species', 'item', 'ability', 'terastallizeType', 'nature', 'formatListsCount', 'delete'];
  @ViewChild(MatSort) sort: MatSort;

  pokemonSetForm = new FormGroup({
    pokemonSetControl: new FormControl('', [ Validators.required ])
  });
  matcher = new MyErrorStateMatcher();

  constructor(
    private pokemonSetService: PokemonSetService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAllPokemonSets();
  }

  getAllPokemonSets() {
    this.pokemonSetService.getAll().pipe(
      map((data) => {
        data.forEach(element => {
          element['formatListsCount'] = element['formatLists'].length;
        });
        return data;
      })
    ).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
  }

  addPokemonSet() {
    let setName = this.pokemonSetForm.value['pokemonSetControl'];
    var model: PokemonSetAdd = {
        setName: setName,
        species: "",
        ability: "",
        moveOne: "",
        moveTwo: "",
        moveThree: "",
        moveFour: "",
        hpEffortValue: 0,
        atkEffortValue: 0,
        defEffortValue: 0,
        spaEffortValue: 0,
        spdEffortValue: 0,
        speEffortValue: 0,
        hpIndividualValue: 31,
        atkIndividualValue: 31,
        defIndividualValue: 31,
        spaIndividualValue: 31,
        spdIndividualValue: 31,
        speIndividualValue: 31,
        nature: ""
    };
    this.pokemonSetService.create(model).subscribe((id) => {
      if (id != 0) {
        this.router.navigate(['/pokemon-set/edit/', id]);
      } else {
        this.snackBar.open('Either this set name already exists, or an error occurred', 'ERROR', {
          duration: 5000
        })
      }
    });
  }

  deletePokemonSet(row) {
    this.pokemonSetService.delete(row.id).subscribe((success) => {
      if (success) {
        this.getAllPokemonSets();
      } else {
        this.snackBar.open('Something went wrong while deleting this pokemon set', 'ERROR', {
          duration: 5000
        })
      }
    })
  }

  confirmDelete(row) {
    row.deleteConfirm = true;
  }

  cancelDeleteConfirm(row) {
    row.deleteConfirm = false;
  }
}
