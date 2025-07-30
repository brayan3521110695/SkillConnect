export default function AvisoDePrivacidad() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Aviso de Privacidad</h1>

      <p className="mb-4">
        En <strong>SkillConnect</strong>, nos comprometemos a proteger tu información personal conforme a la
        Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">¿Qué datos recopilamos?</h2>
      <p className="mb-4">
        Recopilamos datos como tu nombre, correo electrónico, contraseña, rol de usuario (cliente o trabajador),
        así como cualquier otra información necesaria para brindarte nuestros servicios.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">¿Para qué usamos tus datos?</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Para crear y gestionar tu cuenta en SkillConnect.</li>
        <li>Para conectarte con clientes o trabajadores según tu rol.</li>
        <li>Para enviarte notificaciones importantes relacionadas con tu cuenta o servicios.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">¿Compartimos tu información?</h2>
      <p className="mb-4">
        No compartimos tus datos con terceros sin tu consentimiento, salvo que sea requerido por ley.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Derechos ARCO</h2>
      <p className="mb-4">
        Tienes derecho a acceder, rectificar, cancelar u oponerte al uso de tus datos personales.
        Para ejercer estos derechos, contáctanos en: <strong>soporte@skillconnect.com</strong>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Actualizaciones</h2>
      <p className="mb-4">
        Este aviso puede actualizarse. Te recomendamos revisarlo periódicamente.
      </p>

      <p className="text-sm text-gray-500 mt-8">
        Última actualización: julio de 2025
      </p>
    </div>
  );
}
