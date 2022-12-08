import { FormatList } from "./format-list.model";

export class PokemonSet {
    constructor(
        public id: number,
        public setName: string,
        public species: string,
        public ability: string,
        public moveOne: string,
        public moveTwo: string,
        public moveThree: string,
        public moveFour: string,
        public hpEffortValue: number,
        public atkEffortValue: number,
        public defEffortValue: number,
        public spaEffortValue: number,
        public spdEffortValue: number,
        public speEffortValue: number,
        public hpIndividualValue: number,
        public atkIndividualValue: number,
        public defIndividualValue: number,
        public spaIndividualValue: number,
        public spdIndividualValue: number,
        public speIndividualValue: number,
        public deleteConfirm: boolean = false,
        public nature: string,
        public name?: string,
        public item?: string,
        public gender?: string,
        public level?: number,
        public terastallizeType?: string,
        public formatLists?: FormatList[]
    ) { }
}