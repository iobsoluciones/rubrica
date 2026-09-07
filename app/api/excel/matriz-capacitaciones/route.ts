/**
 * MATRIZ DE CAPACITACIONES EN EXCEL — /api/excel/matriz-capacitaciones
 * Parámetros opcionales: ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
 * Sin ellos toma el año en curso, igual que la pantalla.
 */
import { generarExcelMatrizCapacitaciones } from '@/lib/excel/generarMatrices';
import { empresaActiva } from '@/lib/empresa-activa';
import { capacidadesDelPlan, mensajePlan } from '@/lib/plan';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TIPO = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export async function GET(request: Request) {
  // Los reportes en Excel son del plan Pro. Se comprueba aquí y no
  // solo en el botón porque una URL se puede escribir a mano.
  const cap = await capacidadesDelPlan();
  if (!cap.reportesExcel) {
    return new Response(mensajePlan('La descarga en Excel', cap.nombre), { status: 403 });
  }

  const empresa = await empresaActiva();
  if (!empresa) return new Response('No hay empresa seleccionada.', { status: 400 });

  const url = new URL(request.url);
  const anio = new Date().getFullYear();
  const desde = url.searchParams.get('desde') ?? `${anio}-01-01`;
  const hasta = url.searchParams.get('hasta') ?? `${anio}-12-31`;

  const r = await generarExcelMatrizCapacitaciones(empresa.id, empresa.nombre, desde, hasta);
  if (!r.ok) return new Response(r.error, { status: 404 });

  return new Response(new Uint8Array(r.buffer), {
    headers: {
      'Content-Type': TIPO,
      'Content-Disposition': `attachment; filename="${r.nombreArchivo}"`,
      'Cache-Control': 'no-store',
    },
  });
}
