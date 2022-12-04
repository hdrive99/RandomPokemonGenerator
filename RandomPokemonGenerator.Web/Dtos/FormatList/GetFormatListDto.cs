using RandomPokemonGenerator.Web.Dtos.PokemonSet;

namespace RandomPokemonGenerator.Web.Dtos.FormatList
{
    public class GetFormatListDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<GetPokemonSetDto>? PokemonSets { get; set; }
    }
}
