using Microsoft.EntityFrameworkCore;
using OfferteWizard.Core.Models;

namespace OfferteWizard.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Klant> Klanten => Set<Klant>();
    public DbSet<OptimalisatieThema> Themas => Set<OptimalisatieThema>();
    public DbSet<Verdiepingsvraag> Verdiepingsvragen => Set<Verdiepingsvraag>();
    public DbSet<OfferteAanvraag> OfferteAanvragen => Set<OfferteAanvraag>();
    public DbSet<OfferteRegel> OfferteRegels => Set<OfferteRegel>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Klant>(e =>
        {
            e.HasKey(k => k.Id);
            e.Property(k => k.Naam).HasMaxLength(200).IsRequired();
        });

        modelBuilder.Entity<OptimalisatieThema>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.Naam).HasMaxLength(100).IsRequired();
            e.HasMany(t => t.Verdiepingsvragen).WithOne(v => v.Thema).HasForeignKey(v => v.ThemaId);
        });

        modelBuilder.Entity<Verdiepingsvraag>(e =>
        {
            e.HasKey(v => v.Id);
            e.Property(v => v.VraagTekst).HasMaxLength(500).IsRequired();
        });

        modelBuilder.Entity<OfferteAanvraag>(e =>
        {
            e.HasKey(o => o.Id);
            e.HasOne(o => o.Klant).WithMany().HasForeignKey(o => o.KlantId);
            e.HasMany(o => o.Regels).WithOne(r => r.OfferteAanvraag).HasForeignKey(r => r.OfferteAanvraagId);
        });

        modelBuilder.Entity<OfferteRegel>(e =>
        {
            e.HasKey(r => r.Id);
            e.HasOne(r => r.Thema).WithMany().HasForeignKey(r => r.ThemaId);
        });

        SeedData.Seed(modelBuilder);
    }
}
