---
name: sync-notion-finance
description: Refresca el snapshot de datos del Finance Tracker de Notion que alimenta el dashboard financiero y redespliega a Vercel. Usar cuando el usuario pida "sincroniza el dashboard financiero", "actualiza los datos de Notion", o como parte de la rutina diaria programada del dashboard financiero.
---

# Sync Notion Finance Tracker → Dashboard

Regenera los 6 JSON de `data/` a partir del snapshot actual de Notion, valida
que no rompen la app, y redespliega a producción en Vercel. Diseñada para
ejecutarse de punta a punta sin intervención (rutina diaria), pero también se
puede invocar manualmente.

## Dónde corre esto

Repo: https://github.com/jandroogm0/fintrack-dashboard (público, sin datos
reales — `data/*.json` está gitignorado y se regenera en cada ejecución).

- Si estás trabajando en local sobre el checkout completo del usuario, el
  proyecto vive en `NOTION/dashboard/app/` y todas las rutas de este
  documento son relativas a esa carpeta.
- Si estás en un checkout limpio de ese repo (p. ej. la rutina programada en
  la nube), la raíz del checkout **ya es** esa carpeta — no hay un nivel
  `NOTION/dashboard/app/` anidado. Todas las rutas de este documento
  (`data/`, `lib/types.ts`, etc.) son relativas a la raíz del repo tal cual
  lo tengas delante; no antepongas `NOTION/dashboard/app/`.

## Contexto fijo (no rediscovers cada vez)

Data sources de Notion ya localizados — usar directamente, no buscar de nuevo:

| Data source | URL (`collection://…`) |
|---|---|
| Accounts | `collection://b179acb9-ee56-435c-869a-7d754f136067` |
| Expenses Breakdown | `collection://db59c225-211d-4147-a04d-7509ced659fa` |
| Incomes Breakdown | `collection://067db53d-dec2-4634-8f3f-7c2e12ddef26` |
| Transfers | `collection://38fddc96-4a62-45d3-a9fb-9e013d4bd703` |
| Expense Categories | `collection://7c2191d0-6c64-4759-abf2-b29f3db7f4d1` |
| Income Categories | `collection://a692c162-07a4-4dbe-b378-7fcda56e2cee` |

Contrato de tipos ya definido en `lib/types.ts` (`Account`, `Category`,
`RawExpense`, `RawIncome`, `RawTransfer`) — los JSON generados deben
cumplirlo exactamente, mismos nombres de campo.

## Paso 1 — Extraer el snapshot completo de Notion

Usa las herramientas MCP de Notion (`notion-query-data-sources`, modo `sql`).
Para cada data source, pide solo las columnas necesarias (nunca `SELECT *`:
los data sources tienen decenas de columnas de relación mes-a-mes que
disparan el tamaño de la respuesta y no se usan).

**Accounts** — todas las filas (hoy ~22, crecerán poco):
```sql
SELECT url, "Name", "Tipo Cuenta", "Tipo renta", "Start"
FROM "collection://b179acb9-ee56-435c-869a-7d754f136067"
```

**Expense Categories** — todas las filas (hoy ~25, cambian poco):
```sql
SELECT url, "Name", "Monthly Budget"
FROM "collection://7c2191d0-6c64-4759-abf2-b29f3db7f4d1"
```

**Income Categories** — todas las filas (hoy ~10):
```sql
SELECT url, "Name"
FROM "collection://a692c162-07a4-4dbe-b378-7fcda56e2cee"
```

**Expenses / Incomes / Transfers** — estas crecen cada día. La query SQL de
Notion trunca alrededor de ~100 filas por llamada aunque no lo declare
siempre en `has_more`; por eso:
1. Primero pide el conteo total y el rango de fechas:
   ```sql
   SELECT COUNT(*) as cnt, MIN("date:Date:start") as min_date, MAX("date:Date:start") as max_date
   FROM "collection://<...>"
   ```
