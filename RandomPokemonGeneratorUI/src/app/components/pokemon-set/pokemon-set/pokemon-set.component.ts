import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { FormatList } from 'src/app/models/format-list.model';
import { PokemonSetFormatListAdd } from 'src/app/models/pokemon-set-format-list-add.model';
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
    moveOneControl: new FormControl('', [ Validators.required ]),
    moveTwoControl: new FormControl('', [ Validators.required ]),
    moveThreeControl: new FormControl('', [ Validators.required ]),
    moveFourControl: new FormControl('', [ Validators.required ]),
    natureControl: new FormControl('', [ Validators.required ]),
    HpEffortValueControl: new FormControl('', [ Validators.required ]),
    AtkEffortValueControl: new FormControl('', [ Validators.required ]),
    DefEffortValueControl: new FormControl('', [ Validators.required ]),
    SpaEffortValueControl: new FormControl('', [ Validators.required ]),
    SpdEffortValueControl: new FormControl('', [ Validators.required ]),
    SpeEffortValueControl: new FormControl('', [ Validators.required ]),
    genderControl: new FormControl('', []),
    HpIndividualValueControl: new FormControl('', [ Validators.required ]),
    AtkIndividualValueControl: new FormControl('', [ Validators.required ]),
    DefIndividualValueControl: new FormControl('', [ Validators.required ]),
    SpaIndividualValueControl: new FormControl('', [ Validators.required ]),
    SpdIndividualValueControl: new FormControl('', [ Validators.required ]),
    SpeIndividualValueControl: new FormControl('', [ Validators.required ]),
    levelControl: new FormControl('', []),
    terastallizeTypeControl: new FormControl('', [])
  });
  matcher = new MyErrorStateMatcher();

  pokemonSetId = parseInt(this.route.snapshot.paramMap.get('id'));
  pokemonSetName;
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
    // displayedColumns = ['id', 'setName', 'name', 'species', 'item', 'ability', 'moveOne', 'moveTwo', 'moveThree', 'moveFour', 'nature', 'HpEffortValue', 'AtkEffortValue', 'DefEffortValue', 'SpaEffortValue', 'SpdEffortValue', 'SpeEffortValue', 'gender', 'HpIndividualValue', 'AtkIndividualValue', 'DefIndividualValue', 'SpaIndividualValue', 'SpdIndividualValue', 'SpeIndividualValue', 'level', 'terastallizeType'];
  }

  getPokemonSet() {
    this.pokemonSetService.get(this.pokemonSetId).subscribe((data) => {
      this.pokemonSetName = data.setName;
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

  updatePokemonSet() {
    // let name = this.updateFormatListForm.value['updateFormatListControl']
    // let model = new FormatListUpdate(this.formatListId, name);
    // this.formatListService.update(model).subscribe((success) => {
    //   if (success) {
    //     this.getFormatList();
    //   } else {
    //     this.snackBar.open('Either this name already exists, or an error occurred', 'ERROR', {
    //       duration: 5000
    //     })
    //   }
    // });
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
}
