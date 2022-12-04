using Microsoft.AspNetCore.Mvc;
using RandomPokemonGenerator.Web.Models;
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
        public async Task<ActionResult<bool>> AddFormatList(FormatList newFormatList)
        {
            return Ok(await _formatListService.AddFormatList(newFormatList));
        }
        [HttpGet]
        public async Task<ActionResult<List<FormatList>>> GetAllFormatLists()
        {
            return Ok(await _formatListService.GetAllFormatLists());
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<bool>> GetFormatListById(int id)
        {
            return Ok(await _formatListService.GetFormatListById(id));
        }
        [HttpPut]
        public async Task<ActionResult<bool>> UpdateFormatList(FormatList updatedFormatList)
        {
            return Ok(await _formatListService.UpdateFormatList(updatedFormatList));
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteFormatList(int id)
        {
            return Ok(await _formatListService.DeleteFormatList(id));
        }
    }
}
