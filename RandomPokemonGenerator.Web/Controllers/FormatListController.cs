using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using RandomPokemonGenerator.Web.Dtos.FormatList;
using RandomPokemonGenerator.Web.Libraries.Interfaces;
using RandomPokemonGenerator.Web.Services;

namespace RandomPokemonGenerator.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FormatListController : ControllerBase
    {
        private readonly IFormatListService _formatListService;
        private readonly ICachingHelper _cache;
        public FormatListController(IFormatListService formatListService, ICachingHelper cache)
        {
            _formatListService = formatListService;
            _cache = cache;
        }

        [HttpPost]
        public async Task<ActionResult<int>> AddFormatList(AddFormatListDto newFormatList)
        {
            var result = await _formatListService.AddFormatList(newFormatList);
            await _cache.InvalidateCache("Get");
            return Ok(result);
        }
        [HttpGet]
        [OutputCache(PolicyName = "GetTagPolicy")]
        public async Task<ActionResult<List<GetFormatListDto>>> GetAllFormatLists()
        {
            return Ok(await _formatListService.GetAllFormatLists());
        }
        [HttpGet("{id}")]
        [OutputCache(PolicyName = "GetTagPolicy")]
        public async Task<ActionResult<GetFormatListDto>> GetFormatListById(int id)
        {
            return Ok(await _formatListService.GetFormatListById(id));
        }
        [HttpPut]
        public async Task<ActionResult<bool>> UpdateFormatList(UpdateFormatListDto updatedFormatList)
        {
            var result = await _formatListService.UpdateFormatList(updatedFormatList);
            
            return Ok(result);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteFormatList(int id)
        {
            var result = await _formatListService.DeleteFormatList(id);
            await _cache.InvalidateCache("Get");
            return Ok(result);
        }
        [HttpPost("PokemonSet")]
        public async Task<ActionResult<bool>> AddFormatListPokemonSet(AddFormatListPokemonSetDto newFormatListPokemonSet)
        {
            var result = await _formatListService.AddFormatListPokemonSet(newFormatListPokemonSet);
            await _cache.InvalidateCache("Get");
            return Ok(result);
        }
        [HttpDelete("PokemonSet")]
        public async Task<ActionResult<bool>> DeleteFormatListPokemonSet(AddFormatListPokemonSetDto deleteFormatListPokemonSet)
        {
            var result = await _formatListService.DeleteFormatListPokemonSet(deleteFormatListPokemonSet);
            await _cache.InvalidateCache("Get");
            return Ok(result);
        }

        [HttpPut("CloneList/{fromFormatListId}/{toFormatListId}")]
        public async Task<ActionResult<string>> ClonePokemonSetsFromFormatList(int fromFormatListId, int toFormatListId)
        {
            var result = await _formatListService.ClonePokemonSetsFromFormatList(fromFormatListId, toFormatListId);
            await _cache.InvalidateCache("Get");
            return Ok(result);
        }
    }
}
