using OfferteWizard.Core.Enums;
using OfferteWizard.Core.Interfaces;
using OfferteWizard.Core.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace OfferteWizard.Infrastructure.Pdf;

public class OffertePdfGenerator : IPdfGenerator
{
    // AFAS Brand Colors
    private const string AfasBlauw = "#005FAA";
    private const string AfasLichtBlauw = "#0074D0";
    private const string AfasOranje = "#F59F39";
    private const string AfasZwart = "#1A1F24";
    private const string AfasDonkerGrijs = "#41474D";
    private const string AfasLichtGrijs = "#C3CBD3";
    private const string AfasExtraLichtGrijs = "#F2F5F8";

    public byte[] GenereerOffertePdf(OfferteAanvraag aanvraag)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.MarginTop(1.5f, Unit.Centimetre);
                page.MarginBottom(1.5f, Unit.Centimetre);
                page.MarginHorizontal(2f, Unit.Centimetre);

                page.Header().Element(c => ComposeHeader(c));
                page.Content().Element(c => ComposeContent(c, aanvraag));
                page.Footer().Element(c => ComposeFooter(c));
            });
        });

        using var stream = new MemoryStream();
        document.GeneratePdf(stream);
        return stream.ToArray();
    }

    private static void ComposeHeader(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(col =>
            {
                col.Item().Text("AFAS Software®")
                    .FontSize(18).Bold().FontColor(AfasBlauw);
                col.Item().Text("Conceptofferte Optimalisatieproject")
                    .FontSize(12).FontColor(AfasDonkerGrijs);
            });

            row.ConstantItem(100).AlignRight().Text("CONCEPT")
                .FontSize(14).Bold().FontColor(AfasOranje);
        });

        container.PaddingBottom(10).LineHorizontal(2).LineColor(AfasBlauw);
    }

    private static void ComposeContent(IContainer container, OfferteAanvraag aanvraag)
    {
        container.PaddingVertical(10).Column(col =>
        {
            // Klantgegevens
            col.Item().Element(c => ComposeKlantInfo(c, aanvraag));
            col.Item().PaddingVertical(15);

            // Thema-specificatie tabel
            col.Item().Element(c => ComposeThemaOverzicht(c, aanvraag));
            col.Item().PaddingVertical(15);

            // Totaaloverzicht
            col.Item().Element(c => ComposeTotaal(c, aanvraag));
            col.Item().PaddingVertical(20);

            // Disclaimer
            col.Item().Element(c => ComposeDisclaimer(c));
        });
    }

    private static void ComposeKlantInfo(IContainer container, OfferteAanvraag aanvraag)
    {
        var klant = aanvraag.Klant;
        if (klant == null) return;

        container.Background(AfasExtraLichtGrijs).Padding(15).Column(col =>
        {
            col.Item().Text("Klantgegevens").FontSize(14).Bold().FontColor(AfasBlauw);
            col.Item().PaddingTop(5);

            col.Item().Row(row =>
            {
                row.RelativeItem().Column(left =>
                {
                    left.Item().Text($"Organisatie: {klant.Naam}").FontSize(10);
                    left.Item().Text($"Contactpersoon: {klant.Contactpersoon}").FontSize(10);
                    left.Item().Text($"E-mail: {klant.Email}").FontSize(10);
                });
                row.RelativeItem().Column(right =>
                {
                    right.Item().Text($"Branche: {klant.Branche}").FontSize(10);
                    right.Item().Text($"Beheerorganisatie: {FormatBeheerOmvang(klant.BeheerOmvang)}").FontSize(10);
                    right.Item().Text($"Templateversie: {FormatTemplateVersie(klant.TemplateVersie)}").FontSize(10);
                });
            });

            col.Item().PaddingTop(5).Text($"Aanvraagdatum: {aanvraag.AanvraagDatum:dd MMMM yyyy}")
                .FontSize(10).FontColor(AfasDonkerGrijs);
        });
    }

    private static void ComposeThemaOverzicht(IContainer container, OfferteAanvraag aanvraag)
    {
        container.Column(col =>
        {
            col.Item().Text("Specificatie per thema").FontSize(14).Bold().FontColor(AfasBlauw);
            col.Item().PaddingTop(10);

            col.Item().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn(3); // Thema
                    columns.RelativeColumn(1); // Dagen
                    columns.RelativeColumn(1.5f); // Type
                    columns.RelativeColumn(1.5f); // Dagtarief
                    columns.RelativeColumn(1.5f); // Subtotaal
                });

                // Header
                table.Header(header =>
                {
                    header.Cell().Background(AfasBlauw).Padding(5).Text("Thema").FontSize(10).Bold().FontColor(Colors.White);
                    header.Cell().Background(AfasBlauw).Padding(5).Text("Dagen").FontSize(10).Bold().FontColor(Colors.White);
                    header.Cell().Background(AfasBlauw).Padding(5).Text("Consultant").FontSize(10).Bold().FontColor(Colors.White);
                    header.Cell().Background(AfasBlauw).Padding(5).Text("Dagtarief").FontSize(10).Bold().FontColor(Colors.White);
                    header.Cell().Background(AfasBlauw).Padding(5).Text("Subtotaal").FontSize(10).Bold().FontColor(Colors.White);
                });

                // Rows
                var isAlternate = false;
                foreach (var regel in aanvraag.Regels)
                {
                    var bg = isAlternate ? AfasExtraLichtGrijs : "#FFFFFF";

                    table.Cell().Background(bg).Padding(5).Text(regel.Thema?.Naam ?? $"Thema {regel.ThemaId}").FontSize(10);
                    table.Cell().Background(bg).Padding(5).Text($"{regel.BerekendeDagen:0.#}").FontSize(10);
                    table.Cell().Background(bg).Padding(5).Text(regel.ConsultantType == ConsultantType.Senior ? "Senior" : "Consultant").FontSize(10);
                    table.Cell().Background(bg).Padding(5).Text($"€ {regel.Dagtarief:N0}").FontSize(10);
                    table.Cell().Background(bg).Padding(5).Text($"€ {regel.Subtotaal:N0}").FontSize(10);

                    isAlternate = !isAlternate;
                }
            });
        });
    }

    private static void ComposeTotaal(IContainer container, OfferteAanvraag aanvraag)
    {
        container.Background(AfasExtraLichtGrijs).Padding(15).Row(row =>
        {
            row.RelativeItem().Column(col =>
            {
                col.Item().Text("Totaaloverzicht").FontSize(14).Bold().FontColor(AfasBlauw);
            });

            row.RelativeItem().AlignRight().Column(col =>
            {
                col.Item().Text($"Totaal dagen: {aanvraag.TotaalDagen:0.#}").FontSize(12).Bold();
                col.Item().PaddingTop(5).Text($"Indicatieve kosten: € {aanvraag.TotaalKosten:N0}")
                    .FontSize(14).Bold().FontColor(AfasBlauw);
                col.Item().Text("Alle bedragen exclusief BTW").FontSize(8).FontColor(AfasDonkerGrijs);
            });
        });
    }

    private static void ComposeDisclaimer(IContainer container)
    {
        container.Border(1).BorderColor(AfasLichtGrijs).Padding(10).Column(col =>
        {
            col.Item().Text("Disclaimer").FontSize(10).Bold().FontColor(AfasDonkerGrijs);
            col.Item().PaddingTop(5).Text(
                "Dit betreft een indicatieve conceptofferte. De definitieve offerte wordt opgesteld na " +
                "interne review door uw Succesmanager. De werkelijke inzet kan afwijken op basis van " +
                "nadere inventarisatie. Genoemde bedragen zijn exclusief BTW en reiskosten.")
                .FontSize(9).FontColor(AfasDonkerGrijs);
        });
    }

    private static void ComposeFooter(IContainer container)
    {
        container.AlignCenter().Text(text =>
        {
            text.DefaultTextStyle(TextStyle.Default.FontSize(8).FontColor(AfasDonkerGrijs));
            text.Span("AFAS Software® — Conceptofferte Optimalisatieproject — Pagina ");
            text.CurrentPageNumber();
            text.Span(" van ");
            text.TotalPages();
        });
    }

    private static string FormatBeheerOmvang(BeheerOmvang omvang) => omvang switch
    {
        BeheerOmvang.Klein => "1-2 beheerders",
        BeheerOmvang.Middel => "3-5 beheerders",
        BeheerOmvang.Groot => ">5 beheerders",
        _ => omvang.ToString()
    };

    private static string FormatTemplateVersie(TemplateVersie versie) => versie switch
    {
        TemplateVersie.Oud => "Vóór 2023",
        TemplateVersie.Recent => "2023-2024",
        TemplateVersie.Actueel => "2025+",
        _ => versie.ToString()
    };
}
