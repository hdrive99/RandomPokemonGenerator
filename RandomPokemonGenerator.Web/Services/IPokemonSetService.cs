using RandomPokemonGenerator.Web.Models;

namespace RandomPokemonGenerator.Web.Services
{
    public interface IPokemonSetService
    {
        Task<bool> AddPokemonSet(PokemonSet newPokemonSet);
        Task<List<PokemonSet>> GetAllPokemonSets();
        Task<PokemonSet> GetPokemonSetById(int id);
        Task<bool> UpdatePokemonSet(PokemonSet updatedPokemonSet);
        Task<bool> DeletePokemonSet(int id);
    }
}
