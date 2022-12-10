import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormatList } from 'src/app/models/format-list.model';
import { PokemonSet } from 'src/app/models/pokemon-set.model';
import { FormatListService } from 'src/app/services/format-list.service';
import { MyErrorStateMatcher } from 'src/app/services/my-error-state-matcher.service';
import { PokemonSetService } from 'src/app/services/pokemon-set.service';

@Component({
  selector: 'app-randomizer',
  templateUrl: './randomizer.component.html',
  styleUrls: ['./randomizer.component.scss']
})
export class RandomizerComponent implements OnInit {
  randomizerForm = new FormGroup({
    allowDuplicatesControl: new FormControl('', [ Validators.required ]),
    countInputControl: new FormControl('', [ Validators.required, Validators.min(1) ]),
    formatListControl: new FormControl('', [ Validators.required ])
  });
  matcher = new MyErrorStateMatcher();
  allFormatLists: FormatList[];
  randomizedTeams = '';

  teamOneSprites = [];
  teamTwoSprites = [];
  teamOneTextControl = new FormControl({value: '', disabled: true}, []);
  teamTwoTextControl = new FormControl({value: '', disabled: true}, []);
  teamOneRowLength = 23;
  teamTwoRowLength = 23;

  toggleVisibility = true;

  constructor(
    private formatListService: FormatListService,
    private pokemonSetService: PokemonSetService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAllFilterLists();
    // Set height of team export textarea
    this.teamOneTextControl.valueChanges.subscribe((data) => {
      this.teamOneRowLength = data.split(/\r\n|\r|\n/).length;
    });
    this.teamTwoTextControl.valueChanges.subscribe((data) => {
      this.teamTwoRowLength = data.split(/\r\n|\r|\n/).length;
    });
  }

  getAllFilterLists() {
    this.formatListService.getAll().subscribe((data) => {
      this.allFormatLists = data;
    });
  }
  
  runRandomizer() {
    // Get inputted FormatList, determine if there are enough PokemonSets, then randomly copies sets from it
    this.formatListService.get(this.randomizerForm.value['formatListControl']).subscribe((data) => {
      let countInput = this.randomizerForm.value['countInputControl'];
      let allowDuplicates = this.randomizerForm.value['allowDuplicatesControl'] == 1 ? true : false; // 1 if true, 0/null/undefined if false
      if (data.pokemonSets && ((allowDuplicates && data.pokemonSets?.length >= countInput) || (!allowDuplicates && data.pokemonSets?.length >= countInput * 2))) {
        let firstRandomizedTeam = this.getMultipleRandom(data.pokemonSets, countInput);
        let secondRandomizedTeam;
        if (allowDuplicates) {
          secondRandomizedTeam = this.getMultipleRandom(data.pokemonSets, countInput);
        } else {
          let filteredSets = data.pokemonSets.filter(el => !firstRandomizedTeam.includes(el));
          secondRandomizedTeam = this.getMultipleRandom(filteredSets, countInput);
        }
        // Set team sprites
        this.teamOneSprites = [];
        this.teamTwoSprites = [];
        firstRandomizedTeam.forEach((el) => { this.teamOneSprites.push(el.species.toLowerCase()); });
        secondRandomizedTeam.forEach((el) => { this.teamTwoSprites.push(el.species.toLowerCase()); });

        // Now pack the 2 teams, then unpack & export
        this.packToApi(firstRandomizedTeam, 1);
        this.packToApi(secondRandomizedTeam, 2);
      } else {
        this.snackBar.open('Either this format has not enough Pokemon sets, or an error occurred', 'ERROR', {
          duration: 5000
        })
      }
    });
  }

  getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  packToApi(data: PokemonSet[], team: number) {
    // Similar code to PokemonSetComponent's updateExport() but accounts for multiple
    let teraTypes = [];
    data.forEach((el) => { // Store tera types
      teraTypes.push(el.terastallizeType != null ? `Tera Type: ${el.terastallizeType}` : false);
    });
    
    let model = '';
    
    data.forEach((el) => {
      model += `` +
        `${el['name'] != null ? el['name'] : ''}` + `|` +
        `${el['species']}` + `|` + // validated
        `${el['item'] != null ? el['item'] : ''}` + `|` +
        `${el['ability']}` + `|` + // validated
        `${el['moveOne'] != null ? el['moveOne'] : ''}` + `,` +
        `${el['moveTwo'] != null ? el['moveTwo'] : ''}` + `,` +
        `${el['moveThree'] != null ? el['moveThree'] : ''}` + `,` +
        `${el['moveFour'] != null ? el['moveFour'] : ''}` + `|` +
        el['nature'] + `|` + // validated
        `${el['hpEffortValue'] != null ? el['hpEffortValue'] : 0}` + `,` +
        `${el['atkEffortValue'] != null ? el['atkEffortValue'] : 0}` + `,` +
        `${el['defEffortValue'] != null ? el['defEffortValue'] : 0}` + `,` +
        `${el['spaEffortValue'] != null ? el['spaEffortValue'] : 0}` + `,` +
        `${el['spdEffortValue'] != null ? el['spdEffortValue'] : 0}` + `,` +
        `${el['speEffortValue'] != null ? el['speEffortValue'] : 0}` + `|` +
        `${el['gender'] != null ? el['gender'].toUpperCase() : null}` + `|` + // can be null
        `${el['hpIndividualValue'] != null ? el['hpIndividualValue'] : 31}` + `,` +
        `${el['atkIndividualValue'] != null ? el['atkIndividualValue'] : 31}` + `,` +
        `${el['defIndividualValue'] != null ? el['defIndividualValue'] : 31}` + `,` +
        `${el['spaIndividualValue'] != null ? el['spaIndividualValue'] : 31}` + `,` +
        `${el['spdIndividualValue'] != null ? el['spdIndividualValue'] : 31}` + `,` +
        `${el['speIndividualValue'] != null ? el['speIndividualValue'] : 31}` + `|` +
        `|` + // shiny
        el['level'] + `|` // can be null
      + `]`; // happiness, pokeball, hidden power, gigantamax, dynamax level, tera type & then more Pokemon
    });

    model = model.slice(0, model.length - 1); // Get rid of trailing ]

    this.pokemonSetService.unpackAndExportSets(model).subscribe((data) => {
      // Finding all the occurrences of an element
      const indices = [0]; // Should be empty, but start with zero to use in later for-loop
      const element = "\n\n";
      let idx = data.indexOf(element);
      while (idx !== -1) {
        indices.push(idx);
        idx = data.indexOf(element, idx + 1);
      }
      indices.push(data.length - 1); // Index of last character

      let fullString = '';
      for (let i = 0; i < teraTypes.length; i++) {
        if (teraTypes[i]) { ////////////// also maybe change indices[i+1] + n <---- n to a different value
          fullString += data.slice(indices[i], indices[i+1] + 1) + teraTypes[i];
        } else { // If teraTypes[i] = false, don't add anything
          fullString += data.slice(indices[i], indices[i+1]);
        }
      }
      
      if (team == 1) {
        this.teamOneTextControl.patchValue(fullString);
      } else if (team == 2) {
        this.teamTwoTextControl.patchValue(fullString);
      }
    });
  }

  copyTeamOne() {
    navigator.clipboard.writeText(this.teamOneTextControl.value);
    this.snackBar.open('Copied team 1 to clipboard', 'SUCCESS', {
      duration: 3000
    })
  }

  copyTeamTwo() {
    navigator.clipboard.writeText(this.teamTwoTextControl.value);
    this.snackBar.open('Copied team 2 to clipboard', 'SUCCESS', {
      duration: 3000
    })
  }
}
