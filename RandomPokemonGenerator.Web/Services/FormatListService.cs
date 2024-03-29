﻿using AutoMapper;
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
        public async Task<int> AddFormatList(AddFormatListDto newFormatList)
        {
            try
            {
                if (_context.FormatLists.Any(c => c.Name == newFormatList.Name))
                {
                    throw new Exception();
                }
                _context.FormatLists.Add(_mapper.Map<FormatList>(newFormatList));
                await _context.SaveChangesAsync();
                var addedFormatList = await _context.FormatLists.FirstOrDefaultAsync(c => c.Name == newFormatList.Name);
                return addedFormatList.Id;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
        public async Task<List<GetFormatListDto>> GetAllFormatLists()
        {
            return await _context.FormatLists.Select(c => _mapper.Map<GetFormatListDto>(c)).ToListAsync();
        }
        public async Task<GetFormatListDto> GetFormatListById(int id)
        {
            return _mapper.Map<GetFormatListDto>(await _context.FormatLists.Include(c => c.PokemonSets).FirstOrDefaultAsync(c => c.Id == id));
        }
        public async Task<bool> UpdateFormatList(UpdateFormatListDto updatedFormatList)
        {
            try
            {
                if (_context.FormatLists.Any(c => c.Name == updatedFormatList.Name && c.Id != updatedFormatList.Id))
                {
                    throw new Exception();
                }
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

        public async Task<bool> AddFormatListPokemonSet(AddFormatListPokemonSetDto newFormatListPokemonSet)
        {
            try
            {
                var formatList = await _context.FormatLists.Include(c => c.PokemonSets).FirstOrDefaultAsync(c => c.Id == newFormatListPokemonSet.FormatListId);
                var pokemonSet = await _context.PokemonSets.FirstOrDefaultAsync(c => c.Id == newFormatListPokemonSet.PokemonSetId);
                formatList.PokemonSets.Add(pokemonSet);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> DeleteFormatListPokemonSet(AddFormatListPokemonSetDto deleteFormatListPokemonSet)
        {
            try
            {
                var formatList = await _context.FormatLists.Include(c => c.PokemonSets).FirstOrDefaultAsync(c => c.Id == deleteFormatListPokemonSet.FormatListId);
                var pokemonSet = await _context.PokemonSets.FirstOrDefaultAsync(c => c.Id == deleteFormatListPokemonSet.PokemonSetId);
                if (!formatList.PokemonSets.Contains(pokemonSet))
                {
                    throw new Exception();
                }
                formatList.PokemonSets.Remove(pokemonSet);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<string> ClonePokemonSetsFromFormatList(int fromFormatListId, int toFormatListId)
        {
            var fromFormatList = await _context.FormatLists.Include(c => c.PokemonSets).FirstOrDefaultAsync(c => c.Id == fromFormatListId);
            var toFormatList = await _context.FormatLists.Include(c => c.PokemonSets).FirstOrDefaultAsync(c => c.Id == toFormatListId);

            try
            {
                for (int i = 0; i < fromFormatList.PokemonSets.Count; i++)
                {
                    var setId = fromFormatList.PokemonSets[i].Id;
                    var pokemonSet = await _context.PokemonSets.FirstOrDefaultAsync(c => c.Id == setId);
                    toFormatList.PokemonSets.Add(pokemonSet);
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            try
            {
                await _context.SaveChangesAsync();
                return "Successfully saved changes to database.";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
