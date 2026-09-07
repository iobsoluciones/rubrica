/**
 * DESCARGA DEL KARDEX — /api/kardex
 * Parámetros: ?articulo=id (opcional) &desde=YYYY-MM-DD &hasta=YYYY-MM-DD
 * Sin 'articulo' exporta todos los elementos.
 */
import { generarKardex } from '@/lib/excel/generarKardex';
import { empresaActiva } from '@/lib/empresa-activa';
import { capacidadesDelPlan, mensajePlan } from '@/lib/plan';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
  const articulo = url.searchParams.get('articulo');
  const desde = url.searchParams.get('desde');
  const hasta = url.searchParams.get('hasta');

  const r = await generarKardex(
    empresa.id,
    articulo && articulo !== 'todos' ? articulo : null,
    desde,
    hasta
  );

  if (!r.ok) return new Response(r.error, { status: 404 });

  return new Response(new Uint8Array(r.buffer), {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${r.nombreArchivo}"`,
      'Cache-Control': 'no-store',
    },
  });
}
