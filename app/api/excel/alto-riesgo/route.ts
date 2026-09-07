/**
 * CONTRATISTAS Y ALTO RIESGO EN EXCEL — /api/excel/alto-riesgo
 * Contratistas con sus vencimientos y permisos de trabajo emitidos.
 */
import { generarExcelAltoRiesgo } from '@/lib/excel/generarAltoRiesgo';
import { empresaActiva } from '@/lib/empresa-activa';
import { capacidadesDelPlan, mensajePlan } from '@/lib/plan';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TIPO = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export async function GET() {
  // Los reportes en Excel son del plan Pro. Se comprueba aquí y no
  // solo en el botón porque una URL se puede escribir a mano.
  const cap = await capacidadesDelPlan();
  if (!cap.reportesExcel) {
    return new Response(mensajePlan('La descarga en Excel', cap.nombre), { status: 403 });
  }

  const empresa = await empresaActiva();
  if (!empresa) return new Response('No hay empresa seleccionada.', { status: 400 });

  const r = await generarExcelAltoRiesgo(empresa.id, empresa.nombre);

  if (!r.ok) return new Response(r.error, { status: 404 });

  return new Response(new Uint8Array(r.buffer), {
    headers: {
      'Content-Type': TIPO,
      'Content-Disposition': `attachment; filename="${r.nombreArchivo}"`,
      'Cache-Control': 'no-store',
    },
  });
}
