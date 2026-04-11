using OfferteWizard.Core.Enums;

namespace OfferteWizard.Core.Models;

public class OfferteRegel
{
    public int Id { get; set; }
    public int OfferteAanvraagId { get; set; }
    public int ThemaId { get; set; }
    public decimal BerekendeDagen { get; set; }
    public decimal? AangepasteDagen { get; set; }
    public ConsultantType ConsultantType { get; set; }
    public decimal Dagtarief { get; set; }
    public decimal Subtotaal { get; set; }
    public string Toelichting { get; set; } = string.Empty;

    public OfferteAanvraag? OfferteAanvraag { get; set; }
    public OptimalisatieThema? Thema { get; set; }
}
