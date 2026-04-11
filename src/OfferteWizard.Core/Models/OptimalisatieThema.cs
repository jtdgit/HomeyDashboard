namespace OfferteWizard.Core.Models;

public class OptimalisatieThema
{
    public int Id { get; set; }
    public string Naam { get; set; } = string.Empty;
    public string Beschrijving { get; set; } = string.Empty;
    public string Categorie { get; set; } = string.Empty;
    public string Icoon { get; set; } = string.Empty; // MudBlazor icon name
    public decimal BasisDagen { get; set; }
    public decimal MinDagen { get; set; }
    public decimal MaxDagen { get; set; }
    public decimal DagtariefConsultant { get; set; } = 1250m;
    public decimal DagtariefSenior { get; set; } = 1500m;

    public List<Verdiepingsvraag> Verdiepingsvragen { get; set; } = new();
}
