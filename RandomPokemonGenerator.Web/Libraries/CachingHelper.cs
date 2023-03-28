using Microsoft.Extensions.Primitives;

namespace RandomPokemonGenerator.Web.Libraries
{
    public static class CachingHelper
    {
        private static DateTime lastModDate = DateTime.UtcNow;
        private static TimeSpan refreshInterval = TimeSpan.FromSeconds(31536000);
        public static DateTime LastModDate { get { return lastModDate; } set { lastModDate = value; } }
        public static TimeSpan RefreshInterval { get { return refreshInterval; } set { refreshInterval = value; } }
        public static CacheProperties ShouldValidateCache(HttpRequest request)
        {
            StringValues ifModSince;
            request.Headers.TryGetValue("If-Modified-Since", out ifModSince);

            if (!StringValues.IsNullOrEmpty(ifModSince))
            {
                RefreshLastModIfExpired();

                bool isCacheFresh = lastModDate <= DateTime.Parse(ifModSince);

                return new CacheProperties() { IsCacheFresh = isCacheFresh, RefreshInterval = refreshInterval, LastModified = lastModDate };
            }
            else
            {
                return new CacheProperties() { IsCacheFresh = false, RefreshInterval = refreshInterval, LastModified = lastModDate };
            }
        }

        public static void RefreshLastMod()
        {
            lastModDate = DateTime.UtcNow;
        }

        private static void RefreshLastModIfExpired()
        {
            if (DateTime.UtcNow - lastModDate >= refreshInterval)
            {
                RefreshLastMod();
            }
        }
    }
}
