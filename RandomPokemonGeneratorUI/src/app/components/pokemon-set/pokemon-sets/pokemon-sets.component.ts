import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { PokemonSetAdd } from 'src/app/models/pokemon-set-add.model';
import { MyErrorStateMatcher } from 'src/app/services/my-error-state-matcher.service';
import { PokemonSetService } from 'src/app/services/pokemon-set.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-pokemon-sets',
  templateUrl: './pokemon-sets.component.html',
  styleUrls: ['./pokemon-sets.component.scss']
})
export class PokemonSetsComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  displayedColumns = ['species', 'setName', 'item', 'ability', 'terastallizeType', 'level', 'nature', 'formatListsCount'];
  tableColumnNames = ['Pokemon', 'Set Name', 'Item', 'Ability', 'Tera Type', 'Level', 'Nature', '# of Format Lists'];
  columnsToDisplayWithDelete = ['sprite', 'species', 'setName', 'item', 'ability', 'terastallizeType', 'level', 'nature', 'formatListsCount', 'delete'];
  @ViewChild(MatSort) sort: MatSort;

  pokemonSetForm = new FormGroup({
    pokemonSetControl: new FormControl('', [ Validators.required ])
  });
  matcher = new MyErrorStateMatcher();

  firstRun = true;

  constructor(
    private pokemonSetService: PokemonSetService,
    private router: Router,
    private snackBar: MatSnackBar,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.getAllPokemonSets();
  }

  getAllPokemonSets() {
    this.sharedService.startSpinner();

    this.pokemonSetService.getAllTruncated().pipe(
      map((data) => {
        data.forEach(element => {
          element['formatListsCount'] = element['formatLists'].length;
        });
        return data;
      })
    ).subscribe((data) => {
      this.dataSource.data = data;
      // Initial sort on species
      if (this.firstRun) { // Fix invert sort on every PokemonSet delete
        this.sort.sort(({ id: 'species', start: 'asc' }) as MatSortable);
        this.dataSource.sort = this.sort;
        this.firstRun = false;
        
        this.sharedService.stopSpinner();
      } else {
        this.sharedService.stopSpinner();
      }
    });
  }

  addPokemonSet() {
    this.sharedService.startSpinner();

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

        this.sharedService.stopSpinner();
      }
    });
  }

  deletePokemonSet(row) {
    this.sharedService.startSpinner();

    this.pokemonSetService.delete(row.id).subscribe((success) => {
      if (success) {
        this.getAllPokemonSets();
      } else {
        this.snackBar.open('Something went wrong while deleting this pokemon set', 'ERROR', {
          duration: 5000
        })

        this.sharedService.stopSpinner();
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
