/**
 * BOTÓN DE WHATSAPP — página comercial
 * ---------------------------------------------------------------
 * Un consultor de SST que llega a esta página tiene una pregunta
 * concreta —«¿esto sirve para mi cliente de alturas?»— y no la va a
 * escribir en un formulario para esperar respuesta mañana. WhatsApp es
 * el canal donde de verdad se contesta en Colombia.
 *
 * No lleva 'use client': es un enlace. Añadir JavaScript a un `<a>` que
 * ya funciona solo sirve para retrasar el primer pintado.
 *
 * El mensaje va escrito de antemano para que la conversación no empiece
 * con un «hola» a secas: quien recibe sabe desde qué página escriben.
 */

/** Colombia (57) + celular. Sin espacios ni signos: wa.me los rechaza. */
const NUMERO = '573102475530';
const MENSAJE = 'Hola, vengo de la página de Rúbrica. Quiero saber cómo funciona para el SG-SST de mis clientes.';

export const ENLACE_WHATSAPP =
  `https://wa.me/${NUMERO}?text=${encodeURIComponent(MENSAJE)}`;

/** Glifo oficial, dibujado: una imagen externa sería una petición más. */
function Glifo({ tam = 30 }: { tam?: number }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 32 32" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.04 3.2c-7.08 0-12.83 5.75-12.83 12.83 0 2.26.6 4.47 1.73 6.42L3.1 28.8l6.5-1.7a12.78 12.78 0 0 0 6.43 1.73h.01c7.07 0 12.82-5.75 12.83-12.83a12.75 12.75 0 0 0-3.76-9.08 12.73 12.73 0 0 0-9.07-3.76zm0 23.2h-.01c-1.9 0-3.77-.51-5.4-1.48l-.39-.23-4.02 1.05 1.07-3.92-.25-.4a10.63 10.63 0 0 1-1.63-5.68c0-5.88 4.79-10.66 10.67-10.66 2.85 0 5.52 1.11 7.53 3.13a10.58 10.58 0 0 1 3.12 7.54c0 5.88-4.79 10.65-10.69 10.65zm5.85-7.98c-.32-.16-1.9-.94-2.19-1.04-.3-.11-.51-.16-.72.16-.21.32-.83 1.04-1.02 1.25-.19.21-.37.24-.69.08-.32-.16-1.36-.5-2.58-1.6-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.99-2.37-.26-.62-.52-.54-.72-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65 0 1.57 1.14 3.08 1.3 3.29.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.16-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37z"
      />
    </svg>
  );
}

/** Flotante, abajo a la derecha: el sitio donde se busca sin pensar. */
export default function BotonWhatsApp() {
  return (
    <>
      <a
        href={ENLACE_WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir por WhatsApp a IOB Soluciones"
        title="Escríbenos por WhatsApp"
        style={{
          position: 'fixed', right: 22, bottom: 22, zIndex: 50,
          display: 'flex', alignItems: 'center', gap: 10,
          // El verde es el de WhatsApp, no el de la marca: reconocerlo de
          // un vistazo es justo lo que hace que se pulse.
          background: '#25D366', color: '#fff',
          padding: '13px 20px 13px 16px', borderRadius: 999,
          textDecoration: 'none', fontSize: 14.5, fontWeight: 700,
          boxShadow: '0 6px 20px rgba(0,0,0,.18)',
        }}
        className="wa-flotante"
      >
        <Glifo />
        <span className="wa-texto">Escríbenos</span>
      </a>

      {/* La hoja va FUERA del enlace: dentro, su texto pasaba a formar
          parte del contenido del botón —un lector de pantalla llegaba a
          leer el CSS— y el nombre accesible dejaba de ser «Escríbenos». */}
      <style>{`
        /* En el móvil se queda solo el círculo: la etiqueta taparía
           contenido justo donde el pulgar ya llega sin ayuda. */
        @media (max-width: 620px) {
          .wa-texto { display: none; }
          .wa-flotante { padding: 14px !important; right: 16px !important; bottom: 16px !important; }
        }
      `}</style>
    </>
  );
}
