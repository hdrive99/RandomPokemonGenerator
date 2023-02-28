using Microsoft.AspNetCore.Mvc;
using RandomPokemonGenerator.Web.Dtos.PokemonSet;
using RandomPokemonGenerator.Web.Handlers;
using RandomPokemonGenerator.Web.Services;
using System.Net;

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
        public async Task<ActionResult<int>> AddPokemonSet(AddPokemonSetDto newPokemonSet)
        {
            return Ok(await _pokemonSetService.AddPokemonSet(newPokemonSet));
        }
        [HttpGet]
        public async Task<ActionResult<List<GetPokemonSetDto>>> GetAllPokemonSets()
        {
            if (CachingHandler.IsCacheFreshHandler(Response, Request))
            {
                return this.StatusCode((int)HttpStatusCode.NotModified);
            }
            else
            {
                return Ok(await _pokemonSetService.GetAllPokemonSets());
            }
        }
        [HttpGet("GetTruncated")]
        public async Task<ActionResult<List<GetTruncatedPokemonSetDto>>> GetAllTruncatedPokemonSets()
        {
            if (CachingHandler.IsCacheFreshHandler(Response, Request))
            {
                return this.StatusCode((int)HttpStatusCode.NotModified);
            }
            else
            {
                return Ok(await _pokemonSetService.GetAllTruncatedPokemonSets());
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<GetPokemonSetDto>> GetPokemonSetById(int id)
        {
            if (CachingHandler.IsCacheFreshHandler(Response, Request))
            {
                return this.StatusCode((int)HttpStatusCode.NotModified);
            }
            else
            {
                return Ok(await _pokemonSetService.GetPokemonSetById(id));
            }
        }
        [HttpPut]
        public async Task<ActionResult<bool>> UpdatePokemonSet(UpdatePokemonSetDto updatedPokemonSet)
        {
            return Ok(await _pokemonSetService.UpdatePokemonSet(updatedPokemonSet));
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeletePokemonSet(int id)
        {
            return Ok(await _pokemonSetService.DeletePokemonSet(id));
        }
        [HttpPost("FormatList")]
        public async Task<ActionResult<bool>> AddPokemonSetFormatList(AddPokemonSetFormatListDto newPokemonSetFormatList)
        {
            return Ok(await _pokemonSetService.AddPokemonSetFormatList(newPokemonSetFormatList));
        }
        [HttpDelete("FormatList")]
        public async Task<ActionResult<bool>> DeletePokemonSetFormatList(AddPokemonSetFormatListDto deletePokemonSetFormatList)
        {
            return Ok(await _pokemonSetService.DeletePokemonSetFormatList(deletePokemonSetFormatList));
        }
    }
}
