using Microsoft.EntityFrameworkCore;
using RandomPokemonGenerator.Web.Models;

namespace RandomPokemonGenerator.Web.Data
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            //
        }

        public DbSet<PokemonSet> PokemonSets { get; set; }
        public DbSet<FormatList> FormatLists { get; set; }
    }
}
