using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RandomPokemonGenerator.Web.Data;
using RandomPokemonGenerator.Web.Dtos.FormatList;
using RandomPokemonGenerator.Web.Models;

namespace RandomPokemonGenerator.Web.Services
{
    public class FormatListService : IFormatListService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public FormatListService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<bool> AddFormatList(AddFormatListDto newFormatList)
        {
            try
            {
                if (!_context.FormatLists.Any(c => c.Name == newFormatList.Name))
                {
                    throw new Exception();
                }
                _context.FormatLists.Add(_mapper.Map<FormatList>(newFormatList));
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async Task<List<GetFormatListDto>> GetAllFormatLists()
        {
            return await _context.FormatLists.Select(c => _mapper.Map<GetFormatListDto>(c)).ToListAsync();
        }
        public async Task<GetFormatListDto> GetFormatListById(int id)
        {
            return _mapper.Map<GetFormatListDto>(await _context.FormatLists.FirstOrDefaultAsync(c => c.Id == id));
        }
        public async Task<bool> UpdateFormatList(UpdateFormatListDto updatedFormatList)
        {
            try
            {
                FormatList formatList = await _context.FormatLists.FirstOrDefaultAsync(c => c.Id == updatedFormatList.Id);
                formatList.Name = updatedFormatList.Name;
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
