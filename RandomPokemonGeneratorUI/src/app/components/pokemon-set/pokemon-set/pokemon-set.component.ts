import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { FormatList } from 'src/app/models/format-list.model';
import { PokemonSetFormatListAdd } from 'src/app/models/pokemon-set-format-list-add.model';
import { PokemonSetUpdate } from 'src/app/models/pokemon-set-update.model';
import { FormatListService } from 'src/app/services/format-list.service';
import { MyErrorStateMatcher } from 'src/app/services/my-error-state-matcher.service';
import { PokemonSetService } from 'src/app/services/pokemon-set.service';

@Component({
  selector: 'app-pokemon-set',
  templateUrl: './pokemon-set.component.html',
  styleUrls: ['./pokemon-set.component.scss']
})
export class PokemonSetComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  displayedColumns = ['id', 'name']
  tableColumnNames = ['ID', 'Format Name', 'Delete'];
  columnsToDisplayWithDelete = ['id', 'name', 'delete'];
  @ViewChild(MatSort) sort: MatSort;
  
  pokemonSetFormatListAddForm = new FormGroup({
    pokemonSetFormatListAddControl: new FormControl('', [ Validators.required ])
  });
  updatePokemonSetForm = new FormGroup({
    setNameControl: new FormControl('', [ Validators.required ]),
    nameControl: new FormControl('', []),
    speciesControl: new FormControl('', [ Validators.required ]),
    itemControl: new FormControl('', []),
    abilityControl: new FormControl('', [ Validators.required ]),
    moveOneControl: new FormControl('', []),
    moveTwoControl: new FormControl('', []),
    moveThreeControl: new FormControl('', []),
    moveFourControl: new FormControl('', []),
    natureControl: new FormControl('', [ Validators.required ]),
    HpEffortValueControl: new FormControl('', []),
    AtkEffortValueControl: new FormControl('', []),
    DefEffortValueControl: new FormControl('', []),
    SpaEffortValueControl: new FormControl('', []),
    SpdEffortValueControl: new FormControl('', []),
    SpeEffortValueControl: new FormControl('', []),
    genderControl: new FormControl('', []),
    HpIndividualValueControl: new FormControl('', []),
    AtkIndividualValueControl: new FormControl('', []),
    DefIndividualValueControl: new FormControl('', []),
    SpaIndividualValueControl: new FormControl('', []),
    SpdIndividualValueControl: new FormControl('', []),
    SpeIndividualValueControl: new FormControl('', []),
    levelControl: new FormControl('', []),
    terastallizeTypeControl: new FormControl('', [])
  });
  matcher = new MyErrorStateMatcher();

  pokemonSetId = parseInt(this.route.snapshot.paramMap.get('id'));
  pokemonSetName;
  pokemonSpecies;
  pokemonSetFormatListsIds = [];
  allFormatListsFiltered: FormatList[];
  
  constructor(
    private route: ActivatedRoute,
    private pokemonSetService: PokemonSetService,
    private formatListService: FormatListService,
    private snackBar: MatSnackBar
  ) { }
  
  ngOnInit(): void {
    this.getPokemonSet();
  }

  getPokemonSet() {
    this.pokemonSetService.get(this.pokemonSetId).subscribe((data) => {
      this.setAllPokemonSetFormValues(data);
      this.pokemonSetName = data.setName;
      this.pokemonSpecies = data.species.toLowerCase();
      if (data?.formatLists) {
        this.dataSource = new MatTableDataSource(data.formatLists);
        this.dataSource.sort = this.sort;
        // Reset and re-track existing FormatList items in PokemonSet to prevent unhelpful search results
        this.pokemonSetFormatListsIds = [];
        data.formatLists.forEach(element => {
          this.pokemonSetFormatListsIds.push(element.id);
        });
        this.getAllFormatListsFiltered();
      }
    });
  }

  setAllPokemonSetFormValues(pokemonSet: PokemonSetUpdate) {
    this.updatePokemonSetForm.get('setNameControl').setValue(pokemonSet.setName);
    this.updatePokemonSetForm.get('nameControl').setValue(pokemonSet.name);
    this.updatePokemonSetForm.get('speciesControl').setValue(pokemonSet.species);
    this.updatePokemonSetForm.get('itemControl').setValue(pokemonSet.item);
    this.updatePokemonSetForm.get('abilityControl').setValue(pokemonSet.ability);
    this.updatePokemonSetForm.get('moveOneControl').setValue(pokemonSet.moveOne);
    this.updatePokemonSetForm.get('moveTwoControl').setValue(pokemonSet.moveTwo);
    this.updatePokemonSetForm.get('moveThreeControl').setValue(pokemonSet.moveThree);
    this.updatePokemonSetForm.get('moveFourControl').setValue(pokemonSet.moveFour);
    this.updatePokemonSetForm.get('natureControl').setValue(pokemonSet.nature);
    this.updatePokemonSetForm.get('HpEffortValueControl').setValue(pokemonSet.hpEffortValue);
    this.updatePokemonSetForm.get('AtkEffortValueControl').setValue(pokemonSet.atkEffortValue);
    this.updatePokemonSetForm.get('DefEffortValueControl').setValue(pokemonSet.defEffortValue);
    this.updatePokemonSetForm.get('SpaEffortValueControl').setValue(pokemonSet.spaEffortValue);
    this.updatePokemonSetForm.get('SpdEffortValueControl').setValue(pokemonSet.spdEffortValue);
    this.updatePokemonSetForm.get('SpeEffortValueControl').setValue(pokemonSet.speEffortValue);
    this.updatePokemonSetForm.get('genderControl').setValue(pokemonSet.gender);
    this.updatePokemonSetForm.get('HpIndividualValueControl').setValue(pokemonSet.hpIndividualValue);
    this.updatePokemonSetForm.get('AtkIndividualValueControl').setValue(pokemonSet.atkIndividualValue);
    this.updatePokemonSetForm.get('DefIndividualValueControl').setValue(pokemonSet.defIndividualValue);
    this.updatePokemonSetForm.get('SpaIndividualValueControl').setValue(pokemonSet.spaIndividualValue);
    this.updatePokemonSetForm.get('SpdIndividualValueControl').setValue(pokemonSet.spdIndividualValue);
    this.updatePokemonSetForm.get('SpeIndividualValueControl').setValue(pokemonSet.speIndividualValue);
    this.updatePokemonSetForm.get('levelControl').setValue(pokemonSet.level);
    this.updatePokemonSetForm.get('terastallizeTypeControl').setValue(pokemonSet.terastallizeType);
  }

  updatePokemonSet() {
    let model = new PokemonSetUpdate(
      this.pokemonSetId,
      this.updatePokemonSetForm.value['setNameControl'],
      this.updatePokemonSetForm.value['speciesControl'],
      this.updatePokemonSetForm.value['abilityControl'],
      this.updatePokemonSetForm.value['moveOneControl'],
      this.updatePokemonSetForm.value['moveTwoControl'],
      this.updatePokemonSetForm.value['moveThreeControl'],
      this.updatePokemonSetForm.value['moveFourControl'],
      this.updatePokemonSetForm.value['HpEffortValueControl'],
      this.updatePokemonSetForm.value['AtkEffortValueControl'],
      this.updatePokemonSetForm.value['DefEffortValueControl'],
      this.updatePokemonSetForm.value['SpaEffortValueControl'],
      this.updatePokemonSetForm.value['SpdEffortValueControl'],
      this.updatePokemonSetForm.value['SpeEffortValueControl'],
      this.updatePokemonSetForm.value['HpIndividualValueControl'],
      this.updatePokemonSetForm.value['AtkIndividualValueControl'],
      this.updatePokemonSetForm.value['DefIndividualValueControl'],
      this.updatePokemonSetForm.value['SpaIndividualValueControl'],
      this.updatePokemonSetForm.value['SpdIndividualValueControl'],
      this.updatePokemonSetForm.value['SpeIndividualValueControl'],
      this.updatePokemonSetForm.value['natureControl'],
      this.updatePokemonSetForm.value['nameControl'],
      this.updatePokemonSetForm.value['itemControl'],
      this.updatePokemonSetForm.value['genderControl'],
      this.updatePokemonSetForm.value['levelControl'],
      this.updatePokemonSetForm.value['terastallizeTypeControl']
    );
    this.pokemonSetService.update(model).subscribe((success) => {
      if (success) {
        this.getPokemonSet();
      } else {
        this.snackBar.open('Either this set name already exists, or an error occurred', 'ERROR', {
          duration: 5000
        })
      }
    });
  }

  deleteFormatListPokemonSet(row) {
    let model = new PokemonSetFormatListAdd(this.pokemonSetId, row.id);
    this.pokemonSetService.deleteFormatList(model).subscribe((success) => {
      if (success) {
        this.getPokemonSet();
      } else {
        this.snackBar.open('Something went wrong while deleting this format list', 'ERROR', {
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

  addPokemonSetFormatList() {
    let formatSetId = this.pokemonSetFormatListAddForm.value['pokemonSetFormatListAddControl'];
    var model: PokemonSetFormatListAdd = {
      pokemonSetId: this.pokemonSetId,
      formatListId: formatSetId
    };
    this.pokemonSetService.addFormatList(model).subscribe((success) => {
      if (success) {
        this.getPokemonSet();
      } else {
        this.snackBar.open('Something went wrong while adding this format list', 'ERROR', {
          duration: 5000
        })
      }
    });
  }

  getAllFormatListsFiltered() {
    this.formatListService.getAll().pipe(
      map((data) => {
        data = data.filter(item => !this.pokemonSetFormatListsIds.includes(item.id));
        return data;
      })
    ).subscribe((data) => {
      this.allFormatListsFiltered = data;
    });
  }

  renderImageOnSpeciesInputChange(event) {
    let timer;
    const newSpecies = event.currentTarget.value.toLowerCase();
    clearTimeout(timer);
    
    timer = setTimeout(() => {
      this.pokemonSpecies = newSpecies;
    }, 1000);
  }
}
