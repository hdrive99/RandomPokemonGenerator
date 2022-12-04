using RandomPokemonGenerator.Web.Models;

namespace RandomPokemonGenerator.Web.Services
{
    public interface IFormatListService
    {
        Task<bool> AddFormatList(FormatList newFormatList);
        Task<List<FormatList>> GetAllFormatLists();
        Task<FormatList> GetFormatListById(int id);
        Task<bool> UpdateFormatList(FormatList updatedFormatList);
        Task<bool> DeleteFormatList(int id);
    }
}
