using OfferteWizard.Core.Models;

namespace OfferteWizard.Core.Interfaces;

public interface IVragenService
{
    List<Verdiepingsvraag> GetVragenVoorThemas(Klant klant, List<int> themaIds);
}
