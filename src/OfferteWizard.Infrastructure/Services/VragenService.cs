using OfferteWizard.Core.Interfaces;
using OfferteWizard.Core.Models;

namespace OfferteWizard.Infrastructure.Services;

public class VragenService : IVragenService
{
    private readonly IThemaService _themaService;

    public VragenService(IThemaService themaService)
    {
        _themaService = themaService;
    }

    public List<Verdiepingsvraag> GetVragenVoorThemas(Klant klant, List<int> themaIds)
    {
        var themas = _themaService.GetThemasByIdsAsync(themaIds).GetAwaiter().GetResult();
        var alleVragen = themas.SelectMany(t => t.Verdiepingsvragen);

        return alleVragen.Where(v => VraagIsRelevant(v, klant)).ToList();
    }

    private static bool VraagIsRelevant(Verdiepingsvraag vraag, Klant klant)
    {
        if (vraag.BrancheFilter.HasValue && vraag.BrancheFilter.Value != klant.Branche)
            return false;
        if (vraag.BeheerOmvangFilter.HasValue && vraag.BeheerOmvangFilter.Value != klant.BeheerOmvang)
            return false;
        if (vraag.TemplateVersieFilter.HasValue && vraag.TemplateVersieFilter.Value != klant.TemplateVersie)
            return false;
        return true;
    }
}
