/**
 * DESCARGA DE EXCEL COMPLETO — /api/excel/todo
 *
 * Tres hojas: Capacitaciones, Participantes y Por persona.
 * La última responde la pregunta del documento de ideas: quién
 * participa más y quién menos.
 */
import { excelTodo } from '@/lib/excel';
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

  const r = await excelTodo();

  if (!r.ok) return new Response(r.error, { status: 403 });

  return new Response(new Uint8Array(r.buffer), {
    headers: {
      'Content-Type': TIPO,
      'Content-Disposition': `attachment; filename="${r.nombreArchivo}"`,
      'Cache-Control': 'no-store',
    },
  });
}
