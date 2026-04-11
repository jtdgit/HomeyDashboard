using OfferteWizard.Core.Enums;

namespace OfferteWizard.Core.Models;

public class Verdiepingsvraag
{
    public int Id { get; set; }
    public int ThemaId { get; set; }
    public string VraagTekst { get; set; } = string.Empty;
    public VraagType Type { get; set; }
    public string? Opties { get; set; } // JSON array voor meerkeuze
    public decimal ExtraDagenBijJa { get; set; }
    public decimal ComplexiteitsFactor { get; set; } = 1.0m;

    // Filters: null = altijd tonen
    public Branche? BrancheFilter { get; set; }
    public BeheerOmvang? BeheerOmvangFilter { get; set; }
    public TemplateVersie? TemplateVersieFilter { get; set; }

    public OptimalisatieThema? Thema { get; set; }
}
