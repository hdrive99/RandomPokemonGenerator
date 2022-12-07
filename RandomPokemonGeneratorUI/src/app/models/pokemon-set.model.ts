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
        public HpEffortValue: number,
        public AtkEffortValue: number,
        public DefEffortValue: number,
        public SpaEffortValue: number,
        public SpdEffortValue: number,
        public SpeEffortValue: number,
        public HpIndividualValue: number,
        public AtkIndividualValue: number,
        public DefIndividualValue: number,
        public SpaIndividualValue: number,
        public SpdIndividualValue: number,
        public SpeIndividualValue: number,
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