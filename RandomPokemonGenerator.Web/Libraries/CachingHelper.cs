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
                InvalidateLastModIfExpired();

                bool isCacheFresh = lastModDate <= DateTime.Parse(ifModSince);

                if (!isCacheFresh)
                {
                    // Refresh lastModDate if cache is invalidated (when lastModDate has expired or data is updated)
                    lastModDate = DateTime.UtcNow;
                }

                return new CacheProperties() { IsCacheFresh = isCacheFresh, RefreshInterval = refreshInterval, LastModified = lastModDate };
            }
            else
            {
                // Refresh lastModDate if cache is invalidated (when no ifModSince request header exists)
                lastModDate = DateTime.UtcNow;
                return new CacheProperties() { IsCacheFresh = false, RefreshInterval = refreshInterval, LastModified = lastModDate };
            }
        }

        /// <summary>
        /// Forces cache revalidation by maximizing lastModDate, used in ShouldValidateCache()
        /// </summary>
        public static void InvalidateLastMod()
        {
            lastModDate = DateTime.MaxValue; // DateTime.UtcNow.AddSeconds(refreshInterval.TotalSeconds)
        }

        /// <summary>
        /// Forces cache revalidation if the DateTime.UtcNow is past lastModDate's expiry date
        /// </summary>
        private static void InvalidateLastModIfExpired()
        {
            if (DateTime.UtcNow - lastModDate >= refreshInterval)
            {
                InvalidateLastMod();
            }
        }
    }
}
