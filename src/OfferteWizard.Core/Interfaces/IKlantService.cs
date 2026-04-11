using OfferteWizard.Core.Models;

namespace OfferteWizard.Core.Interfaces;

public interface IKlantService
{
    Task<List<Klant>> GetAlleKlantenAsync();
    Task<Klant?> GetKlantByIdAsync(int id);
}
