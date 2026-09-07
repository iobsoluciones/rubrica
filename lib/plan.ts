/**
 * CAPACIDADES DEL PLAN
 * ---------------------------------------------------------------
 * Las capacidades se leen de la tabla `planes`, nunca del código: subir
 * a un cliente de Básico a Pro tiene que ser cambiarle una fila, no
 * desplegar una versión.
 *
 * Qué NO se limita, y por qué: el plan Básico conserva **todos los
 * módulos del SG-SST**. Quitarle las fases de Verificar y Actuar dejaba
 * ocho fuentes de la bandeja de pendientes apuntando a pantallas
 * cerradas, el panel principal sin semáforo, y —lo que decide el
 * asunto— al cliente sin poder investigar un accidente dentro de los 15
 * días que exige la Res. 1401 de 2007. Un plan que falla justo el día
 * del accidente no es un plan barato, es un producto roto.
 *
 * Lo que sí se limita son tres comodidades. Sin ellas se puede hacer el
 * SG-SST completo; solo cuesta más trabajo manual.
 */
import { crearClienteServidor } from '@/lib/supabase/servidor';
import { obtenerPerfil } from '@/lib/sesion';

export type Capacidades = {
  nombre: string;
  /** Descargar reportes en Excel. Los PDF nunca se limitan. */
  reportesExcel: boolean;
  /** Duplicar, crear e importar estándares, normas y plantillas. */
  catalogosPropios: boolean;
  /** Programar inspecciones por frecuencia y recibir recordatorios. */
  programacionInspecciones: boolean;
  /** Diseñar el encabezado de los documentos (ya existía). */
  encabezadoPersonalizable: boolean;
};

/** Ante la duda, se concede: un fallo de lectura no debe bloquear a
 *  quien sí pagó. El límite real vive en la fila del plan. */
const TODO: Capacidades = {
  nombre: 'actual',
  reportesExcel: true,
  catalogosPropios: true,
  programacionInspecciones: true,
  encabezadoPersonalizable: true,
};

export async function capacidadesDelPlan(): Promise<Capacidades> {
  const perfil = await obtenerPerfil();
  if (!perfil) return TODO;

  const supabase = await crearClienteServidor();
  const { data } = await supabase
    .from('planes')
    .select('nombre, reportes_excel, catalogos_propios, programacion_inspecciones, encabezado_personalizable')
    .eq('codigo', perfil.organizacion.plan)
    .maybeSingle();

  if (!data) return TODO;

  return {
    nombre: data.nombre ?? 'actual',
    reportesExcel: Boolean(data.reportes_excel),
    catalogosPropios: Boolean(data.catalogos_propios),
    programacionInspecciones: Boolean(data.programacion_inspecciones),
    encabezadoPersonalizable: Boolean(data.encabezado_personalizable),
  };
}

/** Mensaje único para las tres, para que el usuario lea siempre lo
 *  mismo y sepa que es el plan y no un error suyo. */
export function mensajePlan(que: string, plan: string): string {
  return `${que} está disponible desde el plan Pro. Tu plan ${plan} ` +
         'conserva todos los módulos del SG-SST.';
}
