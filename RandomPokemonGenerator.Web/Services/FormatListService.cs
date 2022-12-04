using Microsoft.EntityFrameworkCore;
using RandomPokemonGenerator.Web.Data;
using RandomPokemonGenerator.Web.Models;

namespace RandomPokemonGenerator.Web.Services
{
    public class FormatListService : IFormatListService
    {
        private readonly DataContext _context;
        public FormatListService(DataContext context)
        {
            _context = context;
        }
        public async Task<bool> AddFormatList(FormatList newFormatList)
        {
            try
            {
                _context.FormatLists.Add(newFormatList);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async Task<List<FormatList>> GetAllFormatLists()
        {
            return await _context.FormatLists.ToListAsync();
        }
        public async Task<FormatList> GetFormatListById(int id)
        {
            return await _context.FormatLists.FirstOrDefaultAsync(c => c.Id == id);
        }
        public async Task<bool> UpdateFormatList(FormatList updatedFormatList)
        {
            try
            {
                FormatList formatList = await _context.FormatLists.FirstOrDefaultAsync(c => c.Id == updatedFormatList.Id);
                formatList.Name = updatedFormatList.Name;
                formatList.PokemonSets = updatedFormatList.PokemonSets;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async Task<bool> DeleteFormatList(int id)
        {
            try
            {
                FormatList formatList = await _context.FormatLists.FirstOrDefaultAsync(c => c.Id == id);
                _context.FormatLists.Remove(formatList);
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
