using Microsoft.EntityFrameworkCore;
using OfferteWizard.Core.Enums;
using OfferteWizard.Core.Interfaces;
using OfferteWizard.Core.Models;
using OfferteWizard.Infrastructure.Data;

namespace OfferteWizard.Infrastructure.Services;

public class OfferteService : IOfferteService
{
    private readonly AppDbContext _db;

    public OfferteService(AppDbContext db) => _db = db;

    public async Task<OfferteAanvraag> MaakAanvraagAsync(int klantId, List<BerekendResultaat> resultaten, string? opmerkingen)
    {
        var aanvraag = new OfferteAanvraag
        {
            KlantId = klantId,
            AanvraagDatum = DateTime.UtcNow,
            Status = OfferteStatus.Concept,
            OpmerkingenKlant = opmerkingen,
            TotaalDagen = resultaten.Sum(r => r.TotaalDagen),
            TotaalKosten = resultaten.Sum(r => r.Subtotaal),
            Regels = resultaten.Select(r => new OfferteRegel
            {
                ThemaId = r.ThemaId,
                BerekendeDagen = r.TotaalDagen,
                ConsultantType = r.ConsultantType,
                Dagtarief = r.Dagtarief,
                Subtotaal = r.Subtotaal,
                Toelichting = $"{r.ThemaNaam}: {r.TotaalDagen} dagen ({r.ConsultantType})"
            }).ToList()
        };

        _db.OfferteAanvragen.Add(aanvraag);
        await _db.SaveChangesAsync();
        return aanvraag;
    }

    public async Task<List<OfferteAanvraag>> GetAanvragenAsync(int? klantId = null)
    {
        var query = _db.OfferteAanvragen
            .Include(o => o.Klant)
            .Include(o => o.Regels).ThenInclude(r => r.Thema)
            .OrderByDescending(o => o.AanvraagDatum)
            .AsQueryable();

        if (klantId.HasValue)
            query = query.Where(o => o.KlantId == klantId.Value);

        return await query.ToListAsync();
    }

    public async Task<OfferteAanvraag?> GetAanvraagByIdAsync(int id)
    {
        return await _db.OfferteAanvragen
            .Include(o => o.Klant)
            .Include(o => o.Regels).ThenInclude(r => r.Thema)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<bool> UpdateStatusAsync(int id, OfferteStatus nieuweStatus, string? opmerking)
    {
        var aanvraag = await _db.OfferteAanvragen.FindAsync(id);
        if (aanvraag == null) return false;

        aanvraag.Status = nieuweStatus;
        if (!string.IsNullOrWhiteSpace(opmerking))
            aanvraag.OpmerkingenSuccesmanager = opmerking;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> BijstellenEnGoedkeurenAsync(int id, Dictionary<int, decimal?> aanpassingen, string? opmerking)
    {
        var aanvraag = await _db.OfferteAanvragen
            .Include(o => o.Regels)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (aanvraag == null) return false;

        foreach (var regel in aanvraag.Regels)
        {
            if (aanpassingen.TryGetValue(regel.Id, out var aangepast) && aangepast.HasValue)
            {
                regel.AangepasteDagen = aangepast.Value;
                regel.Subtotaal = aangepast.Value * regel.Dagtarief;
            }
        }

        aanvraag.TotaalDagen = aanvraag.Regels.Sum(r => r.AangepasteDagen ?? r.BerekendeDagen);
        aanvraag.TotaalKosten = aanvraag.Regels.Sum(r => (r.AangepasteDagen ?? r.BerekendeDagen) * r.Dagtarief);
        aanvraag.Status = OfferteStatus.Goedgekeurd;

        if (!string.IsNullOrWhiteSpace(opmerking))
            aanvraag.OpmerkingenSuccesmanager = opmerking;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> TerugStudenAsync(int id, string reden)
    {
        var aanvraag = await _db.OfferteAanvragen.FindAsync(id);
        if (aanvraag == null) return false;

        aanvraag.Status = OfferteStatus.Teruggestuurd;
        aanvraag.RedenTerugsturen = reden;

        await _db.SaveChangesAsync();
        return true;
    }
}
