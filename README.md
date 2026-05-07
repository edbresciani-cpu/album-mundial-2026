# Album Mundial 2026

Frontend de album digital con modo demo local y modo nube preparado para Supabase.

## Qué incluye hoy

- 12 selecciones con 26 jugadores + DT por país.
- 324 figuritas en total.
- 7 sobres semanales de 8 figuritas.
- Progreso local sin backend.
- Base de login real con Supabase.
- Esquema SQL para perfiles, inventario, sobres y trade offers.
- Seed SQL para poblar la tabla `stickers`.

## Stack

- React 18
- Vite 5
- Supabase JS
- Framer Motion
- Lucide React

## Ejecutar en demo

```bash
npm install
npm run dev
```

Si no configurás variables de entorno, la app corre en `modo demo` usando `localStorage`.

## Activar modo nube con Supabase

1. Crear un proyecto en Supabase.
2. Copiar `.env.example` a `.env`.
3. Completar:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

4. En Supabase SQL Editor ejecutar:
   - `supabase/schema.sql`
   - `supabase/seed.sql`

5. Levantar de nuevo la app:

```bash
npm run dev
```

## Publicar en Vercel

1. Subí este proyecto a GitHub.
2. En Vercel elegí `Add New Project`.
3. Importá el repositorio.
4. En `Environment Variables` cargá:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

5. Deploy.

Vercel debería detectar Vite automáticamente. También quedó incluido un [vercel.json](C:/Users/Emiliano%20Bresciani/Desktop/album-mundial-digital-mvp/vercel.json) mínimo para dejar el build explícito.

## Antes de publicar

- No subas `.env` al repo.
- Corré el SQL de [schema.sql](C:/Users/Emiliano%20Bresciani/Desktop/album-mundial-digital-mvp/supabase/schema.sql) en tu proyecto Supabase.
- Corré [seed.sql](C:/Users/Emiliano%20Bresciani/Desktop/album-mundial-digital-mvp/supabase/seed.sql) si la tabla `stickers` todavía no está cargada.
- Probá al menos: login, abrir sobre, logros e intercambio.

## Qué queda preparado

- `login` con email y contraseña.
- `profiles` por usuario.
- `user_stickers` para inventario persistente.
- `weekly_limits` para tope semanal.
- `pack_openings` para historial.
- `trade_offers` y `trade_offer_items` como base para intercambios.

## Próximo paso recomendado

1. Crear pantalla para enviar ofertas de intercambio entre amigos.
2. Añadir aceptación/rechazo de canjes.
3. Mostrar ranking o progreso compartido por grupo.
