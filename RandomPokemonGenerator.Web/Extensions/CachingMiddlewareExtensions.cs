using RandomPokemonGenerator.Web.Libraries;

namespace RandomPokemonGenerator.Web.Extensions
{
    public static class CachingMiddlewareExtensions
    {
        public static void ConfigureCachingMiddleware(this IApplicationBuilder app)
        {
            app.Use(async (context, next) =>
            {
                if (context.Request.Method.Equals("PUT") || context.Request.Method.Equals("POST") ||
                    context.Request.Method.Equals("DELETE") || context.Request.Method.Equals("PATCH"))
                {
                    CachingHelper.InvalidateLastMod();
                }

                await next();
            });
        }
    }
}
