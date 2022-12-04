namespace RandomPokemonGenerator.Web.Dtos.PokemonSet
{
    public class UpdatePokemonSetDto
    {
        public int Id { get; set; }
        public string SetName { get; set; }
        public string? Name { get; set; }
        public string Species { get; set; }
        public string? Item { get; set; }
        public string Ability { get; set; }
        public string MoveOne { get; set; }
        public string MoveTwo { get; set; }
        public string MoveThree { get; set; }
        public string MoveFour { get; set; }
        public string Nature { get; set; }
        public int HpEffortValue { get; set; }
        public int AtkEffortValue { get; set; }
        public int DefEffortValue { get; set; }
        public int SpaEffortValue { get; set; }
        public int SpdEffortValue { get; set; }
        public int SpeEffortValue { get; set; }
        public string? Gender { get; set; }
        public int HpIndividualValue { get; set; }
        public int AtkIndividualValue { get; set; }
        public int DefIndividualValue { get; set; }
        public int SpaIndividualValue { get; set; }
        public int SpdIndividualValue { get; set; }
        public int SpeIndividualValue { get; set; }
        // public char? Shiny { get; set; }
        public int? Level { get; set; }
        // public int? Happiness { get; set; }
        // public string? Pokeball { get; set; }
        // public string? HiddenPowerType { get; set; }
        // public string? Gigantamax { get; set; }
        // public int? DynamaxLevel { get; set; }
        public string? TerastallizeType { get; set; }
    }
}
