using AutoMapper;
using RandomPokemonGenerator.Web.Dtos.FormatList;
using RandomPokemonGenerator.Web.Dtos.PokemonSet;
using RandomPokemonGenerator.Web.Models;

namespace RandomPokemonGenerator.Web
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<PokemonSet, GetPokemonSetDto>();
            CreateMap<AddPokemonSetDto, PokemonSet>();
            CreateMap<UpdatePokemonSetDto, PokemonSet>();

            CreateMap<FormatList, GetFormatListDto>();
            CreateMap<AddFormatListDto, FormatList>();
            CreateMap<UpdateFormatListDto, FormatList>();
        }
    }
}
