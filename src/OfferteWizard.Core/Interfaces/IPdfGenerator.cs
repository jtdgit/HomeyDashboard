using OfferteWizard.Core.Models;

namespace OfferteWizard.Core.Interfaces;

public interface IPdfGenerator
{
    byte[] GenereerOffertePdf(OfferteAanvraag aanvraag);
}
