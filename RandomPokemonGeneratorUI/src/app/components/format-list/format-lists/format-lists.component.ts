import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormatListAdd } from 'src/app/models/format-list-add.model';
import { FormatListService } from 'src/app/services/format-list.service';
import { MyErrorStateMatcher } from 'src/app/services/my-error-state-matcher.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-format-lists',
  templateUrl: './format-lists.component.html',
  styleUrls: ['./format-lists.component.scss']
})
export class FormatListsComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  displayedColumns = ['name', 'pokemonSetsCount'];
  tableColumnNames = ['Name', '# of Pokemon Sets'];
  columnsToDisplayWithDelete = ['name', 'pokemonSetsCount', 'delete'];
  @ViewChild(MatSort) sort: MatSort;

  formatListForm = new FormGroup({
    formatListControl: new FormControl('', [ Validators.required ])
  });
  matcher = new MyErrorStateMatcher();

  constructor(
    private formatListService: FormatListService,
    private router: Router,
    private snackBar: MatSnackBar,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.getAllFormatLists();
  }

  getAllFormatLists() {
    this.sharedService.startSpinner();

    this.formatListService.getAll().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    
      data.forEach((element, i) => {
        this.formatListService.get(element.id).subscribe((list) => {
          element['pokemonSetsCount'] = list.pokemonSets.length;
          
          // if (i == data.length - 1) { // Keeps spinner active until all pokemonSetsCount is rendered
            this.sharedService.stopSpinner();
          // }
        });
      });

      if (data.length == 0) {
        this.sharedService.stopSpinner();
      }
    });
  }

  addFormatList() {
    this.sharedService.startSpinner();

    let name = this.formatListForm.value['formatListControl'];
    var model: FormatListAdd = {
        name: name
    };
    this.formatListService.create(model).subscribe((id) => {
      if (id != 0) {
        this.router.navigate(['/format-list/edit/', id]);
      } else {
        this.snackBar.open('Either this name already exists, or an error occurred', 'ERROR', {
          duration: 5000
        })

        this.sharedService.stopSpinner();
      }
    });
  }

  deleteFormatList(row) {
    this.sharedService.startSpinner();
    
    this.formatListService.delete(row.id).subscribe((success) => {
      if (success) {
        this.getAllFormatLists();
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
}
