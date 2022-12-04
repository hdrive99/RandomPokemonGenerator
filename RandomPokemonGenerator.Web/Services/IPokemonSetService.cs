﻿using RandomPokemonGenerator.Web.Dtos.PokemonSet;

namespace RandomPokemonGenerator.Web.Services
{
    public interface IPokemonSetService
    {
        Task<bool> AddPokemonSet(AddPokemonSetDto newPokemonSet);
        Task<List<GetPokemonSetDto>> GetAllPokemonSets();
        Task<GetPokemonSetDto> GetPokemonSetById(int id);
        Task<bool> UpdatePokemonSet(UpdatePokemonSetDto updatedPokemonSet);
        Task<bool> DeletePokemonSet(int id);
    }
}
