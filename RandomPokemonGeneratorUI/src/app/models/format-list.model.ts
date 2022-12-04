import { PokemonSet } from "./pokemon-set.model";

export class FormatList {
    constructor(
        public id: number,
        public name: string,
        public pokemonSetsCount: number,
        public deleteConfirm: boolean = false,
        public pokemonSets?: PokemonSet[]
    ) { }
}