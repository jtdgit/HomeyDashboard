using OfferteWizard.Core.Enums;

namespace OfferteWizard.Core.Models;

public class Klant
{
    public int Id { get; set; }
    public string Naam { get; set; } = string.Empty;
    public Branche Branche { get; set; }
    public BeheerOmvang BeheerOmvang { get; set; }
    public TemplateVersie TemplateVersie { get; set; }
    public string Contactpersoon { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
