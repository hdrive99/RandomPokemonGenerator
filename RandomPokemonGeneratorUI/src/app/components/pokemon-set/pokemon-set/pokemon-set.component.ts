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
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-pokemon-set',
  templateUrl: './pokemon-set.component.html',
  styleUrls: ['./pokemon-set.component.scss']
})
export class PokemonSetComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  displayedColumns = ['name']
  tableColumnNames = ['Format Name', 'Delete'];
  columnsToDisplayWithDelete = ['name', 'delete'];
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
  importPokemonSetForm = new FormGroup({
    importPokemonSetControl: new FormControl('', [ Validators.required ])
  });
  matcher = new MyErrorStateMatcher();

  pokemonSetId = parseInt(this.route.snapshot.paramMap.get('id'));
  pokemonSetName;
  pokemonSpecies;
  pokemonSetFormatListsIds = [];
  allFormatListsFiltered: FormatList[];
  evTotal;
  allTeraTypes = ['Tera Type: Bug', 'Tera Type: Dark', 'Tera Type: Dragon', 'Tera Type: Electric', 'Tera Type: Fairy', 'Tera Type: Fighting', 'Tera Type: Fire', 'Tera Type: Flying', 'Tera Type: Ghost', 'Tera Type: Grass', 'Tera Type: Ground', 'Tera Type: Ice', 'Tera Type: Normal', 'Tera Type: Poison', 'Tera Type: Psychic', 'Tera Type: Rock', 'Tera Type: Steel', 'Tera Type: Water'];
  exportedTeraType;
  exportData = '';
  
  constructor(
    private route: ActivatedRoute,
    private pokemonSetService: PokemonSetService,
    private formatListService: FormatListService,
    private snackBar: MatSnackBar,
    private sharedService: SharedService
  ) { }
  
  ngOnInit(): void {
    this.getPokemonSet();
    this.updatePokemonSetForm.get('HpEffortValueControl').valueChanges.subscribe((value) => { this.updatePokemonSetForm.get('HpEffortValueControl').setValue(value, { emitEvent: false }); this.calculateRemainingEvs(); });
    this.updatePokemonSetForm.get('AtkEffortValueControl').valueChanges.subscribe((value) => { this.updatePokemonSetForm.get('AtkEffortValueControl').setValue(value, { emitEvent: false }); this.calculateRemainingEvs(); });
    this.updatePokemonSetForm.get('DefEffortValueControl').valueChanges.subscribe((value) => { this.updatePokemonSetForm.get('DefEffortValueControl').setValue(value, { emitEvent: false }); this.calculateRemainingEvs(); });
    this.updatePokemonSetForm.get('SpaEffortValueControl').valueChanges.subscribe((value) => { this.updatePokemonSetForm.get('SpaEffortValueControl').setValue(value, { emitEvent: false }); this.calculateRemainingEvs(); });
    this.updatePokemonSetForm.get('SpdEffortValueControl').valueChanges.subscribe((value) => { this.updatePokemonSetForm.get('SpdEffortValueControl').setValue(value, { emitEvent: false }); this.calculateRemainingEvs(); });
    this.updatePokemonSetForm.get('SpeEffortValueControl').valueChanges.subscribe((value) => { this.updatePokemonSetForm.get('SpeEffortValueControl').setValue(value, { emitEvent: false }); this.calculateRemainingEvs(); });
    this.updatePokemonSetForm.valueChanges.subscribe(() => { this.updateExport(); });
  }

  getPokemonSet() {
    this.sharedService.startSpinner();

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
      } else {
        this.sharedService.stopSpinner();
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
    this.sharedService.startSpinner();

    let model = new PokemonSetUpdate(
      this.pokemonSetId,
      this.updatePokemonSetForm.value['setNameControl'], // validated
      this.updatePokemonSetForm.value['speciesControl'], // validated
      this.updatePokemonSetForm.value['abilityControl'], // validated
      this.updatePokemonSetForm.value['moveOneControl'] != null ? this.updatePokemonSetForm.value['moveOneControl'] : '',
      this.updatePokemonSetForm.value['moveTwoControl'] != null ? this.updatePokemonSetForm.value['moveTwoControl'] : '',
      this.updatePokemonSetForm.value['moveThreeControl'] != null ? this.updatePokemonSetForm.value['moveThreeControl'] : '',
      this.updatePokemonSetForm.value['moveFourControl'] != null ? this.updatePokemonSetForm.value['moveFourControl'] : '',
      this.updatePokemonSetForm.value['HpEffortValueControl'] != null ? this.updatePokemonSetForm.value['HpEffortValueControl'] : 0,
      this.updatePokemonSetForm.value['AtkEffortValueControl'] != null ? this.updatePokemonSetForm.value['AtkEffortValueControl'] : 0,
      this.updatePokemonSetForm.value['DefEffortValueControl'] != null ? this.updatePokemonSetForm.value['DefEffortValueControl'] : 0,
      this.updatePokemonSetForm.value['SpaEffortValueControl'] != null ? this.updatePokemonSetForm.value['SpaEffortValueControl'] : 0,
      this.updatePokemonSetForm.value['SpdEffortValueControl'] != null ? this.updatePokemonSetForm.value['SpdEffortValueControl'] : 0,
      this.updatePokemonSetForm.value['SpeEffortValueControl'] != null ? this.updatePokemonSetForm.value['SpeEffortValueControl'] : 0,
      this.updatePokemonSetForm.value['HpIndividualValueControl'] != null ? this.updatePokemonSetForm.value['HpIndividualValueControl'] : 31,
      this.updatePokemonSetForm.value['AtkIndividualValueControl'] != null ? this.updatePokemonSetForm.value['AtkIndividualValueControl'] : 31,
      this.updatePokemonSetForm.value['DefIndividualValueControl'] != null ? this.updatePokemonSetForm.value['DefIndividualValueControl'] : 31,
      this.updatePokemonSetForm.value['SpaIndividualValueControl'] != null ? this.updatePokemonSetForm.value['SpaIndividualValueControl'] : 31,
      this.updatePokemonSetForm.value['SpdIndividualValueControl'] != null ? this.updatePokemonSetForm.value['SpdIndividualValueControl'] : 31,
      this.updatePokemonSetForm.value['SpeIndividualValueControl'] != null ? this.updatePokemonSetForm.value['SpeIndividualValueControl'] : 31,
      this.updatePokemonSetForm.value['natureControl'], // validated
      this.updatePokemonSetForm.value['nameControl'], // can be null
      this.updatePokemonSetForm.value['itemControl'], // can be null
      this.updatePokemonSetForm.value['genderControl'], // can be null
      this.updatePokemonSetForm.value['levelControl'], // can be null
      this.updatePokemonSetForm.value['terastallizeTypeControl'] // can be null
    );
    this.pokemonSetService.update(model).subscribe((success) => {
      if (success) {
        this.getPokemonSet();
      } else {
        this.snackBar.open('Either this set name already exists, or an error occurred', 'ERROR', {
          duration: 5000
        })

        this.sharedService.stopSpinner();
      }
    });
  }

  deleteFormatListPokemonSet(row) {
    this.sharedService.startSpinner();

    let model = new PokemonSetFormatListAdd(this.pokemonSetId, row.id);
    this.pokemonSetService.deleteFormatList(model).subscribe((success) => {
      if (success) {
        this.getPokemonSet();
      } else {
        this.snackBar.open('Something went wrong while deleting this format list', 'ERROR', {
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

  addPokemonSetFormatList() {
    this.sharedService.startSpinner();

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

        this.sharedService.stopSpinner();
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

      this.sharedService.stopSpinner();
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

  calculateRemainingEvs() {
    this.evTotal = 508 - 
      (this.updatePokemonSetForm.get('HpEffortValueControl').value +
      this.updatePokemonSetForm.get('AtkEffortValueControl').value +
      this.updatePokemonSetForm.get('DefEffortValueControl').value +
      this.updatePokemonSetForm.get('SpaEffortValueControl').value +
      this.updatePokemonSetForm.get('SpdEffortValueControl').value +
      this.updatePokemonSetForm.get('SpeEffortValueControl').value);
  }

  importPokemonSet() {
    this.sharedService.startSpinner();

    let input: string = this.importPokemonSetForm.get('importPokemonSetControl').value;
    let teraType = '';
    this.allTeraTypes.forEach(el => {
      if (input.includes(el)) {
        teraType = el.slice(11);
      }
    });

    // Store original species to avoid - character from breaking speciesControl value (needed for sprites, though some are still broken)
    // (Known: breaks upon nicknamed imports with special characters)
    // (Also has weird spacing on species export but this is still a valid export)
    let speciesFull = input.split('  \n')[0].split(' @')[0];
    if (speciesFull.includes('-')) {
      if (speciesFull.includes('.')) {
        speciesFull = 'Mr. Mime-Galar';
      } else {
        speciesFull = speciesFull.split(' ')[0];
      }
    } // At the moment, all species with a space are genderless, so splitting by item ' @' is enough to return only the species - without ' (M)'
    
    this.pokemonSetService.importPokemonSet(input).subscribe((importedPokemonSet) => {
      let model = new PokemonSetUpdate(
        this.pokemonSetId,
        this.pokemonSetName,
        this.capitalizeFirstLetter(speciesFull),
        importedPokemonSet[0].ability,
        importedPokemonSet[0].moves[0],
        importedPokemonSet[0].moves[1],
        importedPokemonSet[0].moves[2],
        importedPokemonSet[0].moves[3],
        importedPokemonSet[0].evs.hp,
        importedPokemonSet[0].evs.atk,
        importedPokemonSet[0].evs.def,
        importedPokemonSet[0].evs.spa,
        importedPokemonSet[0].evs.spd,
        importedPokemonSet[0].evs.spe,
        importedPokemonSet[0].ivs.hp,
        importedPokemonSet[0].ivs.atk,
        importedPokemonSet[0].ivs.def,
        importedPokemonSet[0].ivs.spa,
        importedPokemonSet[0].ivs.spd,
        importedPokemonSet[0].ivs.spe,
        importedPokemonSet[0].nature,
        importedPokemonSet[0].name,
        importedPokemonSet[0].item,
        importedPokemonSet[0].gender,
        importedPokemonSet[0].level,
        teraType
      );
      this.setAllPokemonSetFormValues(model);
      this.pokemonSpecies = model.species.toLowerCase();

      this.sharedService.stopSpinner();
    });
  }

  updateExport(): string {
    this.exportedTeraType = this.updatePokemonSetForm.value['terastallizeTypeControl'] != null ? `Tera Type: ${this.updatePokemonSetForm.value['terastallizeTypeControl']}` : false;
    let model = `` +
      `${this.updatePokemonSetForm.value['nameControl'] != null ? this.updatePokemonSetForm.value['nameControl'] : ''}` + `|` +
      `${this.updatePokemonSetForm.value['speciesControl']}` + `|` + // validated
      `${this.updatePokemonSetForm.value['itemControl'] != null ? this.updatePokemonSetForm.value['itemControl'] : ''}` + `|` +
      `${this.updatePokemonSetForm.value['abilityControl']}` + `|` + // validated
      `${this.updatePokemonSetForm.value['moveOneControl'] != null ? this.updatePokemonSetForm.value['moveOneControl'] : ''}` + `,` +
      `${this.updatePokemonSetForm.value['moveTwoControl'] != null ? this.updatePokemonSetForm.value['moveTwoControl'] : ''}` + `,` +
      `${this.updatePokemonSetForm.value['moveThreeControl'] != null ? this.updatePokemonSetForm.value['moveThreeControl'] : ''}` + `,` +
      `${this.updatePokemonSetForm.value['moveFourControl'] != null ? this.updatePokemonSetForm.value['moveFourControl'] : ''}` + `|` +
      this.updatePokemonSetForm.value['natureControl'] + `|` + // validated
      `${this.updatePokemonSetForm.value['HpEffortValueControl'] != null ? this.updatePokemonSetForm.value['HpEffortValueControl'] : 0}` + `,` +
      `${this.updatePokemonSetForm.value['AtkEffortValueControl'] != null ? this.updatePokemonSetForm.value['AtkEffortValueControl'] : 0}` + `,` +
      `${this.updatePokemonSetForm.value['DefEffortValueControl'] != null ? this.updatePokemonSetForm.value['DefEffortValueControl'] : 0}` + `,` +
      `${this.updatePokemonSetForm.value['SpaEffortValueControl'] != null ? this.updatePokemonSetForm.value['SpaEffortValueControl'] : 0}` + `,` +
      `${this.updatePokemonSetForm.value['SpdEffortValueControl'] != null ? this.updatePokemonSetForm.value['SpdEffortValueControl'] : 0}` + `,` +
      `${this.updatePokemonSetForm.value['SpeEffortValueControl'] != null ? this.updatePokemonSetForm.value['SpeEffortValueControl'] : 0}` + `|` +
      `${this.updatePokemonSetForm.value['genderControl'] != null ? this.updatePokemonSetForm.value['genderControl'].toUpperCase() : null}` + `|` + // can be null
      `${this.updatePokemonSetForm.value['HpIndividualValueControl'] != null ? this.updatePokemonSetForm.value['HpIndividualValueControl'] : 31}` + `,` +
      `${this.updatePokemonSetForm.value['AtkIndividualValueControl'] != null ? this.updatePokemonSetForm.value['AtkIndividualValueControl'] : 31}` + `,` +
      `${this.updatePokemonSetForm.value['DefIndividualValueControl'] != null ? this.updatePokemonSetForm.value['DefIndividualValueControl'] : 31}` + `,` +
      `${this.updatePokemonSetForm.value['SpaIndividualValueControl'] != null ? this.updatePokemonSetForm.value['SpaIndividualValueControl'] : 31}` + `,` +
      `${this.updatePokemonSetForm.value['SpdIndividualValueControl'] != null ? this.updatePokemonSetForm.value['SpdIndividualValueControl'] : 31}` + `,` +
      `${this.updatePokemonSetForm.value['SpeIndividualValueControl'] != null ? this.updatePokemonSetForm.value['SpeIndividualValueControl'] : 31}` + `|` +
      `|` + // shiny
      this.updatePokemonSetForm.value['levelControl'] + `|`; // can be null
    // + `]`; // happiness, pokeball, hidden power, gigantamax, dynamax level, tera type & then more Pokemon
    this.pokemonSetService.unpackAndExportSets(model).subscribe((data) => {
      this.exportData = data;
      if (this.exportedTeraType) {
        this.exportData = this.exportData.slice(0, this.exportData.length - 1) + this.exportedTeraType;
      }
    });
    return this.exportData;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
