import { PokemonSet } from "./pokemon-set.model";

export class FormatList {
    constructor(
        public id: number,
        public name: string,
        public pokemonSets?: PokemonSet[]
    ) { }
}