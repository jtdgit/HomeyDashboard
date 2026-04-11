using OfferteWizard.Core.Enums;
using OfferteWizard.Core.Interfaces;
using OfferteWizard.Core.Models;

namespace OfferteWizard.Infrastructure.Services;

public class OfferteCalculator : IOfferteCalculator
{
    public List<BerekendResultaat> Bereken(Klant klant, List<OptimalisatieThema> themas, List<VraagAntwoord> antwoorden)
    {
        var resultaten = new List<BerekendResultaat>();
        var brancheFactor = GetBrancheFactor(klant.Branche);
        var beheerFactor = GetBeheerFactor(klant.BeheerOmvang);
        var templateFactor = GetTemplateFactor(klant.TemplateVersie);

        foreach (var thema in themas)
        {
            var vragenExtra = BerekenVragenExtra(thema, antwoorden);
            var totaleFactor = brancheFactor * beheerFactor * templateFactor;
            var berekendeDagen = Math.Round(thema.BasisDagen * totaleFactor + vragenExtra, 1);

            // Respecteer min/max grenzen
            berekendeDagen = Math.Max(thema.MinDagen, Math.Min(thema.MaxDagen, berekendeDagen));

            var isComplex = totaleFactor > 1.4m || berekendeDagen > thema.BasisDagen * 2;
            var consultantType = isComplex ? ConsultantType.Senior : ConsultantType.Consultant;
            var dagtarief = consultantType == ConsultantType.Senior ? thema.DagtariefSenior : thema.DagtariefConsultant;

            resultaten.Add(new BerekendResultaat
            {
                ThemaId = thema.Id,
                ThemaNaam = thema.Naam,
                BasisDagen = thema.BasisDagen,
                BrancheFactor = brancheFactor,
                BeheerFactor = beheerFactor,
                TemplateFactor = templateFactor,
                VragenExtraDagen = vragenExtra,
                TotaalDagen = berekendeDagen,
                ConsultantType = consultantType,
                Dagtarief = dagtarief,
                Subtotaal = berekendeDagen * dagtarief
            });
        }

        return resultaten;
    }

    private static decimal GetBrancheFactor(Branche branche) => branche switch
    {
        Branche.Overheid => 1.30m,
        Branche.Zorg => 1.20m,
        Branche.Onderwijs => 1.10m,
        Branche.Commercieel => 1.00m,
        _ => 1.00m
    };

    private static decimal GetBeheerFactor(BeheerOmvang omvang) => omvang switch
    {
        BeheerOmvang.Klein => 1.25m,
        BeheerOmvang.Middel => 1.00m,
        BeheerOmvang.Groot => 0.90m,
        _ => 1.00m
    };

    private static decimal GetTemplateFactor(TemplateVersie versie) => versie switch
    {
        TemplateVersie.Oud => 1.40m,
        TemplateVersie.Recent => 1.15m,
        TemplateVersie.Actueel => 1.00m,
        _ => 1.00m
    };

    private static decimal BerekenVragenExtra(OptimalisatieThema thema, List<VraagAntwoord> antwoorden)
    {
        decimal extra = 0m;
        foreach (var vraag in thema.Verdiepingsvragen)
        {
            var antwoord = antwoorden.FirstOrDefault(a => a.VraagId == vraag.Id);
            if (antwoord == null) continue;

            if (vraag.Type == VraagType.JaNee && antwoord.Antwoord.Equals("Ja", StringComparison.OrdinalIgnoreCase))
            {
                extra += vraag.ExtraDagenBijJa;
            }
            else if (vraag.Type == VraagType.MeerkeuzeEnkel)
            {
                // Hogere opties = meer complexiteit
                var opties = System.Text.Json.JsonSerializer.Deserialize<string[]>(vraag.Opties ?? "[]") ?? [];
                var index = Array.IndexOf(opties, antwoord.Antwoord);
                if (index >= 0)
                {
                    extra += vraag.ExtraDagenBijJa * ((index + 1.0m) / opties.Length);
                }
            }
        }
        return Math.Round(extra, 1);
    }

    public List<OfferteIndicatie> BerekenIndicatie(Klant klant, List<OptimalisatieThema> themas)
    {
        var brancheFactor = GetBrancheFactor(klant.Branche);
        var beheerFactor = GetBeheerFactor(klant.BeheerOmvang);
        var templateFactor = GetTemplateFactor(klant.TemplateVersie);
        var totaleFactor = brancheFactor * beheerFactor * templateFactor;

        return themas.Select(thema =>
        {
            var minDagen = Math.Max(thema.MinDagen, Math.Round(thema.BasisDagen * totaleFactor, 1));
            var maxDagen = Math.Min(thema.MaxDagen, Math.Round(thema.BasisDagen * totaleFactor + thema.Verdiepingsvragen.Sum(v => v.ExtraDagenBijJa), 1));
            maxDagen = Math.Max(minDagen, maxDagen);

            var tariefLaag = thema.DagtariefConsultant;
            var tariefHoog = thema.DagtariefSenior;

            return new OfferteIndicatie
            {
                ThemaId = thema.Id,
                ThemaNaam = thema.Naam,
                MinDagen = minDagen,
                MaxDagen = maxDagen,
                MinKosten = minDagen * tariefLaag,
                MaxKosten = maxDagen * tariefHoog
            };
        }).ToList();
    }
}
