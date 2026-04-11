using OfferteWizard.Core.Enums;

namespace OfferteWizard.Core.Models;

public class BerekendResultaat
{
    public int ThemaId { get; set; }
    public string ThemaNaam { get; set; } = string.Empty;
    public decimal BasisDagen { get; set; }
    public decimal BrancheFactor { get; set; }
    public decimal BeheerFactor { get; set; }
    public decimal TemplateFactor { get; set; }
    public decimal VragenExtraDagen { get; set; }
    public decimal TotaalDagen { get; set; }
    public ConsultantType ConsultantType { get; set; }
    public decimal Dagtarief { get; set; }
    public decimal Subtotaal { get; set; }
}
