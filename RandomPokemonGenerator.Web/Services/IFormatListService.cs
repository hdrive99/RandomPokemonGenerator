using RandomPokemonGenerator.Web.Dtos.FormatList;

namespace RandomPokemonGenerator.Web.Services
{
    public interface IFormatListService
    {
        Task<int> AddFormatList(AddFormatListDto newFormatList);
        Task<List<GetFormatListDto>> GetAllFormatLists();
        Task<GetFormatListDto> GetFormatListById(int id);
        Task<bool> UpdateFormatList(UpdateFormatListDto updatedFormatList);
        Task<bool> DeleteFormatList(int id);
        Task<bool> AddFormatListPokemonSet(AddFormatListPokemonSetDto newFormatListPokemonSet);
        Task<bool> DeleteFormatListPokemonSet(AddFormatListPokemonSetDto deleteFormatListPokemonSet);
    }
}
