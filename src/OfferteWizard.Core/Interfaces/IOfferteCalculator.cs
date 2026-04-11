using OfferteWizard.Core.Models;

namespace OfferteWizard.Core.Interfaces;

public interface IOfferteCalculator
{
    List<BerekendResultaat> Bereken(Klant klant, List<OptimalisatieThema> themas, List<VraagAntwoord> antwoorden);
    List<OfferteIndicatie> BerekenIndicatie(Klant klant, List<OptimalisatieThema> themas);
}
