import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { FormatListPokemonSetAdd } from 'src/app/models/format-list-pokemon-set-add.model';
import { FormatListUpdate } from 'src/app/models/format-list-update.model';
import { PokemonSet } from 'src/app/models/pokemon-set.model';
import { FormatListService } from 'src/app/services/format-list.service';
import { MyErrorStateMatcher } from 'src/app/services/my-error-state-matcher.service';
import { PokemonSetService } from 'src/app/services/pokemon-set.service';

@Component({
  selector: 'app-format-list',
  templateUrl: './format-list.component.html',
  styleUrls: ['./format-list.component.scss']
})
export class FormatListComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  displayedColumns = ['species', 'setName', 'item', 'ability', 'terastallizeType', 'level', 'nature'];
  tableColumnNames = ['Pokemon', 'Set Name', 'Item', 'Ability', 'Tera Type', 'Level', 'Nature'];
  columnsToDisplayWithDelete = ['sprite', 'species', 'setName', 'item', 'ability', 'terastallizeType', 'level', 'nature', 'delete'];
  @ViewChild(MatSort) sort: MatSort;

  formatListPokemonSetAddForm = new FormGroup({
    formatListPokemonSetAddControl: new FormControl('', [ Validators.required ])
  });
  updateFormatListForm = new FormGroup({
    updateFormatListControl: new FormControl('', [ Validators.required ])
  });
  matcher = new MyErrorStateMatcher();

  formatListId = parseInt(this.route.snapshot.paramMap.get('id'));
  formatListName;
  formatListPokemonSetsIds = [];
  allPokemonSetsFiltered: PokemonSet[];

  firstRun = true;
  shouldScrollToBottom = false;

  constructor(
    private route: ActivatedRoute,
    private formatListService: FormatListService,
    private pokemonSetService: PokemonSetService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getFormatList();
  }

  getFormatList() {
    this.formatListService.get(this.formatListId).subscribe((data) => {
      this.formatListName = data.name;
      if (data?.pokemonSets) {
        this.dataSource.data = data.pokemonSets;
        // Initial sort on species
        if (this.firstRun) { // Fix invert sort on every PokemonSet add/delete
          this.sort.sort(({ id: 'species', start: 'asc' }) as MatSortable);
          this.dataSource.sort = this.sort;
          this.firstRun = false;
        }
        // Reset and re-track existing PokemonSet items in FormatList to prevent unhelpful search results
        this.formatListPokemonSetsIds = [];
        data.pokemonSets.forEach(element => {
          this.formatListPokemonSetsIds.push(element.id);
        });
        this.getAllPokemonSetsFiltered();
      }
    });
  }

  updateFormatList() {
    let name = this.updateFormatListForm.value['updateFormatListControl']
    let model = new FormatListUpdate(this.formatListId, name);
    this.formatListService.update(model).subscribe((success) => {
      if (success) {
        this.getFormatList();
      } else {
        this.snackBar.open('Either this name already exists, or an error occurred', 'ERROR', {
          duration: 5000
        })
      }
    });
  }

  deleteFormatListPokemonSet(row) {
    let model = new FormatListPokemonSetAdd(this.formatListId, row.id);
    this.formatListService.deletePokemonSet(model).subscribe((success) => {
      if (success) {
        this.getFormatList();
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

  addFormatListPokemonSet() {
    let pokemonSetId = this.formatListPokemonSetAddForm.value['formatListPokemonSetAddControl'];
    var model: FormatListPokemonSetAdd = {
      formatListId: this.formatListId,
      pokemonSetId: pokemonSetId
    };
    this.formatListService.addPokemonSet(model).subscribe((success) => {
      if (success) {
        this.getFormatList();
        this.shouldScrollToBottom = true;
      } else {
        this.snackBar.open('Something went wrong while adding this pokemon set', 'ERROR', {
          duration: 5000
        })
      }
    });
  }

  getAllPokemonSetsFiltered() {
    this.pokemonSetService.getAllTruncated().pipe(
      map((data) => {
        data = data.filter(item => !this.formatListPokemonSetsIds.includes(item.id));
        return data;
      })
    ).subscribe((data) => {
      this.allPokemonSetsFiltered = data;
      if (this.shouldScrollToBottom) {
        this.scrollToBottom();
      }
    });
  }
  
  scrollToBottom(): void {
    document.getElementById('scrollTarget').scrollIntoView();
    this.shouldScrollToBottom = false;
  }
}
