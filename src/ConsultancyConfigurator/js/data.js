/**
 * Mock data for the Consultancy Configurator
 * Based on OfferteWizard domain models
 */

const ConfiguratorData = {

    branches: [
        {
            id: 'commercieel',
            naam: 'Commercieel',
            beschrijving: 'Sales, marketing, accountmanagement',
            icoon: '💼',
            factor: 1.0
        },
        {
            id: 'onderwijs',
            naam: 'Onderwijs',
            beschrijving: 'Scholen, universiteiten, opleidingen',
            icoon: '🎓',
            factor: 0.9
        },
        {
            id: 'zorg',
            naam: 'Zorg',
            beschrijving: 'Ziekenhuizen, huisartsen, GGZ',
            icoon: '🏥',
            factor: 1.1
        },
        {
            id: 'overheid',
            naam: 'Overheid',
            beschrijving: 'Gemeenten, provincies, rijksoverheid',
            icoon: '🏛️',
            factor: 1.15
        }
    ],

    omvangOpties: [
        {
            id: 'klein',
            naam: 'Klein',
            beschrijving: '1–2 beheerders',
            icoon: '👤',
            factor: 0.8
        },
        {
            id: 'middel',
            naam: 'Middel',
            beschrijving: '3–5 beheerders',
            icoon: '👥',
            factor: 1.0
        },
        {
            id: 'groot',
            naam: 'Groot',
            beschrijving: 'Meer dan 5 beheerders',
            icoon: '🏢',
            factor: 1.3
        }
    ],

    themas: [
        {
            id: 1,
            naam: 'HRM & Salarisadministratie',
            beschrijving: 'Inrichting van personeelsbeheer, verlof, verzuim en salarisverwerking.',
            categorie: 'HRM',
            icoon: '👔',
            basisDagen: 5,
            minDagen: 3,
            maxDagen: 12,
            consultantType: 'consultant'
        },
        {
            id: 2,
            naam: 'Financiële administratie',
            beschrijving: 'Grootboek, crediteuren, debiteuren, bankafschriften en rapportages.',
            categorie: 'Financieel',
            icoon: '📊',
            basisDagen: 4,
            minDagen: 2,
            maxDagen: 10,
            consultantType: 'consultant'
        },
        {
            id: 3,
            naam: 'CRM & Relatiebeheer',
            beschrijving: 'Klantbeheer, verkoopkansen, offertes en campagnebeheer.',
            categorie: 'CRM',
            icoon: '🤝',
            basisDagen: 3,
            minDagen: 2,
            maxDagen: 8,
            consultantType: 'consultant'
        },
        {
            id: 4,
            naam: 'Projectmanagement',
            beschrijving: 'Projectplanning, urenregistratie, budgetbewaking en facturatie.',
            categorie: 'Projecten',
            icoon: '📋',
            basisDagen: 4,
            minDagen: 2,
            maxDagen: 10,
            consultantType: 'consultant'
        },
        {
            id: 5,
            naam: 'Logistiek & Voorraad',
            beschrijving: 'Inkoop, voorraad, magazijn, verkooporders en leveringen.',
            categorie: 'Logistiek',
            icoon: '📦',
            basisDagen: 5,
            minDagen: 3,
            maxDagen: 12,
            consultantType: 'senior'
        },
        {
            id: 6,
            naam: 'Workflow & Autorisatie',
            beschrijving: 'Goedkeuringsstromen, autorisatie-inrichting en procesoptimalisatie.',
            categorie: 'Proces',
            icoon: '⚙️',
            basisDagen: 3,
            minDagen: 1,
            maxDagen: 6,
            consultantType: 'senior'
        },
        {
            id: 7,
            naam: 'Rapportages & Dashboards',
            beschrijving: 'Management dashboards, KPI\'s, data-analyse en Business Intelligence.',
            categorie: 'BI',
            icoon: '📈',
            basisDagen: 3,
            minDagen: 2,
            maxDagen: 8,
            consultantType: 'senior'
        },
        {
            id: 8,
            naam: 'Koppelingen & Integraties',
            beschrijving: 'REST API\'s, uitwisseling met derden, datamigratie en connectoren.',
            categorie: 'Technisch',
            icoon: '🔗',
            basisDagen: 4,
            minDagen: 2,
            maxDagen: 15,
            consultantType: 'senior'
        }
    ],

    tarieven: {
        consultant: 1250,
        senior: 1500
    },

    /**
     * Calculate days for a theme based on branche and omvang factors
     */
    berekenDagen(thema, brancheFactor, omvangFactor) {
        const berekend = thema.basisDagen * brancheFactor * omvangFactor;
        return Math.max(thema.minDagen, Math.min(thema.maxDagen, Math.round(berekend * 2) / 2)); // round to 0.5
    }
};