2. Pide las columnas reales ordenadas por fecha descendente:
   - Expenses: `"Name", "Amount", "date:Date:start", "Accounts", "Expense Category"`
   - Incomes: `"Name", "Amount", "date:Date:start", "Accounts", "Income Category"`
   - Transfers: `"Name", "Amount", "date:Date:start", "Transfer From", "Transfer To"`
3. Si el número de filas devuelto es menor que `cnt` del paso 1, repite con
   `WHERE "date:Date:start" < '<fecha más antigua ya vista>'` hasta acumular
   todas las filas (igual que se hizo la primera vez, ver commits de la Fase 1).

## Paso 2 — Normalizar a los 6 JSON

Para cada cuenta/categoría, el `id` es la URL de Notion sin `https://app.notion.com/`
y sin guiones (32 caracteres hex). Las columnas de relación (`Accounts`,
`Expense Category`, etc.) llegan como `["https://app.notion.com/<hash>"]` —
extrae ese mismo hash sin guiones para poblar `accountId`/`categoryId`/
`fromAccountId`/`toAccountId`.

Escribe en `data/`:
- `accounts.json` → `{ id, name, tipoCuenta, tipoRenta, start }[]`
- `expense-categories.json` → `{ id, name, monthlyBudget }[]`
- `income-categories.json` → `{ id, name }[]`
- `expenses.json` → `{ name, amount, date, accountId, categoryId }[]`
- `incomes.json` → `{ name, amount, date, accountId, categoryId }[]`
- `transfers.json` → `{ name, amount, date, fromAccountId, toAccountId }[]`

`date` en formato `YYYY-MM-DD` (usar `date:Date:start`, cortar a 10 caracteres).

## Paso 3 — Validar integridad referencial

Antes de dar el sync por bueno, comprobar con un script Node rápido (mismo
patrón que en la Fase 1) que:
- Todo `accountId`/`fromAccountId`/`toAccountId` existe en `accounts.json`.
- Todo `categoryId` de `expenses.json` existe en `expense-categories.json`.
- Todo `categoryId` de `incomes.json` existe en `income-categories.json`.

Si hay huecos, **no** continuar al deploy — reportar el error con detalle
(qué fila, qué id falta) en vez de desplegar datos rotos.

## Paso 4 — Build y redeploy

En un checkout limpio no hay `node_modules/`:
```bash
npm install
npm run build   # valida tipos + genera las 5 rutas estáticas; debe salir limpio
```

Si el build falla, **no desplegar** — el sitio en producción debe seguir
sirviendo el snapshot anterior antes que uno roto.

`.vercel/` está gitignorado (contiene solo IDs, no secretos, pero no viaja con
el repo), así que en un checkout fresco (p. ej. el del agente en la nube) no
hay proyecto vinculado. En vez de `vercel link`, usa las variables de entorno
que sustituyen a `.vercel/project.json`:

```bash
export VERCEL_ORG_ID="team_fERPtyeeQh3SlnqbtK7CyMFo"
export VERCEL_PROJECT_ID="prj_Z6aTJ46qRaXdZ0gib9DtCLQgie7t"
npx vercel --prod --yes --token "$VERCEL_TOKEN"
```

`VERCEL_TOKEN` debe estar disponible como variable de entorno en el entorno
donde corre esta skill (secreto de la rutina programada, nunca hardcodeado ni
committeado). `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` no son secretos (son solo
identificadores), pueden ir fijos en el prompt/config de la rutina.

## Paso 5 — Resumen

`data/*.json` está gitignorado (nunca hay histórico en git para diffear), así
que el conteo de "filas nuevas" solo se puede saber comparando con lo que
reportó la ejecución anterior (si tienes acceso a ese reporte), no con `git
diff`. Al terminar, reporta en una frase: rango de fechas cubierto (min/max
`date`), nº total de filas por fuente (expenses/incomes/transfers), y la URL
de producción. Si algo falló en el paso 3 o 4, reporta el fallo igual de
claro — no digas "sincronizado" si no se desplegó.
