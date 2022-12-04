using Microsoft.AspNetCore.Mvc;
using RandomPokemonGenerator.Web.Dtos.FormatList;
using RandomPokemonGenerator.Web.Services;

namespace RandomPokemonGenerator.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FormatListController : ControllerBase
    {
        private readonly IFormatListService _formatListService;
        public FormatListController(IFormatListService formatListService)
        {
            _formatListService = formatListService;
        }

        [HttpPost]
        public async Task<ActionResult<bool>> AddFormatList(AddFormatListDto newFormatList)
        {
            return Ok(await _formatListService.AddFormatList(newFormatList));
        }
        [HttpGet]
        public async Task<ActionResult<List<GetFormatListDto>>> GetAllFormatLists()
        {
            return Ok(await _formatListService.GetAllFormatLists());
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<GetFormatListDto>> GetFormatListById(int id)
        {
            return Ok(await _formatListService.GetFormatListById(id));
        }
        [HttpPut]
        public async Task<ActionResult<bool>> UpdateFormatList(UpdateFormatListDto updatedFormatList)
        {
            return Ok(await _formatListService.UpdateFormatList(updatedFormatList));
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteFormatList(int id)
        {
            return Ok(await _formatListService.DeleteFormatList(id));
        }
        [HttpPost("PokemonSet")]
        public async Task<ActionResult<bool>> AddFormatListPokemonSet(AddFormatListPokemonSetDto newFormatListPokemonSet)
        {
            return Ok(await _formatListService.AddFormatListPokemonSet(newFormatListPokemonSet));
        }
        [HttpDelete("PokemonSet")]
        public async Task<ActionResult<bool>> DeleteFormatListPokemonSet(AddFormatListPokemonSetDto deleteFormatListPokemonSet)
        {
            return Ok(await _formatListService.DeleteFormatListPokemonSet(deleteFormatListPokemonSet));
        }
    }
}
