namespace RandomPokemonGenerator.Web.Libraries
{
    public struct CacheProperties
    {
        public Boolean IsCacheFresh { get; set; }
        public TimeSpan RefreshInterval { get; set; }
        public DateTime LastModified { get; set; }
    }
}
