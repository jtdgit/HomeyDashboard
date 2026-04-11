---
name: afas-ai-platform-sdk
description: "AFAS AI Platform SDK instellen en gebruiken in .NET projecten. Use when: AI Platform SDK installeren, AI Platform connectie opzetten, AFAS AI koppeling maken, chat functionaliteit bouwen, AI text completion, JSON mode gestructureerde output, function calling, audio transcriptie, bestanden verwerken, document library, web search, AI flow starten, SDK configuratie, NuGet package installeren, AiPlatformClient aanmaken, API key instellen, platform scope URL configureren."
---

# AFAS AI Platform SDK Setup

Deze skill helpt bij het opzetten en gebruiken van de AFAS AI Platform SDK in .NET projecten. De SDK biedt een interface voor interactie met het AFAS AI Platform voor tekst-, audio- en beeldverwerking.

## Wanneer gebruiken

- Een nieuw .NET project opzetten met de AFAS AI Platform SDK
- Verbinding maken met het AFAS AI Platform
- Chat-functionaliteit bouwen (tekst, JSON, function calling)
- Bestanden en afbeeldingen verwerken met AI
- Audio transcriberen
- Gestructureerde JSON-output genereren
- Web search functionaliteit inschakelen

## Vereisten

### Technische vereisten

- **.NET SDK 8.0 of hoger** - De AFAS AI Platform SDK vereist minimaal .NET 8.0. Controleer of de .NET SDK is geïnstalleerd met `dotnet --version`. Download indien nodig vanaf https://dotnet.microsoft.com/download.
- **GitHub CLI (`gh`)** - Nodig voor authenticatie bij GitHub Packages. Controleer met `gh --version`. Installeer indien nodig met `winget install --id GitHub.cli -e`.

### Gegevens van de gebruiker

**BELANGRIJK: Vraag de gebruiker ALTIJD om de volgende gegevens voordat je code genereert:**

1. **Platform Scope URL** - De API URL van het AI Platform (bijv. `https://example.com/scope/path`)
2. **API Key** - De API-sleutel voor authenticatie

Genereer GEEN code zonder deze gegevens. Vraag er expliciet naar.

## Workflow

### Stap 1: Gegevens opvragen

Vraag de gebruiker om:

1. De **Platform Scope URL** (API URL)
2. De **API Key**

Voorbeeld vraag:
> Om de AFAS AI Platform SDK in te richten heb ik twee gegevens nodig:
> 1. Je **Platform Scope URL** (bijv. `https://ai-node003.afasfocus.nl:443/xyz-c5b9610717504ac3ac281ae2f1`)
> 2. Je **API Key** (bijv. `PNqIaPgTJkizt9CNlQ_jgKReeQ4QBXFJHv6MbHr_BGI6d9G5pEAWm-G9915Kce_N`)
>
> Kun je deze gegevens delen?

### Stap 2: Project detectie

Controleer of het project al een .NET project is:

1. Zoek naar een `.csproj` bestand in de workspace
2. Controleer of de `Afas.AI.Platform.SDK` package al is toegevoegd
3. Controleer de target framework versie (minimaal `net8.0`)

