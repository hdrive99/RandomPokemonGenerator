import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormatList } from 'src/app/models/format-list.model';
import { PokemonSet } from 'src/app/models/pokemon-set.model';
import { FormatListService } from 'src/app/services/format-list.service';
import { MyErrorStateMatcher } from 'src/app/services/my-error-state-matcher.service';
import { PokemonSetService } from 'src/app/services/pokemon-set.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-randomizer',
  templateUrl: './randomizer.component.html',
  styleUrls: ['./randomizer.component.scss']
})
export class RandomizerComponent implements OnInit {
  randomizerForm = new FormGroup({
    allowDuplicatesControl: new FormControl(),
    teamSpeciesReusableControl: new FormControl(),
    countInputControl: new FormControl('', [ Validators.required, Validators.min(1) ]),
    formatListControl: new FormControl('', [ Validators.required ])
  });
  matcher = new MyErrorStateMatcher();
  allFormatLists: FormatList[];

  teamOneSprites = [];
  teamTwoSprites = [];
  teamThreeSprites = [];
  teamFourSprites = [];
  teamOneTextControl = new FormControl({value: '', disabled: true}, []);
  teamTwoTextControl = new FormControl({value: '', disabled: true}, []);
  teamThreeTextControl = new FormControl({value: '', disabled: true}, []);
  teamFourTextControl = new FormControl({value: '', disabled: true}, []);
  teamOneRowLength = 23;
  teamTwoRowLength = 23;
  teamThreeRowLength = 23;
  teamFourRowLength = 23;

  toggleVisibility = true;
  allowDuplicatesChecked: boolean;
  showFourTeams = false;

  constructor(
    private formatListService: FormatListService,
    private pokemonSetService: PokemonSetService,
    private snackBar: MatSnackBar,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.randomizerForm.get('allowDuplicatesControl').disable();
    this.getAllFilterLists();
    // Set height of team export textarea
    this.teamOneTextControl.valueChanges.subscribe((data) => {
      this.teamOneRowLength = data.split(/\r\n|\r|\n/).length;
    });
    this.teamTwoTextControl.valueChanges.subscribe((data) => {
      this.teamTwoRowLength = data.split(/\r\n|\r|\n/).length;
    });
    this.teamThreeTextControl.valueChanges.subscribe((data) => {
      this.teamThreeRowLength = data.split(/\r\n|\r|\n/).length;
    });
    this.teamFourTextControl.valueChanges.subscribe((data) => {
      this.teamFourRowLength = data.split(/\r\n|\r|\n/).length;
    });
  }

  getAllFilterLists() {
    this.sharedService.startSpinner();

    this.formatListService.getAll().subscribe((data) => {
      this.allFormatLists = data;

      this.sharedService.stopSpinner();
    });
  }
  
