using OfferteWizard.Core.Enums;

namespace OfferteWizard.Web.Services;

public class AppState
{
    public int? HuidigeKlantId { get; set; }
    public Rol HuidigeRol { get; set; } = Rol.Klant;

    public event Action? OnChange;
    public void NotifyStateChanged() => OnChange?.Invoke();
}
