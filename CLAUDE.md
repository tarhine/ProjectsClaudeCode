# CLAUDE.md

Ce fichier donne le contexte du projet aux agents (Claude Code et autres) travaillant dans ce dépôt.

## Vue d'ensemble

Solution fullstack composée de :
- `backend/` — API .NET 8 en Clean Architecture (Api / Application / Domain / Infrastructure), pattern **CQRS** via **MediatR**, EF Core + **SQL Server**.
- `frontend/` — **React 19 + Vite + TypeScript**, composants **shadcn/ui** (Tailwind CSS v4, thème clair/sombre OKLCH).
- `docker-compose.yml` — instance SQL Server conteneurisée pour le développement local.

## Architecture backend (Clean Architecture + CQRS)

Règle de dépendance stricte (une couche ne référence jamais une couche « extérieure ») :

```
Backend.Api  ──▶  Backend.Application  ──▶  Backend.Domain
     │                                            ▲
     └────────▶  Backend.Infrastructure ──────────┘
```

- **Domain** : entités, exceptions métier. Zéro dépendance externe, zéro référence à EF Core ou ASP.NET Core.
- **Application** : logique métier orchestrée en CQRS. Chaque fonctionnalité vit dans `Features/<Entité>/Commands|Queries/<Action>/` avec 3 fichiers : `XCommand.cs` (ou `XQuery.cs`), `XCommandValidator.cs` (FluentValidation), `XCommandHandler.cs` (MediatR `IRequestHandler`). Ne dépend que d'interfaces (`IApplicationDbContext`), jamais d'une implémentation concrète.
- **Infrastructure** : implémentation EF Core de `IApplicationDbContext` (`AppDbContext`), configurations d'entités (Fluent API), migrations.
- **Api** : contrôleurs fins qui ne font qu'envoyer une Command/Query via `ISender` (MediatR) — aucune logique métier ici.

Pipeline MediatR (`Backend.Application/Common/Behaviors/`) : chaque Command/Query passe par `ValidationBehavior` (FluentValidation, lève `ValidationException` si invalide) puis `LoggingBehavior` (Serilog). Le middleware global (`Backend.Api/Middleware/ExceptionHandlingMiddleware.cs`) convertit `ValidationException` → 400, `NotFoundException` → 404, `DomainException` → 400, tout le reste → 500, au format `ProblemDetails`.

La feature `Products` (`Backend.Application/Features/Products/`) sert de **modèle à copier** pour toute nouvelle fonctionnalité (Create/Update/Delete/GetById/GetList).

### Conventions de nommage
- Commands : verbe à l'impératif + entité (`CreateProductCommand`, `UpdateProductCommand`).
- Queries : `Get<Entité><ById|List>Query`.
- Un handler = un fichier, nommé `<Command|Query>Handler.cs`.
- DTOs de sortie dans `Features/<Entité>/Dtos/`, jamais l'entité Domain exposée directement à l'Api.

## Architecture frontend

- `src/components/ui/` : composants shadcn/ui (générés via CLI — ne pas éditer à la main sauf besoin, préférer `npx shadcn add <composant>`).
- `src/lib/utils.ts` : helper `cn()` pour la fusion de classes Tailwind.
- `src/hooks/` : hooks partagés (ex. `use-theme.ts` pour le thème clair/sombre).
- Alias d'import `@/*` → `src/*` (configuré dans `tsconfig.json`, `tsconfig.app.json` et `vite.config.ts`).
- Tests avec **Vitest** + **React Testing Library**, fichiers `*.test.tsx` à côté du composant testé.

## Commandes

### Backend (.NET 8)
```bash
cd backend
dotnet build Backend.slnx                    # build de toute la solution
dotnet test Backend.slnx                      # exécuter tous les tests
dotnet run --project src/Backend.Api          # lancer l'API (https://localhost:xxxx/swagger)

# Migrations EF Core (depuis backend/)
dotnet ef migrations add <Nom> --project src/Backend.Infrastructure --startup-project src/Backend.Api --output-dir Persistence/Migrations
dotnet ef database update --project src/Backend.Infrastructure --startup-project src/Backend.Api
```
Le CLI `dotnet-ef` doit être installé globalement (`dotnet tool install --global dotnet-ef`).

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev            # serveur de dev (http://localhost:5173)
npm run build           # build de production (tsc -b && vite build)
npm run test             # tests Vitest (mode run)
npm run test:watch       # tests Vitest (mode watch)
npm run lint              # oxlint
npx shadcn@latest add <composant>   # ajouter un composant shadcn/ui
```

### Base de données (Docker)
```bash
cp .env.example .env    # définir MSSQL_SA_PASSWORD avant le premier lancement
docker compose up -d     # démarre SQL Server sur localhost:1433
docker compose down       # arrête le conteneur (les données persistent dans le volume)
```
La chaîne de connexion de `backend/src/Backend.Api/appsettings.Development.json` doit utiliser le même mot de passe que `.env`.

## Notes
- Cible `.NET 8` explicitement (le SDK installé peut être plus récent — les projets épinglent `<TargetFramework>net8.0</TargetFramework>` et les packages EF Core sont épinglés en version `8.0.x`).
- CORS de l'Api autorise par défaut `http://localhost:5173` (`Cors:AllowedOrigins` dans `appsettings.json`).
