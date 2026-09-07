/**
 * DESCARGA DE EXCEL DE UNA CAPACITACIÓN — /api/excel/[id]
 *
 * runtime = 'nodejs': SheetJS necesita APIs de Node.
 * La autorización la resuelve RLS dentro del generador.
 */
import { excelCapacitacion } from '@/lib/excel';
import { capacidadesDelPlan, mensajePlan } from '@/lib/plan';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TIPO = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Los reportes en Excel son del plan Pro. Se comprueba aquí y no
  // solo en el botón porque una URL se puede escribir a mano.
  const cap = await capacidadesDelPlan();
  if (!cap.reportesExcel) {
    return new Response(mensajePlan('La descarga en Excel', cap.nombre), { status: 403 });
  }

  const { id } = await params;
  const r = await excelCapacitacion(id);

  if (!r.ok) return new Response(r.error, { status: 404 });

  return new Response(new Uint8Array(r.buffer), {
    headers: {
      'Content-Type': TIPO,
      'Content-Disposition': `attachment; filename="${r.nombreArchivo}"`,
      'Cache-Control': 'no-store',
    },
  });
}
