using OfferteWizard.Core.Enums;
using OfferteWizard.Core.Models;

namespace OfferteWizard.Core.Interfaces;

public interface IOfferteService
{
    Task<OfferteAanvraag> MaakAanvraagAsync(int klantId, List<BerekendResultaat> resultaten, string? opmerkingen);
    Task<List<OfferteAanvraag>> GetAanvragenAsync(int? klantId = null);
    Task<OfferteAanvraag?> GetAanvraagByIdAsync(int id);
    Task<bool> UpdateStatusAsync(int id, OfferteStatus nieuweStatus, string? opmerking);
    Task<bool> BijstellenEnGoedkeurenAsync(int id, Dictionary<int, decimal?> aanpassingen, string? opmerking);
    Task<bool> TerugStudenAsync(int id, string reden);
}
