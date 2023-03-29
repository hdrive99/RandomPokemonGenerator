using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using RandomPokemonGenerator.Web.Dtos.PokemonSet;
using RandomPokemonGenerator.Web.Libraries.Interfaces;
using RandomPokemonGenerator.Web.Services;

namespace RandomPokemonGenerator.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PokemonSetController : ControllerBase
    {
        private readonly IPokemonSetService _pokemonSetService;
        private readonly ICachingHelper _cache;
        
        public PokemonSetController(IPokemonSetService pokemonSetService, ICachingHelper cache)
        {
            _pokemonSetService = pokemonSetService;
            _cache = cache;
        }

        [HttpPost]
        public async Task<ActionResult<int>> AddPokemonSet(AddPokemonSetDto newPokemonSet)
        {
            var result = await _pokemonSetService.AddPokemonSet(newPokemonSet);
            await _cache.InvalidateCache("Get");
            return Ok(result);
        }
        [HttpGet]
        [OutputCache(PolicyName = "GetTagPolicy")]
        public async Task<ActionResult<List<GetPokemonSetDto>>> GetAllPokemonSets()
        {
            return Ok(await _pokemonSetService.GetAllPokemonSets());
        }
        [HttpGet("GetTruncated")]
        [OutputCache(PolicyName = "GetTagPolicy")]
        public async Task<ActionResult<List<GetTruncatedPokemonSetDto>>> GetAllTruncatedPokemonSets()
        {
            return Ok(await _pokemonSetService.GetAllTruncatedPokemonSets());
        }
        [HttpGet("{id}")]
        [OutputCache(PolicyName = "GetTagPolicy")]
        public async Task<ActionResult<GetPokemonSetDto>> GetPokemonSetById(int id)
        {
            return Ok(await _pokemonSetService.GetPokemonSetById(id));
        }
        [HttpPut]
        public async Task<ActionResult<bool>> UpdatePokemonSet(UpdatePokemonSetDto updatedPokemonSet)
        {
            var result = await _pokemonSetService.UpdatePokemonSet(updatedPokemonSet);
            await _cache.InvalidateCache("Get");
            return Ok(result);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeletePokemonSet(int id)
        {
            var result = await _pokemonSetService.DeletePokemonSet(id);
            await _cache.InvalidateCache("Get");
            return Ok(result);
        }
        [HttpPost("FormatList")]
        public async Task<ActionResult<bool>> AddPokemonSetFormatList(AddPokemonSetFormatListDto newPokemonSetFormatList)
        {
            var result = await _pokemonSetService.AddPokemonSetFormatList(newPokemonSetFormatList);
            await _cache.InvalidateCache("Get");
            return Ok(result);
        }
        [HttpDelete("FormatList")]
        public async Task<ActionResult<bool>> DeletePokemonSetFormatList(AddPokemonSetFormatListDto deletePokemonSetFormatList)
        {
            var result = await _pokemonSetService.DeletePokemonSetFormatList(deletePokemonSetFormatList);
            await _cache.InvalidateCache("Get");
            return Ok(result);
        }
    }
}
