import { useState, useEffect } from 'react'

function App() {
  const [tickets, setTickets] = useState([])
  const [descripcion, setDescripcion] = useState('')

 const cargarTickets = () => {
  fetch('http://localhost:3000/api/tickets')
    .then(res => res.json())
    .then(data => {
      setTickets([])
      setTimeout(() => setTickets(data), 10)
    })
}

  useEffect(() => {
    cargarTickets()
  }, [])

  const crearTicket = () => {
    if (!descripcion) return

    fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descripcion })
    })
      .then(res => res.json())
      .then(() => {
        setDescripcion('')
        cargarTickets()
      })
  }

const cambiarEstado = (ticket) => {
  const estados = ['Abierto', 'En progreso', 'Cerrado']
  const indexActual = estados.indexOf(ticket.estado)
  const siguiente = estados[(indexActual + 1) % estados.length]

  console.log('Estado actual:', ticket.estado, '→ Siguiente:', siguiente)

  fetch(`http://localhost:3000/api/tickets/${ticket.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      descripcion: ticket.descripcion,
      prioridad: ticket.prioridad,
      estado: siguiente
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log('Respuesta API:', data)
      cargarTickets()
    })
}

  const eliminarTicket = (id) => {
    fetch(`http://localhost:3000/api/tickets/${id}`, {
      method: 'DELETE'
    }).then(() => cargarTickets())
  }

  const colorPrioridad = (prioridad) => {
    if (prioridad === 'alta') return '#e74c3c'
    if (prioridad === 'media') return '#f39c12'
    return '#27ae60'
  }

  return (
    <div style={{ maxWidth: '640px', margin: '40px auto', fontFamily: 'Arial', padding: '0 16px' }}>
      <h1 style={{ marginBottom: '24px' }}>🎫 TicketFlow</h1>

      {/* Formulario */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        <input
          type="text"
          placeholder="Describí el problema..."
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && crearTicket()}
          style={{ flex: 1, padding: '10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #444', background: '#1a1a1a', color: 'white' }}
        />
        <button
          onClick={crearTicket}
          style={{ padding: '10px 18px', borderRadius: '6px', border: 'none', background: '#4f46e5', color: 'white', cursor: 'pointer', fontSize: '15px' }}
        >
          + Crear
        </button>
      </div>

      {/* Lista de tickets */}
      {tickets.length === 0 && (
        <p style={{ color: '#888', textAlign: 'center' }}>No hay tickets aún. ¡Creá el primero!</p>
      )}

      {tickets.map(ticket => (
        <div key={ticket.id} style={{
          border: `2px solid ${colorPrioridad(ticket.prioridad)}`,
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{ margin: '0 0 6px 0', fontSize: '15px' }}>{ticket.descripcion}</p>
            <small style={{ color: colorPrioridad(ticket.prioridad), fontWeight: 'bold' }}>
              {ticket.prioridad.toUpperCase()}
            </small>
            <small style={{ color: '#aaa', marginLeft: '8px' }}>
              | {ticket.estado}
            </small>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => cambiarEstado(ticket)}
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #555', background: '#2a2a2a', color: 'white', cursor: 'pointer', fontSize: '12px' }}
            >
              🔄
            </button>
            <button
              onClick={() => eliminarTicket(ticket.id)}
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e74c3c', background: 'transparent', color: '#e74c3c', cursor: 'pointer', fontSize: '12px' }}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App