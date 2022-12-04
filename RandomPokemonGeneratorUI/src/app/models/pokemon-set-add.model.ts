export class PokemonSetAdd {
    constructor(
        public setName: string,
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
        public name?: string,
        public item?: string,
        public gender?: string,
        public level?: number,
        public terastallizeType?: string
    ) { }
}