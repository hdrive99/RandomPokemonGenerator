using Microsoft.AspNetCore.OutputCaching;
using RandomPokemonGenerator.Web.Libraries.Interfaces;

namespace RandomPokemonGenerator.Web.Libraries
{
    public class CachingHelper : ICachingHelper
    {
        private readonly IOutputCacheStore _cache;
        [ActivatorUtilitiesConstructorAttribute]
        public CachingHelper(IOutputCacheStore cache)
        {
            _cache = cache;
        }

        public async Task InvalidateCache(string tag) {
            await _cache.EvictByTagAsync(tag, default);
        }
    }
}
