using Microsoft.EntityFrameworkCore;
using OfferteWizard.Core.Enums;
using OfferteWizard.Core.Models;

namespace OfferteWizard.Infrastructure.Data;

public static class SeedData
{
    public static void Seed(ModelBuilder modelBuilder)
    {
        SeedKlanten(modelBuilder);
        SeedThemas(modelBuilder);
        SeedVerdiepingsvragen(modelBuilder);
    }

    private static void SeedKlanten(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Klant>().HasData(
            new Klant { Id = 1, Naam = "Gemeente Voorbeeld", Branche = Branche.Overheid, BeheerOmvang = BeheerOmvang.Groot, TemplateVersie = TemplateVersie.Recent, Contactpersoon = "Jan de Vries", Email = "j.devries@gemeentevoorbeeld.nl" },
            new Klant { Id = 2, Naam = "Hogeschool Innovatie", Branche = Branche.Onderwijs, BeheerOmvang = BeheerOmvang.Middel, TemplateVersie = TemplateVersie.Oud, Contactpersoon = "Lisa Bakker", Email = "l.bakker@hsinnovatie.nl" },
            new Klant { Id = 3, Naam = "Zorggroep Harmonie", Branche = Branche.Zorg, BeheerOmvang = BeheerOmvang.Klein, TemplateVersie = TemplateVersie.Actueel, Contactpersoon = "Peter Jansen", Email = "p.jansen@zorgharmonie.nl" },
            new Klant { Id = 4, Naam = "TechBedrijf Solutions", Branche = Branche.Commercieel, BeheerOmvang = BeheerOmvang.Middel, TemplateVersie = TemplateVersie.Actueel, Contactpersoon = "Sandra Willemsen", Email = "s.willemsen@techsolutions.nl" },
            new Klant { Id = 5, Naam = "Provincie Noord", Branche = Branche.Overheid, BeheerOmvang = BeheerOmvang.Klein, TemplateVersie = TemplateVersie.Oud, Contactpersoon = "Mark Smit", Email = "m.smit@provincienoord.nl" }
        );
    }

    private static void SeedThemas(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OptimalisatieThema>().HasData(
            new OptimalisatieThema { Id = 1, Naam = "HRM", Beschrijving = "Optimalisatie van HR-processen zoals verlof, verzuim, beoordeling en personeelsbeheer.", Categorie = "Personeel", Icoon = "People", BasisDagen = 3m, MinDagen = 2m, MaxDagen = 10m },
            new OptimalisatieThema { Id = 2, Naam = "Payroll", Beschrijving = "Optimalisatie van salarisverwerking, looncomponenten en fiscale inrichting.", Categorie = "Personeel", Icoon = "Payments", BasisDagen = 4m, MinDagen = 2m, MaxDagen = 12m },
            new OptimalisatieThema { Id = 3, Naam = "Financieel", Beschrijving = "Optimalisatie van financiële administratie, rapportages en budgetbeheer.", Categorie = "Financiën", Icoon = "AccountBalance", BasisDagen = 3.5m, MinDagen = 2m, MaxDagen = 10m },
            new OptimalisatieThema { Id = 4, Naam = "Workflows", Beschrijving = "Optimalisatie van goedkeuringsprocessen, signaleringen en automatische acties.", Categorie = "Processen", Icoon = "AccountTree", BasisDagen = 3m, MinDagen = 1m, MaxDagen = 8m },
            new OptimalisatieThema { Id = 5, Naam = "Rapportages", Beschrijving = "Optimalisatie van managementrapportages, dashboards en data-analyse.", Categorie = "Informatie", Icoon = "BarChart", BasisDagen = 2.5m, MinDagen = 1m, MaxDagen = 8m },
            new OptimalisatieThema { Id = 6, Naam = "Integraties", Beschrijving = "Optimalisatie van koppelingen met externe systemen en datastromen.", Categorie = "Technisch", Icoon = "Hub", BasisDagen = 4m, MinDagen = 2m, MaxDagen = 15m }
        );
    }

