namespace RandomPokemonGenerator.Web.Libraries.Interfaces
{
    public interface ICachingHelper
    {
        public Task InvalidateCache(string tag);
    }
}
