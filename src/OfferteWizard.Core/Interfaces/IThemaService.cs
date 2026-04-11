using OfferteWizard.Core.Models;

namespace OfferteWizard.Core.Interfaces;

public interface IThemaService
{
    Task<List<OptimalisatieThema>> GetAlleThemasAsync();
    Task<List<OptimalisatieThema>> GetThemasByIdsAsync(List<int> ids);
}
