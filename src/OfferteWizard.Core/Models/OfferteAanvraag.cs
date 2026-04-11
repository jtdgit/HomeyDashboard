using OfferteWizard.Core.Enums;

namespace OfferteWizard.Core.Models;

public class OfferteAanvraag
{
    public int Id { get; set; }
    public int KlantId { get; set; }
    public DateTime AanvraagDatum { get; set; } = DateTime.UtcNow;
    public OfferteStatus Status { get; set; } = OfferteStatus.Concept;
    public string? OpmerkingenKlant { get; set; }
    public string? OpmerkingenSuccesmanager { get; set; }
    public string? RedenTerugsturen { get; set; }

    public decimal TotaalDagen { get; set; }
    public decimal TotaalKosten { get; set; }

    public Klant? Klant { get; set; }
    public List<OfferteRegel> Regels { get; set; } = new();
}
