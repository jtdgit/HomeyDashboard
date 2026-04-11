using Microsoft.EntityFrameworkCore;
using OfferteWizard.Core.Interfaces;
using OfferteWizard.Core.Models;
using OfferteWizard.Infrastructure.Data;

namespace OfferteWizard.Infrastructure.Services;

public class KlantService : IKlantService
{
    private readonly AppDbContext _db;

    public KlantService(AppDbContext db) => _db = db;

    public async Task<List<Klant>> GetAlleKlantenAsync()
        => await _db.Klanten.OrderBy(k => k.Naam).ToListAsync();

    public async Task<Klant?> GetKlantByIdAsync(int id)
        => await _db.Klanten.FindAsync(id);
}
