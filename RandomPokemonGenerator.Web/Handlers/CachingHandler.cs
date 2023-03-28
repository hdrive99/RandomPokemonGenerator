using Microsoft.AspNetCore.Mvc;
using RandomPokemonGenerator.Web.Libraries;

namespace RandomPokemonGenerator.Web.Handlers
{
    public static class CachingHandler
    {
        public static Boolean IsCacheFreshHandler(this HttpResponse response, HttpRequest request)
        {
            CacheProperties cacheTuple = CachingHelper.ShouldValidateCache(request);

            response.GetTypedHeaders().CacheControl =
                new Microsoft.Net.Http.Headers.CacheControlHeaderValue()
                {
                    Public = true,
                    MaxAge = cacheTuple.RefreshInterval,
                    NoCache = true
                };
            response.Headers[Microsoft.Net.Http.Headers.HeaderNames.Vary] =
                new string[] { "Accept-Encoding" };

            if (cacheTuple.IsCacheFresh)
            {
                return true;
            }
            else
            {
                response.Headers.Add("Last-Modified", cacheTuple.LastModified.ToString("o"));

                return false;
            }
        }
    }
}
