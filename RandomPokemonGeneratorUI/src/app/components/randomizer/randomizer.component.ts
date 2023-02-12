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
  
  runRandomizer(fetchWithoutRandomizing?: boolean) {
    // Get inputted FormatList, determine if there are enough PokemonSets, then randomly copies sets from it
    this.formatListService.get(this.randomizerForm.value['formatListControl']).subscribe((data) => {
      let countInput = this.randomizerForm.value['countInputControl'];
      let allowDuplicates = this.randomizerForm.value['allowDuplicatesControl'] == 1 ? true : false; // 1 if true, 0/null/undefined if false
      allowDuplicates = fetchWithoutRandomizing ? true : allowDuplicates;
      
      // Limit 1 species per team
      let uniqueSpeciesSetsTuple;
      if (!fetchWithoutRandomizing) {
        uniqueSpeciesSetsTuple = this.shuffleSetsAndLimitSpecies(data.pokemonSets);
      } else {
        uniqueSpeciesSetsTuple = [data.pokemonSets.length, data.pokemonSets]; // Export all sets without caring about species count
      }
      // uniqueSpeciesSetsTuple[0] is set count, uniqueSpeciesSetsTuple[1] is array of Pokemon sets

      if ((allowDuplicates && uniqueSpeciesSetsTuple[0] >= countInput) || (!allowDuplicates && uniqueSpeciesSetsTuple[0] >= countInput * 2)) {
        let firstRandomizedTeam = !fetchWithoutRandomizing ? this.getMultipleRandom(uniqueSpeciesSetsTuple[1], countInput) : uniqueSpeciesSetsTuple[1];
        let secondRandomizedTeam;
        let reShuffledUniqueSpeciesSetsTuple;
        if (allowDuplicates) {
          // Allow duplicate sets & 1 species per team, but re-shuffle sets for each species (so when both teams have the same species, their sets can be different)
          if (!fetchWithoutRandomizing) {
            reShuffledUniqueSpeciesSetsTuple = this.shuffleSetsAndLimitSpecies(data.pokemonSets);
            secondRandomizedTeam = this.getMultipleRandom(reShuffledUniqueSpeciesSetsTuple[1], countInput);
          } else {
            secondRandomizedTeam = firstRandomizedTeam; // Export all sets without randomizing the team
          }
        } else {
          // Remove duplicate sets before limiting 1 species per team
          let filteredSets = data.pokemonSets.filter(el => !firstRandomizedTeam.includes(el));
          reShuffledUniqueSpeciesSetsTuple = this.shuffleSetsAndLimitSpecies(filteredSets);
          secondRandomizedTeam = this.getMultipleRandom(reShuffledUniqueSpeciesSetsTuple[1], countInput);
        }
        // Randomize who gets which team as the 2nd team will have less variety (if allowDuplicates is false), since their possible sets are picked from a sub-set
        const random = Math.random() < 0.5;

        // Set team sprites
        this.teamOneSprites = [];
        this.teamTwoSprites = [];
        firstRandomizedTeam.forEach((el) => { random ? this.teamOneSprites.push(el.species.toLowerCase()) : this.teamTwoSprites.push(el.species.toLowerCase()); });
        secondRandomizedTeam.forEach((el) => { random ? this.teamTwoSprites.push(el.species.toLowerCase()) : this.teamOneSprites.push(el.species.toLowerCase()); });

        // Now pack the 2 teams, then unpack & export
        this.packToApi(firstRandomizedTeam, random ? 1 : 2);
        this.packToApi(secondRandomizedTeam, !random ? 1 : 2);
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
