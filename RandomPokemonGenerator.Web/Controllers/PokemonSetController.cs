using Microsoft.AspNetCore.Mvc;
using RandomPokemonGenerator.Web.Models;
using RandomPokemonGenerator.Web.Services;

namespace RandomPokemonGenerator.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PokemonSetController : ControllerBase
    {
        private readonly IPokemonSetService _pokemonSetService;
        public PokemonSetController(IPokemonSetService pokemonSetService)
        {
            _pokemonSetService = pokemonSetService;
        }

        [HttpPost]
        public async Task<ActionResult<bool>> AddPokemonSet(PokemonSet newPokemonSet)
        {
            return Ok(await _pokemonSetService.AddPokemonSet(newPokemonSet));
        }
        [HttpGet]
        public async Task<ActionResult<List<PokemonSet>>> GetAllPokemonSets()
        {
            return Ok(await _pokemonSetService.GetAllPokemonSets());
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<PokemonSet>> GetPokemonSetById(int id)
        {
            return Ok(await _pokemonSetService.GetPokemonSetById(id));
        }
        [HttpPut]
        public async Task<ActionResult<bool>> UpdatePokemonSet(PokemonSet updatedPokemonSet)
        {
            return Ok(await _pokemonSetService.UpdatePokemonSet(updatedPokemonSet));
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeletePokemonSet(int id)
        {
            return Ok(await _pokemonSetService.DeletePokemonSet(id));
        }
    }
}
