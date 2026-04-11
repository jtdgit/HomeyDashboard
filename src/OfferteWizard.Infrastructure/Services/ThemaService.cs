using Microsoft.EntityFrameworkCore;
using OfferteWizard.Core.Interfaces;
using OfferteWizard.Core.Models;
using OfferteWizard.Infrastructure.Data;

namespace OfferteWizard.Infrastructure.Services;

public class ThemaService : IThemaService
{
    private readonly AppDbContext _db;

    public ThemaService(AppDbContext db) => _db = db;

    public async Task<List<OptimalisatieThema>> GetAlleThemasAsync()
        => await _db.Themas.Include(t => t.Verdiepingsvragen).OrderBy(t => t.Naam).ToListAsync();

    public async Task<List<OptimalisatieThema>> GetThemasByIdsAsync(List<int> ids)
        => await _db.Themas.Include(t => t.Verdiepingsvragen).Where(t => ids.Contains(t.Id)).ToListAsync();
}