  runRandomizer(fetchWithoutRandomizing?: boolean, fourTeams?: boolean) {
    this.sharedService.startSpinner();
    
    if (!fourTeams) { this.showFourTeams = false; }

    // Get inputted FormatList, determine if there are enough PokemonSets, then randomly copies sets from it
    this.formatListService.get(this.randomizerForm.value['formatListControl']).subscribe((data) => {
      let countInput = this.randomizerForm.value['countInputControl'];
      let allowDuplicates = this.randomizerForm.value['allowDuplicatesControl'];
      let teamSpeciesReusable = this.randomizerForm.value['teamSpeciesReusableControl'];
      allowDuplicates = fetchWithoutRandomizing ? true : allowDuplicates;
      
      // Limit 1 species per team
      let uniqueSpeciesSetsTuple;
      if (!fetchWithoutRandomizing) {
        uniqueSpeciesSetsTuple = this.shuffleSetsAndLimitSpecies(data.pokemonSets);
      } else {
        uniqueSpeciesSetsTuple = [data.pokemonSets.length, data.pokemonSets]; // Export all sets without caring about species count
      }
      // uniqueSpeciesSetsTuple[0] is set count, uniqueSpeciesSetsTuple[1] is array of Pokemon sets

      if ((allowDuplicates && uniqueSpeciesSetsTuple[0] >= countInput) || (!allowDuplicates && uniqueSpeciesSetsTuple[0] >= countInput * (fourTeams ? 4 : 2))) {
        let firstRandomizedTeam = !fetchWithoutRandomizing ? this.getMultipleRandom(uniqueSpeciesSetsTuple[1], countInput) : uniqueSpeciesSetsTuple[1];
        let secondRandomizedTeam;
        let thirdRandomizedTeam;
        let fourthRandomizedTeam;
        let reShuffledUniqueSpeciesSetsTuple;
        if (allowDuplicates) {
          // Allow duplicate sets & 1 species per team, but re-shuffle sets for each species (so when both teams have the same species, their sets can be different)
          if (!fetchWithoutRandomizing) {
            reShuffledUniqueSpeciesSetsTuple = this.shuffleSetsAndLimitSpecies(data.pokemonSets);
            secondRandomizedTeam = this.getMultipleRandom(reShuffledUniqueSpeciesSetsTuple[1], countInput);
          } else {
            secondRandomizedTeam = firstRandomizedTeam; // Export all sets without randomizing the team
          }
        } else if (teamSpeciesReusable || fetchWithoutRandomizing) {
          // Remove duplicate sets before limiting 1 species per team
          let filteredSets = data.pokemonSets.filter(el => !firstRandomizedTeam.includes(el));
          reShuffledUniqueSpeciesSetsTuple = this.shuffleSetsAndLimitSpecies(filteredSets);
          secondRandomizedTeam = this.getMultipleRandom(reShuffledUniqueSpeciesSetsTuple[1], countInput);
        } else {
          // Remove duplicate sets & species by filtering on uniqueSpeciesSetsTuple[1]
          let filteredSets = uniqueSpeciesSetsTuple[1].filter(el => !firstRandomizedTeam.includes(el));
          secondRandomizedTeam = this.getMultipleRandom(filteredSets, countInput);

          if (fourTeams) {
            thirdRandomizedTeam = this.getMultipleRandom(filteredSets.filter(el => !secondRandomizedTeam.includes(el)), countInput);
            fourthRandomizedTeam = this.getMultipleRandom(filteredSets.filter(el => !thirdRandomizedTeam.includes(el)), countInput);
          }
        }
        // Randomize who gets which team as the 2nd team will have less variety (if allowDuplicates is false), since their possible sets are picked from a sub-set
        // Set team sprites
        this.teamOneSprites = [];
        this.teamTwoSprites = [];
        this.teamThreeSprites = [];
        this.teamFourSprites = [];
        const shuffled = !fourTeams ? this.getMultipleRandom([[this.teamOneSprites, 1], [this.teamTwoSprites, 2]], 2) : 
          this.getMultipleRandom([[this.teamOneSprites, 1], [this.teamTwoSprites, 2], [this.teamThreeSprites, 3], [this.teamFourSprites, 4]], 4);
        firstRandomizedTeam.forEach((el) => { shuffled[0][0].push(el.species.toLowerCase()); });
        secondRandomizedTeam.forEach((el) => { shuffled[1][0].push(el.species.toLowerCase()); });
        if (fourTeams) {
          thirdRandomizedTeam.forEach((el) => { shuffled[2][0].push(el.species.toLowerCase()); });
          fourthRandomizedTeam.forEach((el) => { shuffled[3][0].push(el.species.toLowerCase()); });
        }

        // Now pack the 2 teams, then unpack & export
        this.packToApi(firstRandomizedTeam, shuffled[0][1]);
        this.packToApi(secondRandomizedTeam, shuffled[1][1]);
        if (fourTeams) {
          this.packToApi(thirdRandomizedTeam, shuffled[2][1]);
          this.packToApi(fourthRandomizedTeam, shuffled[3][1]);

          this.showFourTeams = true;
        }
      } else {
        this.snackBar.open('This format does not have enough Pokemon sets or unique species', 'ERROR', {
          duration: 5000
        });
        // Reset output on fail
        this.teamOneSprites = [];
        this.teamTwoSprites = [];
        this.teamOneTextControl.patchValue('');
        this.teamTwoTextControl.patchValue('');
        this.teamOneRowLength = 23;
        this.teamTwoRowLength = 23;

        this.sharedService.stopSpinner();
      }
    });
  }

  shuffleSetsAndLimitSpecies(pokemonSets): any[] {
    let uniqueSpecies = []
    let uniqueSpeciesSets = []
    // First shuffle Sets so the first Set of each species isn't always the same
    const shuffled = [...pokemonSets].sort(() => 0.5 - Math.random());
    shuffled.forEach((c) => {
      // Delimit by - to consider variants with same dex-code
      let species = c.species;

      if (c.species.includes('-')) {
        species = c.species.split('-')[0];
      }

      if (!uniqueSpecies.includes(species.toLowerCase())) {
        uniqueSpecies.push(species.toLowerCase());
        uniqueSpeciesSets.push(c);
      }
    });
    let tuple = [uniqueSpecies.length, uniqueSpeciesSets];
    return tuple;
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
      } else if (team == 3) {
        this.teamThreeTextControl.patchValue(fullString);
      } else if (team == 4) {
        this.teamFourTextControl.patchValue(fullString);
      }

      this.sharedService.stopSpinner();
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

  copyTeamThree() {
    navigator.clipboard.writeText(this.teamThreeTextControl.value);
    this.snackBar.open('Copied team 3 to clipboard', 'SUCCESS', {
      duration: 3000
    })
  }

  copyTeamFour() {
    navigator.clipboard.writeText(this.teamFourTextControl.value);
    this.snackBar.open('Copied team 4 to clipboard', 'SUCCESS', {
      duration: 3000
    })
  }

  toggleAllowDuplicates() {
    if (this.randomizerForm.value['teamSpeciesReusableControl'] == true) {
      this.randomizerForm.get('allowDuplicatesControl').enable();
    } else {
      this.randomizerForm.get('allowDuplicatesControl').patchValue(false);
      this.randomizerForm.get('allowDuplicatesControl').disable();
    }
  }
}
