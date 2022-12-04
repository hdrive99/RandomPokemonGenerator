using Microsoft.EntityFrameworkCore;
using RandomPokemonGenerator.Web.Data;
using RandomPokemonGenerator.Web.Models;

namespace RandomPokemonGenerator.Web.Services
{
    public class PokemonSetService : IPokemonSetService
    {
        private readonly DataContext _context;
        public PokemonSetService(DataContext context)
        {
            _context = context;
        }
        public async Task<bool> AddPokemonSet(PokemonSet newPokemonSet)
        {
            try
            {
                _context.PokemonSets.Add(newPokemonSet);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async Task<List<PokemonSet>> GetAllPokemonSets()
        {
            return await _context.PokemonSets.ToListAsync();
        }
        public async Task<PokemonSet> GetPokemonSetById(int id)
        {
            return await _context.PokemonSets.FirstOrDefaultAsync(c => c.Id == id);
        }
        public async Task<bool> UpdatePokemonSet(PokemonSet updatedPokemonSet)
        {
            try
            {
                PokemonSet pokemonSet = await _context.PokemonSets.FirstOrDefaultAsync(c => c.Id == updatedPokemonSet.Id);
                pokemonSet.SetName = updatedPokemonSet.SetName;
                pokemonSet.Name = updatedPokemonSet.Name;
                pokemonSet.Species = updatedPokemonSet.Species;
                pokemonSet.Item = updatedPokemonSet.Item;
                pokemonSet.Ability = updatedPokemonSet.Ability;
                pokemonSet.MoveOne = updatedPokemonSet.MoveOne;
                pokemonSet.MoveTwo = updatedPokemonSet.MoveTwo;
                pokemonSet.MoveThree = updatedPokemonSet.MoveThree;
                pokemonSet.MoveFour = updatedPokemonSet.MoveFour;
                pokemonSet.Nature = updatedPokemonSet.Nature;
                pokemonSet.HpEffortValue = updatedPokemonSet.HpEffortValue;
                pokemonSet.AtkEffortValue = updatedPokemonSet.AtkEffortValue;
                pokemonSet.DefEffortValue = updatedPokemonSet.DefEffortValue;
                pokemonSet.SpaEffortValue = updatedPokemonSet.SpaEffortValue;
                pokemonSet.SpdEffortValue = updatedPokemonSet.SpdEffortValue;
                pokemonSet.SpeEffortValue = updatedPokemonSet.SpeEffortValue;
                pokemonSet.Gender = updatedPokemonSet.Gender;
                pokemonSet.HpIndividualValue = updatedPokemonSet.HpIndividualValue;
                pokemonSet.AtkIndividualValue = updatedPokemonSet.AtkIndividualValue;
                pokemonSet.DefIndividualValue = updatedPokemonSet.DefIndividualValue;
                pokemonSet.SpaIndividualValue = updatedPokemonSet.SpaIndividualValue;
                pokemonSet.SpdIndividualValue = updatedPokemonSet.SpdIndividualValue;
                pokemonSet.SpeIndividualValue = updatedPokemonSet.SpeIndividualValue;
                pokemonSet.Level = updatedPokemonSet.Level;
                pokemonSet.TerastallizeType = updatedPokemonSet.TerastallizeType;
                pokemonSet.FormatLists = updatedPokemonSet.FormatLists;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async Task<bool> DeletePokemonSet(int id)
        {
            try
            {
                PokemonSet pokemonSet = await _context.PokemonSets.FirstOrDefaultAsync(c => c.Id == id);
                _context.PokemonSets.Remove(pokemonSet);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
