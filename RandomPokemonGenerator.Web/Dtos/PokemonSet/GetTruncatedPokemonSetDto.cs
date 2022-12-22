namespace RandomPokemonGenerator.Web.Dtos.PokemonSet
{
    public class GetTruncatedPokemonSetDto
    {
        public int Id { get; set; }
        public string SetName { get; set; }
        public string Species { get; set; }
        public string? Item { get; set; }
        public string Ability { get; set; }
        public string Nature { get; set; }
        public int? Level { get; set; }
        public string? TerastallizeType { get; set; }
        public List<Models.FormatList>? FormatLists { get; set; }
    }
}
