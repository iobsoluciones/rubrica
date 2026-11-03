# Rúbrica — Contexto del proyecto

> Documento de referencia para Claude Code. Describe el estado del proyecto, sus decisiones de arquitectura y sus convenciones. **Léelo completo antes de tocar código.**
>
> Documentación de apoyo en `docs/`:
> - **[docs/DOCUMENTACION-TECNICA.md](docs/DOCUMENTACION-TECNICA.md)** — inventario completo de lo implementado (33 tablas, ~110 funciones, 15 triggers, 52 páginas), modelo de seguridad, estado de verificación y deuda técnica.
> - **[docs/PLAN-DE-TRABAJO.md](docs/PLAN-DE-TRABAJO.md)** — ruta de trabajo por fases derivada de la evaluación contra la Res. 0312. **Consúltalo antes de proponer funcionalidad nueva.**

---

> Contexto completo (modelo de datos, reglas de negocio, funcionalidades, aprendizajes, pendientes):
> **`docs/contexto-proyecto.md`**. Lee solo la sección que necesite la tarea (busca por su título con Grep).

## 2. Tecnologías

| Capa | Tecnología |
|---|---|
| Framework | **Next.js 16.3 + Turbopack**, App Router |
| Lenguaje | TypeScript, React (Server Components + Server Actions) |
| Backend / BD | **Supabase** — proyecto `thqjfindzmifeepxuwhp`, región `us-west-2` |
| Auth / sesión | `@supabase/ssr` (sesión por cookies, validada en middleware) |
| Estilos | **Inline styles** — objeto `const e/s/est: Record<string, React.CSSProperties>`. **No hay Tailwind.** |
| PDF | `@react-pdf/renderer` |
| Excel | `xlsx` (SheetJS) |
| QR | `qrcode.react` |
| Correo | **Resend** |
| Despliegue | **Vercel**, desde GitHub |

### Variables de entorno (declarar en Vercel, no viven en el repo)

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, `RESEND_API_KEY`, `RESEND_FROM`, **`SUPABASE_SERVICE_ROLE_KEY`** (secreta, solo servidor — la usan el registro directo y el cron), **`CRON_SECRET`** (secreta — sin ella el cron de recordatorios se niega a correr).

> Las `NEXT_PUBLIC_*` se incrustan **en el build**: si se agregan o cambian en Vercel, hay que **redeployar**.

---

## 7. Protocolo de verificación pre-entrega (6 comprobaciones)

Aplicar a **cada** cambio de código antes de darlo por terminado — nacieron de errores costosos reales:

1. **No hay `export const/let/var/function` en archivos `'use server'`** (solo exports async).
2. **Los imports coinciden con los exports** del archivo destino (nombre y módulo correctos).
3. **Las props que pasa la página == las que declara el componente.**
4. **Las rutas relativas resuelven** a archivos existentes.
5. **Paréntesis y llaves balanceados** en el JSX.
6. **`npx tsc --noEmit` sin errores nuevos** — el build no valida tipos (§5.18).

Además:
- **PDFs**: renderizar de verdad (react-pdf) antes de entregar, y verificar que los estilos usados **existen** en la hoja del documento.
- **Funciones de base**: probar la llamada real con datos. Método seguro: un bloque `DO $$ … RAISE EXCEPTION $$` que revierte la transacción, y después comprobar que no quedaron restos.
- **Parchear funciones SQL largas** con `pg_get_functiondef` + `replace` + `execute`, en vez de transcribir miles de caracteres a mano.
- **No dar por buena una conclusión sacada solo del código** cuando hay un dato observable que la contradice (§6, fila del calendario).

---

## 10. Cómo trabajar en este repo (para Claude Code)

- **Responde y comenta en español.**
- **Estilos inline**, nunca Tailwind ni CSS externo. Paleta base: azul `#14263F`, texto secundario `#5B6470`, bordes `#E4E4DF`; el color de acento sale de `empresa.color_primario`.
- Server Actions en `lib/acciones-*.ts` con `'use server'` (solo exports async).
- Toda tabla nueva: RLS habilitado + 4 políticas (select/insert/update/delete con `org_id = mi_org_id()`) + `grant` a `authenticated`.
- Antes de dar por terminado un cambio, corre las **6 comprobaciones del §7**.
- No borres datos del usuario en la base al probar; crea, verifica y limpia solo lo que creaste.
- **Ediciones quirúrgicas**: cambia solo las líneas necesarias, nunca reescribas un archivo completo.

   ## Convenciones de Git
   - Tras cada cambio verificado, crea UN commit con mensaje convencional
     (feat:, fix:, refactor:, docs:).
   - Ejecuta `npm run build` **y `npx tsc --noEmit`** antes de commitear; no commitees si fallan.
   - Haz push a GitHub después de cada commit.
   - No incluyas secretos ni .env en los commits.
## Índice del contexto completo (`docs/contexto-proyecto.md`)

- 1. Nombre y propósito
- 3. Estructura de archivos
- 4. Funcionalidades implementadas
- 5. Decisiones de arquitectura clave
- 6. Problemas resueltos (y sus lecciones)
- 8. Modelo de datos (tablas principales)
- 8b. Alcance frente al SG-SST (evaluación del 29-ago-2026)
- 9. Pendientes por hacer

Antes de cambiar arquitectura, encabezados/firmas o el modelo de datos, lee «5. Decisiones de arquitectura clave» y «6. Problemas resueltos».
