import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FormatListAdd } from 'src/app/models/format-list-add.model';
import { FormatListService } from 'src/app/services/format-list.service';
import { MyErrorStateMatcher } from 'src/app/services/my-error-state-matcher.service';

@Component({
  selector: 'app-format-lists',
  templateUrl: './format-lists.component.html',
  styleUrls: ['./format-lists.component.scss']
})
export class FormatListsComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  displayedColumns = ['id', 'name', 'pokemonSetsCount'];
  tableColumnNames = ['ID', 'Name', '# of Pokemon Sets'];
  columnsToDisplayWithExpand = ['id', 'name', 'pokemonSetsCount', 'delete'];
  @ViewChild(MatSort) sort: MatSort;

  formatListForm = new FormGroup({
    formatListControl: new FormControl('', [ Validators.required ])
  });
  matcher = new MyErrorStateMatcher();

  constructor(
    private formatListService: FormatListService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAllFormatLists();
  }

  getAllFormatLists() {
    this.formatListService.getAll().pipe(
      map((data) => {
        data.forEach(element => {
          element['pokemonSetsCount'] = element['pokemonSets'].length;
        });
        return data;
      })
    ).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
  }

  addFormatList() {
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
      }
    });
  }

  deleteFormatList(row) {
    this.formatListService.delete(row.id).subscribe((success) => {
      if (success) {
        this.getAllFormatLists();
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
}
