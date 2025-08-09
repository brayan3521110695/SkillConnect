// app/aviso-de-privacidad/page.tsx
export default function AvisoDePrivacidad() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Hero: imagen + texto */}
      <section className="grid gap-8 lg:grid-cols-2 items-center">
        <div className="flex justify-center">
          <img
            src="/images/logo.png"
            alt="SkillConnect"
            className="w-full max-w-md h-auto drop-shadow"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-blue-700">Aviso de Privacidad</h1>
          <p className="mt-3 text-gray-700">
            En <strong>SkillConnect</strong> usamos tu información para lo esencial:
            crear tu cuenta, mostrar tu perfil y reseñas, permitir el chat y ayudarte
            a conectar clientes con trabajadores.
          </p>
        </div>
      </section>

      {/* Bloques breves y concretos */}
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold">1) Qué datos usamos</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            <li>Cuenta: nombre, correo y contraseña (cifrada).</li>
            <li>
              Perfil público: foto, oficio/servicios, descripción y zona que tú decidas mostrar.
            </li>
            <li>
              Actividad en la plataforma: <b>chats</b>, <b>reseñas</b> y
              <b> publicaciones/fotos</b> que subes.
            </li>
            <li>Datos técnicos mínimos (IP/dispositivo) para seguridad y rendimiento.</li>
            <li>Pagos (si aplica): montos/estatus vía pasarela. <em>No guardamos tarjetas.</em></li>
          </ul>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold">2) Para qué los usamos</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            <li>Crear tu cuenta y mantener tu sesión.</li>
            <li>
              Mostrar tu perfil en <b>búsquedas y listados</b> para que te contacten.
            </li>
            <li>Habilitar el <b>chat</b> y la gestión de solicitudes/servicios.</li>
            <li>Notificaciones y soporte cuando lo necesites.</li>
            <li>Seguridad (prevención de abuso/fraude) y mejora del servicio.</li>
          </ul>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold">3) Lo que NO hacemos</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            <li><b>No vendemos</b> tu información.</li>
            <li>No publicamos tu correo/teléfono sin tu consentimiento.</li>
            <li>No almacenamos contraseñas en texto plano.</li>
          </ul>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold">4) Tu control y tiempos</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            <li>Puedes editar u ocultar info de tu perfil cuando quieras.</li>
            <li>
              Puedes pedir la <b>eliminación de tu cuenta</b>; conservamos lo mínimo por temas
              legales (p. ej., comprobantes) y registros de seguridad.
            </li>
            <li>Guardamos la actividad lo razonable para operar (p. ej., soporte/seguridad).</li>
          </ul>
        </div>
      </section>

      {/* Cookies y derechos */}
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold">Cookies</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            <li>De sesión: mantenerte logueado y segura la navegación.</li>
            <li>Preferencias mínimas (ej. interfaz). No hacemos tracking invasivo.</li>
          </ul>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold">Tus derechos</h2>
          <p className="mt-2 text-sm text-gray-700">
            Puedes <b>acceder, corregir u oponerte</b> al uso de tus datos y solicitar la
            eliminación de tu cuenta.
          </p>
          <p className="mt-2 text-sm text-gray-700">
            Escríbenos a:{" "}
            <a href="mailto:soporte@skillconnect.com" className="text-blue-600 underline">
              soporte@skillconnect.com
            </a>
          </p>
        </div>
      </section>

      <p className="mt-6 text-xs text-gray-500">
        Si cambiamos algo importante te avisaremos aquí. Este texto resume cómo usamos tus datos en SkillConnect.
      </p>
    </main>
  );
}
