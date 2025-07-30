'use client'
import { useEffect, useState } from 'react'

interface Props {
  idServicio: string
  autorId: string
  nombreAutor: string
}

export default function Resenas({ idServicio, autorId, nombreAutor }: Props) {
  const [comentario, setComentario] = useState('')
  const [calificacion, setCalificacion] = useState(5)
  const [resenas, setResenas] = useState<any[]>([])

  useEffect(() => {
    if (!idServicio) return
    fetch(`/api/resenas?idServicio=${idServicio}`)
      .then(res => res.json())
      .then(data => setResenas(data))
  }, [idServicio])

  const publicarResena = async () => {
    if (comentario.trim().length < 3) return alert('El comentario es muy corto.')

    const res = await fetch('/api/resenas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idServicio, autorId, nombreAutor, comentario, calificacion }),
    })

    if (res.ok) {
      const nuevasResenas = await fetch(`/api/resenas?idServicio=${idServicio}`).then(r => r.json())
      setResenas(nuevasResenas)
      setComentario('')
      setCalificacion(5)
    }

    alert('¡Reseña publicada!')
  }

  return (
    <div className="mt-10 border-t pt-6">
      <h2 className="text-2xl font-semibold mb-4">Reseñas del servicio</h2>

      {resenas.length === 0 && <p className="text-gray-500">Aún no hay reseñas.</p>}

      <div className="space-y-4 mb-8">
        {resenas.map((r) => (
          <div key={r._id} className="bg-gray-50 p-4 rounded shadow-sm">
            <div className="flex justify-between mb-1">
              <strong>{r.nombreAutor}</strong>
              <span className="text-yellow-600">{r.calificacion} ⭐</span>
            </div>
            <p className="text-sm">{r.comentario}</p>
            <small className="text-gray-400">{new Date(r.fecha).toLocaleDateString()}</small>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Escribe tu reseña</h3>
        <textarea
          className="w-full border rounded p-2 mb-2"
          placeholder="Tu opinión sobre el servicio..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
        <div className="flex items-center mb-3">
          <label className="mr-2">Calificación:</label>
          <select
            className="border rounded px-2 py-1"
            value={calificacion}
            onChange={(e) => setCalificacion(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
          </select>
        </div>
        <button
          onClick={publicarResena}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Publicar reseña
        </button>
      </div>
    </div>
  )
}
