namespace RandomPokemonGenerator.Web.Models
{
    public class FormatList
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<PokemonSet>? PokemonSets { get; set; }
    }
}