**Als er GEEN .NET project is** -> ga naar [Nieuw project opzetten](#nieuw-project-opzetten)
**Als er WEL een .NET project is** -> ga naar [SDK installeren](#sdk-installeren)

### Stap 3: GitHub authenticatie instellen

De SDK wordt gehost als NuGet package op GitHub Packages. Hiervoor is een GitHub account met een Personal Access Token (PAT) nodig. Gebruik de GitHub CLI (`gh`) om dit automatisch te regelen.

#### 3a: GitHub CLI installeren (indien nodig)

Controleer of `gh` beschikbaar is met `gh --version`. Als het niet geïnstalleerd is:

```bash
winget install --id GitHub.cli -e
```

Na installatie moet de gebruiker mogelijk een nieuwe terminal openen zodat `gh` beschikbaar is in het PATH.

#### 3b: Inloggen bij GitHub

Controleer of de gebruiker al is ingelogd met `gh auth status`. Als dat niet het geval is:

```bash
gh auth login
```

Dit opent een interactieve login in de browser. De gebruiker hoeft alleen de stappen op het scherm te volgen.

#### 3c: Token genereren en NuGet source configureren

Controleer eerst of de NuGet source `AFASGroep` al bestaat met `dotnet nuget list source`. Als de source nog niet bestaat, genereer een token en configureer de source:

```bash
gh auth token
```

Gebruik het token dat `gh auth token` teruggeeft als password in het volgende commando:

```bash
dotnet nuget add source "https://nuget.pkg.github.com/AFASGroep/index.json" --name "AFASGroep" --username "gh-cli" --password "<TOKEN_UIT_VORIGE_STAP>"
```

**Let op:** De `--username` waarde mag elke willekeurige string zijn (bijv. `gh-cli`), alleen het token is van belang.

### Stap 4: SDK installeren

Installeer het NuGet package:

```bash
dotnet add package Afas.AI.Platform.SDK --source "https://nuget.pkg.github.com/AFASGroep/index.json"
```

### Stap 5: Code genereren

Genereer de verbindingscode en voorbeelden op basis van de gegevens van de gebruiker.

## Nieuw project opzetten

Als er nog geen .NET project is:

```bash
# Maak een nieuw console project aan
dotnet new console -n AiPlatformDemo --framework net8.0

# Ga naar de projectmap
cd AiPlatformDemo
```

Volg daarna de stappen onder [SDK installeren](#sdk-installeren) om het package toe te voegen.

## SDK installeren

Zorg dat de GitHub NuGet source is geconfigureerd (zie [Stap 3: GitHub authenticatie instellen](#stap-3-github-authenticatie-instellen)).

Voeg het package toe aan het project:

```bash
dotnet add package Afas.AI.Platform.SDK --source "https://nuget.pkg.github.com/AFASGroep/index.json"
```

Of voeg het handmatig toe aan het `.csproj` bestand:

```xml
<ItemGroup>
  <PackageReference Include="Afas.AI.Platform.SDK" Version="*" />
</ItemGroup>
```

## Verbinding opzetten

### Basis verbinding

De minimale code om verbinding te maken met het AI Platform:

```csharp
using Afas.AI.Platform.SDK.Client;
using Afas.AI.Platform.SDK.Models;
using Afas.AI.Platform.Types.Model;

// Configuratie - vervang deze waarden met de gegevens van de gebruiker
// Voorbeeld URL: https://ai-node003.afasfocus.nl:443/xyz-c5b9610717504ac3ac281ae2f1
// Voorbeeld key: PNqIaPgTJkizt9CNlQ_jgKReeQ4QBXFJHv6MbHr_BGI6d9G5pEAWm-G9915Kce_N
var platformScopeUrl = "<PLATFORM_SCOPE_URL_VAN_GEBRUIKER>";
var apiKey = "<API_KEY_VAN_GEBRUIKER>";

// HttpClient aanmaken (hergebruik deze voor meerdere requests)
var httpClient = new HttpClient();

// AI Platform client aanmaken
using var client = new AiPlatformClient(platformScopeUrl, apiKey, httpClient);
```

**BELANGRIJK:** Vervang `<PLATFORM_SCOPE_URL_VAN_GEBRUIKER>` en `<API_KEY_VAN_GEBRUIKER>` altijd met de daadwerkelijke waarden die de gebruiker heeft opgegeven. Gebruik NOOIT de voorbeeldwaarden uit deze skill.

### Verbinding met foutafhandeling

```csharp
using Afas.AI.Platform.SDK.Client;
using Afas.AI.Platform.SDK.Exceptions;
using Afas.AI.Platform.SDK.Models;
using Afas.AI.Platform.Types.Model;

var platformScopeUrl = "<PLATFORM_SCOPE_URL_VAN_GEBRUIKER>";
var apiKey = "<API_KEY_VAN_GEBRUIKER>";
var httpClient = new HttpClient();

using var client = new AiPlatformClient(platformScopeUrl, apiKey, httpClient);

// Achtergrondfouten afvangen (bijv. WebSocket-verbindingsfouten)
client.OnError += (sender, exception) =>
{
    Console.WriteLine($"Fout: {exception.Message}");
};

try
{
    var response = await client.StartChat(
        chatInstanceId: Guid.NewGuid(),
        message: "Hallo, dit is een testbericht.",
        inputModalities: [ModalityType.Text],
        outputModalities: [ModalityType.Text],
        timeOut: TimeSpan.FromSeconds(30)
    );

    Console.WriteLine($"Antwoord: {response.ResponseMessage}");
    Console.WriteLine($"Tokens gebruikt: {response.TotalTokenCount}");
}
catch (AuthenticationException ex)
{
    Console.WriteLine($"Authenticatie mislukt: {ex.Message}");
}
catch (AiTimeoutException ex)
{
    Console.WriteLine($"Timeout: {ex.Message}");
}
catch (AiPlatformException ex)
{
    Console.WriteLine($"Platform fout: {ex.Message}");
}
```

## Voorbeeldcode

### Eenvoudige chat

```csharp
using var client = new AiPlatformClient(platformScopeUrl, apiKey, httpClient);

// Nieuwe chat starten
var chatId = Guid.NewGuid();
var response = await client.StartChat(
    chatInstanceId: chatId,
    message: "Wat is de hoofdstad van Nederland?",
    inputModalities: [ModalityType.Text],
    outputModalities: [ModalityType.Text],
    timeOut: TimeSpan.FromMinutes(2)
);
Console.WriteLine(response.ResponseMessage);

// Gesprek voortzetten
var vervolg = await client.ContinueChat(
    chatInstanceId: chatId,
    message: "Hoeveel inwoners heeft die stad?",
    timeOut: TimeSpan.FromMinutes(2)
);
Console.WriteLine(vervolg.ResponseMessage);
```

### Chat met builder pattern

De SDK biedt ook een fluent builder API:

```csharp
using var client = new AiPlatformClient(platformScopeUrl, apiKey, httpClient);

var chatId = Guid.NewGuid();

// StartChat met builder
var response = await client.StartChatBuilder("Wat is de hoofdstad van Nederland?")
    .WithChatInstanceId(chatId)
    .WithInputModalities(ModalityType.Text)
    .WithOutputModalities(ModalityType.Text)
    .WithUser("gebruiker1")
    .WithPlaceInApp("mijn-applicatie")
    .WithTimeout(TimeSpan.FromSeconds(30))
    .Execute();

Console.WriteLine(response.ResponseMessage);

// ContinueChat met builder
var vervolg = await client.ContinueChatBuilder(chatId, "Vertel meer over de geschiedenis.")
    .WithTimeout(TimeSpan.FromSeconds(30))
    .Execute();

Console.WriteLine(vervolg.ResponseMessage);
```

### Gestructureerde JSON-output

#### Met handmatig schema

```csharp
using Newtonsoft.Json.Linq;

using var client = new AiPlatformClient(platformScopeUrl, apiKey, httpClient);

var jsonSchema = JObject.Parse("""
{
  "name": "StadInfo",
  "description": "Informatie over een stad",
  "strict": true,
  "schema": {
    "type": "object",
    "properties": {
      "naam": { "type": "string" },
      "land": { "type": "string" },
      "inwoners": { "type": "number" },
      "bezienswaardigheden": {
        "type": "array",
        "items": { "type": "string" }
      }
    },
    "required": ["naam", "land", "inwoners", "bezienswaardigheden"],
    "additionalProperties": false
  }
}
""");

var response = await client.GetJsonResponse(
    message: "Geef informatie over Amsterdam",
    jsonSchema: jsonSchema
);

Console.WriteLine(response.ResponseMessage);
```

#### Met strongly-typed model (aanbevolen)

```csharp
using Afas.AI.Platform.SDK.SchemaGeneration;

// Definieer je response model
public class StadInfo
{
    [JsonSchemaDescription("De naam van de stad")]
    public string Naam { get; set; }

    [JsonSchemaDescription("Het land waar de stad in ligt")]
    public string Land { get; set; }

    [JsonSchemaDescription("Het aantal inwoners")]
    public int Inwoners { get; set; }

    [JsonSchemaDescription("Lijst van bezienswaardigheden")]
    public string[] Bezienswaardigheden { get; set; }

    [JsonSchemaDescription("Oppervlakte in vierkante kilometers")]
    public double? Oppervlakte { get; set; }
}

using var client = new AiPlatformClient(platformScopeUrl, apiKey, httpClient);

var (response, stadInfo) = await client.GetJsonResponse<StadInfo>(
    message: "Geef informatie over Amsterdam"
);

Console.WriteLine($"Stad: {stadInfo.Naam}");
Console.WriteLine($"Land: {stadInfo.Land}");
Console.WriteLine($"Inwoners: {stadInfo.Inwoners}");
Console.WriteLine($"Bezienswaardigheden: {string.Join(", ", stadInfo.Bezienswaardigheden)}");
if (stadInfo.Oppervlakte.HasValue)
{
    Console.WriteLine($"Oppervlakte: {stadInfo.Oppervlakte} km2");
}
```

**Ondersteunde type-mappings voor schema-generatie:**

| C# type | JSON Schema type |
|---------|-----------------|
| `string` | `"string"` |
| `int`, `long`, `short` | `"integer"` |
| `double`, `float`, `decimal` | `"number"` |
| `bool` | `"boolean"` |
| `DateTime`, `DateTimeOffset` | `"string"` met `"format": "date-time"` |
| `T[]`, `List<T>` | `"array"` met `"items"` |
| `T?` (nullable) | `["type", "null"]` |

**Beschikbare constraint-attributen:**

- `[JsonSchemaDescription("...")]` - Beschrijving van het veld
- `[JsonSchemaPattern("regex")]` - Regex patroon voor strings
- `[JsonSchemaFormat("email")]` - Format voor strings (email, uuid, date-time, etc.)
- `[JsonSchemaStringLength(MinLength = 1, MaxLength = 100)]` - Min/max lengte
- `[JsonSchemaMinimum(0)]` - Minimumwaarde voor getallen
- `[JsonSchemaMaximum(100)]` - Maximumwaarde voor getallen
- `[JsonSchemaMultipleOf(0.01)]` - Getal moet veelvoud zijn van waarde
- `[JsonSchemaArrayLength(MinItems = 1, MaxItems = 10)]` - Min/max items in array

### Function calling

```csharp
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using var client = new AiPlatformClient(platformScopeUrl, apiKey, httpClient);

// Definieer een functie die de AI kan aanroepen
var zoekKlantFunctie = new AiFunction
{
    Name = "zoek_klant",
    Description = "Zoek klantgegevens op basis van naam of klantnummer",
    ParameterList =
    [
        new FunctionParameter
        {
            Name = "zoekterm",
            Description = "Naam of klantnummer om te zoeken",
            Type = FunctionParameterType.String,
            IsRequired = true
        },
        new FunctionParameter
        {
            Name = "max_resultaten",
            Description = "Maximum aantal resultaten",
            Type = FunctionParameterType.Integer,
            Minimum = 1,
            Maximum = 50
        }
    ],
    Handler = async (args, cancellationToken) =>
    {
        var zoekterm = args["zoekterm"]?.ToString() ?? "";
        var maxResultaten = args["max_resultaten"]?.Value<int>() ?? 10;

        // Hier zou je je eigen database of API aanroepen
        var resultaat = new
        {
            klanten = new[]
            {
                new { naam = "Jan Jansen", klantnummer = "K001", stad = "Amsterdam" },
                new { naam = "Piet Peters", klantnummer = "K002", stad = "Rotterdam" }
            },
            totaal = 2
        };

        return JsonConvert.SerializeObject(resultaat);
    }
};

var response = await client.StartChat(
    chatInstanceId: Guid.NewGuid(),
    message: "Zoek de gegevens op van klant Jan Jansen",
    inputModalities: [ModalityType.Text],
    outputModalities: [ModalityType.Text, ModalityType.FunctionCall],
    functions: [zoekKlantFunctie],
    timeOut: TimeSpan.FromMinutes(2)
);

Console.WriteLine(response.ResponseMessage);
```

**Beschikbare parametertypes:**

| Type | Beschrijving |
|------|-------------|
| `FunctionParameterType.String` | Tekst, optioneel met `EnumValues` voor beperkte keuzes |
| `FunctionParameterType.Number` | Decimaal getal met optioneel `Minimum`/`Maximum` |
| `FunctionParameterType.Integer` | Geheel getal met optioneel `Minimum`/`Maximum` |
| `FunctionParameterType.Boolean` | Waar/onwaar |
| `FunctionParameterType.Array` | Lijst met `ArrayItemType` voor elementtype |
| `FunctionParameterType.Object` | Genest object met `Properties` lijst |

### Bestanden verwerken

```csharp
using var client = new AiPlatformClient(platformScopeUrl, apiKey, httpClient);

var bestandInput = new AiFileInput
{
    FileName = "document.pdf",
    FileData = File.ReadAllBytes("pad/naar/document.pdf"),
    LifeTimeScope = LifetimeScope.Session,
    ReferenceTag = "mijn_document",
    Chunk = true // Voor grote documenten
};

var response = await client.StartChat(
    chatInstanceId: Guid.NewGuid(),
    message: "Analyseer dit document en geef een samenvatting",
    inputModalities: [ModalityType.Text],
    outputModalities: [ModalityType.Text],
    files: [bestandInput],
    timeOut: TimeSpan.FromMinutes(5)
);

Console.WriteLine(response.ResponseMessage);
```

**AiFileInput eigenschappen:**

| Eigenschap | Type | Beschrijving |
|-----------|------|-------------|
| `FileName` | `string` | Bestandsnaam |
| `FileData` | `byte[]` | Bestandsinhoud als byte array |
| `LifeTimeScope` | `LifetimeScope` | `Session` (tijdelijk) of `UntilExplicitRemoval` (permanent) |
| `ReferenceTag` | `string?` | Optionele referentietag voor template placeholders |
| `Chunk` | `bool` | Schakel chunking in voor grote documenten |
| `Url` | `string?` | Optionele URL als bronverwijzing |

### Afbeelding analyseren

```csharp
using var client = new AiPlatformClient(platformScopeUrl, apiKey, httpClient);

var afbeelding = new AiFileInput
{
    FileName = "foto.png",
    FileData = File.ReadAllBytes("pad/naar/foto.png"),
    LifeTimeScope = LifetimeScope.Session
};

var response = await client.StartChat(
    chatInstanceId: Guid.NewGuid(),
    message: "Beschrijf wat je ziet op deze afbeelding",
    inputModalities: [ModalityType.Text, ModalityType.Image],
    outputModalities: [ModalityType.Text],
    files: [afbeelding],
    timeOut: TimeSpan.FromMinutes(2)
);

Console.WriteLine(response.ResponseMessage);
```

### Audio transcriberen

```csharp
using var client = new AiPlatformClient(platformScopeUrl, apiKey, httpClient);

var audioBestand = new AiFileInput
{
    FileName = "opname.wav",
    FileData = File.ReadAllBytes("pad/naar/opname.wav"),
    LifeTimeScope = LifetimeScope.Session
};

var transcripties = await client.GetTranscription(
    [audioBestand],
    timeOut: TimeSpan.FromMinutes(10)
);

foreach (var transcriptie in transcripties)
{
    Console.WriteLine($"Tekst: {transcriptie.Result.Text}");
    Console.WriteLine($"Tokens: {transcriptie.Result.OutputTokens}");

    // Individuele chunks met timestamps
    foreach (var chunk in transcriptie.Result.Chunks)
    {
        Console.WriteLine($"  [{chunk.Timestamp[0]:F1}s - {chunk.Timestamp[1]:F1}s] {chunk.Text}");
    }
}
```

### Template values (prompt placeholders)

```csharp
using var client = new AiPlatformClient(platformScopeUrl, apiKey, httpClient);

var templateWaarden = new List<PromptTemplateValue>
{
    new("KlantNaam", "Jan Jansen"),
    new("Bedrijf", "ACME B.V."),
    new("Onderwerp", "factuur")
};

// Let op: promptName is verplicht bij gebruik van templateValues
var response = await client.StartChat(
    chatInstanceId: Guid.NewGuid(),
    message: "Behandel het verzoek van {KlantNaam} van {Bedrijf} over {Onderwerp}",
    inputModalities: [ModalityType.Text],
    outputModalities: [ModalityType.Text],
    templateValues: templateWaarden,
    promptName: "KlantenserviceTemplate",
    timeOut: TimeSpan.FromMinutes(2)
);

Console.WriteLine(response.ResponseMessage);
```

### Web search

```csharp
using var client = new AiPlatformClient(platformScopeUrl, apiKey, httpClient);

// Basis web search
var response = await client.StartChatBuilder("Wat zijn de laatste ontwikkelingen in .NET 9?")
    .WithChatInstanceId(Guid.NewGuid())
    .WithInputModalities(ModalityType.Text)
    .WithOutputModalities(ModalityType.Text, ModalityType.FunctionCall)
    .WithFeatures(new WebSearchFeatureConfiguration())
    .WithTimeout(TimeSpan.FromSeconds(120))
    .Execute();

Console.WriteLine(response.ResponseMessage);

// Web search beperkt tot specifieke domeinen
var response2 = await client.StartChatBuilder("Zoek informatie over AFAS Software")
    .WithChatInstanceId(Guid.NewGuid())
    .WithInputModalities(ModalityType.Text)
    .WithOutputModalities(ModalityType.Text, ModalityType.FunctionCall)
    .WithFeatures(new WebSearchFeatureConfiguration(
        AllowedDomains: ["afas.nl", "afas.dev"],
        SearchProvider: WebSearchProvider.Brave))
    .WithTimeout(TimeSpan.FromSeconds(120))
    .Execute();

Console.WriteLine(response2.ResponseMessage);
```

### Document library

```csharp
using var client = new AiPlatformClient(platformScopeUrl, apiKey, httpClient);

// Chat met een document library gekoppeld
var response = await client.StartChatBuilder("Zoek informatie over verlofregistratie")
    .WithChatInstanceId(Guid.NewGuid())
    .WithInputModalities(ModalityType.Text)
    .WithOutputModalities(ModalityType.Text)
    .WithFeatures(new DocumentLibraryFeatureConfiguration(
        Description: "HR Documentatie"))
    .WithTimeout(TimeSpan.FromSeconds(60))
    .Execute();

Console.WriteLine(response.ResponseMessage);

// Of met een specifiek library ID
var response2 = await client.StartChatBuilder("Wat zijn de regels voor ziekteverlof?")
    .WithChatInstanceId(Guid.NewGuid())
    .WithInputModalities(ModalityType.Text)
    .WithOutputModalities(ModalityType.Text)
    .WithFeatures(new DocumentLibraryFeatureConfiguration(
        LibraryId: Guid.Parse("12345678-1234-1234-1234-123456789012")))
    .WithTimeout(TimeSpan.FromSeconds(60))
    .Execute();

Console.WriteLine(response2.ResponseMessage);
```

### Chatgeschiedenis ophalen

```csharp
using var client = new AiPlatformClient(platformScopeUrl, apiKey, httpClient);

// Alle chats ophalen
var chats = await client.GetChats();
foreach (var chat in chats)
{
    Console.WriteLine($"Chat: {chat.InstanceId} - {chat.Description}");
    Console.WriteLine($"  Aangemaakt: {chat.CreatedDate}");
}

// Een specifieke chat ophalen (inclusief berichten)
var chatDetail = await client.GetChat(chats.First().InstanceId);
if (chatDetail?.Messages != null)
{
    foreach (var bericht in chatDetail.Messages)
    {
        Console.WriteLine($"  [{bericht.CreatedDate}] {bericht.Message}");
    }
}
```

## Modaliteiten

### Input modaliteiten

| Modaliteit | Gebruik |
|-----------|---------|
| `ModalityType.Text` | Tekst invoer |
| `ModalityType.Image` | Afbeeldingen (JPEG, PNG, etc.) |
| `ModalityType.Audio` | Audiobestanden voor transcriptie |
| `ModalityType.JsonSchema` | JSON schema definities |

### Output modaliteiten

| Modaliteit | Gebruik |
|-----------|---------|
| `ModalityType.Text` | Tekst antwoorden |
| `ModalityType.Json` | Gestructureerde JSON antwoorden |
| `ModalityType.Transcription` | Tekst transcriptie van audio |
| `ModalityType.FunctionCall` | Function call verzoeken |
| `ModalityType.Embedding` | Vector embeddings |

## Foutafhandeling

De SDK biedt specifieke exception-types:

| Exception | Beschrijving |
|-----------|-------------|
| `AuthenticationException` | Authenticatie mislukt (ongeldige API key) |
| `AiTimeoutException` | Request is verlopen |
| `AttachmentNotReadyLanguageModelException` | Bestand wordt nog verwerkt |
| `ServerUnavailableLanguageModelException` | AI service tijdelijk niet beschikbaar |
| `RateLimitLanguageModelException` | Te veel requests in korte tijd |
| `TokenLimitExceededLanguageModelException` | Token limiet overschreden |
| `ContentFilteredLanguageModelException` | Inhoud gefilterd door beleid |
| `UnsupportedAttachmentLanguageModelException` | Bestandstype niet ondersteund |
| `LanguageModelException` | Algemene language model fout (bevat trace ID) |
| `AiPlatformException` | Algemene platform fout |

Alle `LanguageModelException` types bevatten een `GetTraceIdOrNull()` methode voor debugging.

```csharp
try
{
    var response = await client.StartChat(
        chatInstanceId: Guid.NewGuid(),
        message: "Mijn bericht",
        inputModalities: [ModalityType.Text],
        outputModalities: [ModalityType.Text]
    );
}
catch (AuthenticationException ex)
{
    Console.WriteLine($"Authenticatie mislukt: {ex.Message}");
}
catch (RateLimitLanguageModelException ex)
{
    Console.WriteLine($"Rate limit bereikt: {ex.Message}");
    Console.WriteLine($"Trace ID: {ex.GetTraceIdOrNull()}");
}
catch (LanguageModelException ex)
{
    Console.WriteLine($"Model fout ({ex.ExceptionType}): {ex.Message}");
    Console.WriteLine($"Trace ID: {ex.GetTraceIdOrNull()}");
}
catch (AiPlatformException ex)
{
    Console.WriteLine($"Platform fout: {ex.Message}");
}
```

## Best practices

1. **Hergebruik `HttpClient`**: Maak een enkele `HttpClient` instantie en hergebruik deze om socket-uitputting te voorkomen.
2. **Gebruik `using`**: Zorg dat de client correct wordt opgeruimd met `using var client = ...`.
3. **Stel timeouts in**: Gebruik altijd een redelijke timeout voor je use case.
4. **Vang specifieke exceptions**: Gebruik de specifieke exception-types voor gerichte foutafhandeling.
5. **Gebruik template values**: Gebruik template values in plaats van string concatenatie voor dynamische prompts.
6. **Schakel chunking in voor grote bestanden**: Gebruik `Chunk = true` bij `AiFileInput` voor grote documenten.
7. **Sla gevoelige gegevens veilig op**: Bewaar API keys niet in broncode. Gebruik environment variables, `appsettings.json` (met user secrets), of een key vault.

```csharp
// Voorbeeld: API key uit environment variable
var platformScopeUrl = Environment.GetEnvironmentVariable("AI_PLATFORM_URL")
    ?? throw new InvalidOperationException("AI_PLATFORM_URL niet geconfigureerd");
var apiKey = Environment.GetEnvironmentVariable("AI_PLATFORM_API_KEY")
    ?? throw new InvalidOperationException("AI_PLATFORM_API_KEY niet geconfigureerd");
```

## Referentie

- SDK documentatie: https://docs.afas.dev/ai-platform/sdk
- NuGet package: https://github.com/orgs/AFASGroep/packages/nuget/package/Afas.AI.Platform.SDK
- Target framework: `net8.0` of hoger
- Belangrijkste namespaces:
  - `Afas.AI.Platform.SDK.Client` - `AiPlatformClient`, `AiPlatformRegistrationClient`
  - `Afas.AI.Platform.SDK.Models` - Alle modellen (`AiFileInput`, `AiResponseOutput`, `AiFunction`, etc.)
  - `Afas.AI.Platform.SDK.Builders` - Builder-klassen (`StartChatRequestBuilder`, `ContinueChatRequestBuilder`)
  - `Afas.AI.Platform.SDK.Exceptions` - Alle exception-types
  - `Afas.AI.Platform.SDK.SchemaGeneration` - JSON schema attributen
  - `Afas.AI.Platform.Types.Model` - `ModalityType`
  - `Afas.AI.Platform.Types.Blob` - `LifetimeScope`