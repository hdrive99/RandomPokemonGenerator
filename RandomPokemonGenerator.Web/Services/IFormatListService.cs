using RandomPokemonGenerator.Web.Dtos.FormatList;

namespace RandomPokemonGenerator.Web.Services
{
    public interface IFormatListService
    {
        Task<bool> AddFormatList(AddFormatListDto newFormatList);
        Task<List<GetFormatListDto>> GetAllFormatLists();
        Task<GetFormatListDto> GetFormatListById(int id);
        Task<bool> UpdateFormatList(UpdateFormatListDto updatedFormatList);
        Task<bool> DeleteFormatList(int id);
    }
}