    private static void SeedVerdiepingsvragen(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Verdiepingsvraag>().HasData(
            // HRM vragen
            new Verdiepingsvraag { Id = 1, ThemaId = 1, VraagTekst = "Maakt u gebruik van digitale beoordelingscycli?", Type = VraagType.JaNee, ExtraDagenBijJa = 1m, ComplexiteitsFactor = 1.0m },
            new Verdiepingsvraag { Id = 2, ThemaId = 1, VraagTekst = "Hoeveel verschillende verlofsoorten worden gebruikt?", Type = VraagType.MeerkeuzeEnkel, Opties = "[\"1-5\",\"6-10\",\"Meer dan 10\"]", ExtraDagenBijJa = 0.5m, ComplexiteitsFactor = 1.1m },
            new Verdiepingsvraag { Id = 3, ThemaId = 1, VraagTekst = "Zijn er complexe CAO-regelingen van toepassing?", Type = VraagType.JaNee, ExtraDagenBijJa = 1.5m, ComplexiteitsFactor = 1.2m, BrancheFilter = Branche.Overheid },
            new Verdiepingsvraag { Id = 4, ThemaId = 1, VraagTekst = "Werkt u met functiebouwwerk en competentieprofielen?", Type = VraagType.JaNee, ExtraDagenBijJa = 1m, ComplexiteitsFactor = 1.1m, BrancheFilter = Branche.Onderwijs },

            // Payroll vragen
            new Verdiepingsvraag { Id = 5, ThemaId = 2, VraagTekst = "Hoeveel looncomponenten zijn actief?", Type = VraagType.MeerkeuzeEnkel, Opties = "[\"1-20\",\"21-50\",\"Meer dan 50\"]", ExtraDagenBijJa = 1m, ComplexiteitsFactor = 1.2m },
            new Verdiepingsvraag { Id = 6, ThemaId = 2, VraagTekst = "Wordt er gewerkt met meerdere CAO's?", Type = VraagType.JaNee, ExtraDagenBijJa = 2m, ComplexiteitsFactor = 1.3m },
            new Verdiepingsvraag { Id = 7, ThemaId = 2, VraagTekst = "Is er sprake van WNT-verantwoording?", Type = VraagType.JaNee, ExtraDagenBijJa = 1m, ComplexiteitsFactor = 1.2m, BrancheFilter = Branche.Zorg },
            new Verdiepingsvraag { Id = 8, ThemaId = 2, VraagTekst = "Heeft u actualisatie van fiscale inrichting nodig vanwege oudere templateversie?", Type = VraagType.JaNee, ExtraDagenBijJa = 2m, ComplexiteitsFactor = 1.3m, TemplateVersieFilter = TemplateVersie.Oud },

            // Financieel vragen
            new Verdiepingsvraag { Id = 9, ThemaId = 3, VraagTekst = "Hoeveel administraties worden gevoerd?", Type = VraagType.MeerkeuzeEnkel, Opties = "[\"1-3\",\"4-10\",\"Meer dan 10\"]", ExtraDagenBijJa = 1m, ComplexiteitsFactor = 1.1m },
            new Verdiepingsvraag { Id = 10, ThemaId = 3, VraagTekst = "Wordt er gewerkt met projectadministratie?", Type = VraagType.JaNee, ExtraDagenBijJa = 1.5m, ComplexiteitsFactor = 1.2m },
            new Verdiepingsvraag { Id = 11, ThemaId = 3, VraagTekst = "Zijn er specifieke SiSa/IV3-rapportageverplichtingen?", Type = VraagType.JaNee, ExtraDagenBijJa = 2m, ComplexiteitsFactor = 1.3m, BrancheFilter = Branche.Overheid },

            // Workflows vragen
            new Verdiepingsvraag { Id = 12, ThemaId = 4, VraagTekst = "Hoeveel goedkeuringsprocessen zijn er ingericht?", Type = VraagType.MeerkeuzeEnkel, Opties = "[\"1-5\",\"6-15\",\"Meer dan 15\"]", ExtraDagenBijJa = 1m, ComplexiteitsFactor = 1.1m },
            new Verdiepingsvraag { Id = 13, ThemaId = 4, VraagTekst = "Is er sprake van meervoudige autorisatieniveaus?", Type = VraagType.JaNee, ExtraDagenBijJa = 1.5m, ComplexiteitsFactor = 1.3m, BrancheFilter = Branche.Overheid },
            new Verdiepingsvraag { Id = 14, ThemaId = 4, VraagTekst = "Moeten workflows worden gemigreerd vanuit een oudere inrichting?", Type = VraagType.JaNee, ExtraDagenBijJa = 2m, ComplexiteitsFactor = 1.4m, TemplateVersieFilter = TemplateVersie.Oud },
            new Verdiepingsvraag { Id = 15, ThemaId = 4, VraagTekst = "Wordt er gebruik gemaakt van signaleringen en automatische e-mails?", Type = VraagType.JaNee, ExtraDagenBijJa = 0.5m, ComplexiteitsFactor = 1.0m },

            // Rapportages vragen
            new Verdiepingsvraag { Id = 16, ThemaId = 5, VraagTekst = "Hoeveel aangepaste rapportages zijn er momenteel?", Type = VraagType.MeerkeuzeEnkel, Opties = "[\"1-10\",\"11-25\",\"Meer dan 25\"]", ExtraDagenBijJa = 1m, ComplexiteitsFactor = 1.1m },
            new Verdiepingsvraag { Id = 17, ThemaId = 5, VraagTekst = "Wilt u dashboards inrichten voor management?", Type = VraagType.JaNee, ExtraDagenBijJa = 1.5m, ComplexiteitsFactor = 1.2m },
            new Verdiepingsvraag { Id = 18, ThemaId = 5, VraagTekst = "Is er behoefte aan wettelijke verantwoordingsrapportages?", Type = VraagType.JaNee, ExtraDagenBijJa = 1m, ComplexiteitsFactor = 1.2m, BrancheFilter = Branche.Zorg },

            // Integraties vragen
            new Verdiepingsvraag { Id = 19, ThemaId = 6, VraagTekst = "Hoeveel externe koppelingen zijn actief?", Type = VraagType.MeerkeuzeEnkel, Opties = "[\"1-3\",\"4-8\",\"Meer dan 8\"]", ExtraDagenBijJa = 2m, ComplexiteitsFactor = 1.2m },
            new Verdiepingsvraag { Id = 20, ThemaId = 6, VraagTekst = "Zijn er koppelingen die niet meer correct functioneren?", Type = VraagType.JaNee, ExtraDagenBijJa = 2m, ComplexiteitsFactor = 1.3m },
            new Verdiepingsvraag { Id = 21, ThemaId = 6, VraagTekst = "Moet er een koppeling met een studentinformatiesysteem worden geoptimaliseerd?", Type = VraagType.JaNee, ExtraDagenBijJa = 2m, ComplexiteitsFactor = 1.3m, BrancheFilter = Branche.Onderwijs },
            new Verdiepingsvraag { Id = 22, ThemaId = 6, VraagTekst = "Moeten koppelingen worden aangepast vanwege templateversie-migratie?", Type = VraagType.JaNee, ExtraDagenBijJa = 2.5m, ComplexiteitsFactor = 1.4m, TemplateVersieFilter = TemplateVersie.Oud }
        );
    }
}
