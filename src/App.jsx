import { useState, useEffect } from 'react'

const estilos = {
  app: {
    minHeight: '100vh',
    background: '#0f0f13',
    color: '#e2e2e2',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    padding: '40px 16px'
  },
  contenedor: {
    maxWidth: '680px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '32px'
  },
  titulo: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 4px 0',
    color: '#ffffff'
  },
  subtitulo: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  formulario: {
    display: 'flex',
    gap: '10px',
    marginBottom: '32px'
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '1px solid #2a2a2a',
    background: '#1a1a1f',
    color: '#e2e2e2',
    outline: 'none'
  },
  botonCrear: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    background: '#4f46e5',
    color: 'white',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  vacio: {
    textAlign: 'center',
    color: '#444',
    marginTop: '60px',
    fontSize: '15px'
  },
  ticket: {
    borderRadius: '10px',
    padding: '16px 20px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#1a1a1f',
    borderLeft: '4px solid'
  },
  descripcion: {
    margin: '0 0 8px 0',
    fontSize: '15px',
    color: '#e2e2e2'
  },
  badges: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  badge: {
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px'
  },
  acciones: {
    display: 'flex',
    gap: '8px'
  },
  botonAccion: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #2a2a2a',
    background: '#222228',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '14px'
  },
  botonEliminar: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #3a1a1a',
    background: 'transparent',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '14px'
  }
}

const colorPrioridad = (prioridad) => {
  if (prioridad === 'alta') return '#e74c3c'
  if (prioridad === 'media') return '#f39c12'
  return '#27ae60'
}

const colorEstado = (estado) => {
  if (estado === 'Abierto') return { bg: '#1a2a3a', color: '#4a9eda' }
  if (estado === 'En progreso') return { bg: '#2a2a1a', color: '#f39c12' }
  return { bg: '#1a2a1a', color: '#27ae60' }
}

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
    const siguiente = estados[(estados.indexOf(ticket.estado) + 1) % estados.length]
    fetch(`http://localhost:3000/api/tickets/${ticket.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descripcion: ticket.descripcion, prioridad: ticket.prioridad, estado: siguiente })
    }).then(() => cargarTickets())
  }

  const eliminarTicket = (id) => {
    fetch(`http://localhost:3000/api/tickets/${id}`, { method: 'DELETE' })
      .then(() => cargarTickets())
  }

  return (
    <div style={estilos.app}>
      <div style={estilos.contenedor}>

        <div style={estilos.header}>
          <h1 style={estilos.titulo}>🎫 TicketFlow</h1>
          <p style={estilos.subtitulo}>{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} activo{tickets.length !== 1 ? 's' : ''}</p>
        </div>

        <div style={estilos.formulario}>
          <input
            style={estilos.input}
            type="text"
            placeholder="Describí el problema..."
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && crearTicket()}
          />
          <button style={estilos.botonCrear} onClick={crearTicket}>
            + Crear
          </button>
        </div>

        {tickets.length === 0 && (
          <p style={estilos.vacio}>No hay tickets aún. ¡Creá el primero!</p>
        )}

        {tickets.map(ticket => {
          const estado = colorEstado(ticket.estado)
          return (
            <div key={ticket.id} style={{ ...estilos.ticket, borderLeftColor: colorPrioridad(ticket.prioridad) }}>
              <div>
                <p style={estilos.descripcion}>{ticket.descripcion}</p>
                <div style={estilos.badges}>
                  <span style={{ ...estilos.badge, background: colorPrioridad(ticket.prioridad) + '22', color: colorPrioridad(ticket.prioridad) }}>
                    {ticket.prioridad.toUpperCase()}
                  </span>
                  <span style={{ ...estilos.badge, background: estado.bg, color: estado.color }}>
                    {ticket.estado}
                  </span>
                </div>
              </div>
              <div style={estilos.acciones}>
                <button style={estilos.botonAccion} onClick={() => cambiarEstado(ticket)} title="Cambiar estado">
                  🔄
                </button>
                <button style={estilos.botonEliminar} onClick={() => eliminarTicket(ticket.id)} title="Eliminar">
                  🗑️
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App