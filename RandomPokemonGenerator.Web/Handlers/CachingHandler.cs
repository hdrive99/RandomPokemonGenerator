using Microsoft.AspNetCore.Mvc;
using RandomPokemonGenerator.Web.Libraries;

namespace RandomPokemonGenerator.Web.Handlers
{
    public static class CachingHandler
    {
        public static Boolean IsCacheFreshHandler(this HttpResponse response, HttpRequest request)
        {
            ObjectResult result;
            CacheProperties cacheTuple = CachingHelper.ShouldValidateCache(request);
            if (cacheTuple.IsCacheFresh)
            {
                response.GetTypedHeaders().CacheControl =
                new Microsoft.Net.Http.Headers.CacheControlHeaderValue()
                {
                    Public = true,
                    MaxAge = cacheTuple.RefreshInterval,
                    NoCache = true
                };
                response.Headers[Microsoft.Net.Http.Headers.HeaderNames.Vary] =
                    new string[] { "Accept-Encoding" };

                return true;
            }
            else
            {
                response.GetTypedHeaders().CacheControl =
                new Microsoft.Net.Http.Headers.CacheControlHeaderValue()
                {
                    Public = true,
                    MaxAge = cacheTuple.RefreshInterval,
                    NoCache = true
                };
                response.Headers[Microsoft.Net.Http.Headers.HeaderNames.Vary] =
                    new string[] { "Accept-Encoding" };
                response.Headers.Add("Last-Modified", cacheTuple.LastModified.ToString("o"));

                return false;
            }
        }
    }
}
