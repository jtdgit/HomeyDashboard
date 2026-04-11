namespace OfferteWizard.Core.Models;

public class OfferteIndicatie
{
    public int ThemaId { get; set; }
    public string ThemaNaam { get; set; } = string.Empty;
    public decimal MinDagen { get; set; }
    public decimal MaxDagen { get; set; }
    public decimal MinKosten { get; set; }
    public decimal MaxKosten { get; set; }
}
