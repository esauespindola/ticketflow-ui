import { useState, useEffect } from 'react'

function App() {
  const [tickets, setTickets] = useState([])
  const [descripcion, setDescripcion] = useState('')

  // Cargar tickets al iniciar
  useEffect(() => {
    fetch('http://localhost:3000/api/tickets')
      .then(res => res.json())
      .then(data => setTickets(data))
  }, [])

  // Crear ticket
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
        // Recargar tickets
        fetch('http://localhost:3000/api/tickets')
          .then(res => res.json())
          .then(data => setTickets(data))
      })
  }

  const colorPrioridad = (prioridad) => {
    if (prioridad === 'alta') return 'red'
    if (prioridad === 'media') return 'orange'
    return 'green'
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>🎫 TicketFlow</h1>

      {/* Formulario */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Describí el problema..."
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          style={{ flex: 1, padding: '8px', fontSize: '16px' }}
        />
        <button onClick={crearTicket} style={{ padding: '8px 16px' }}>
          + Crear
        </button>
      </div>

      {/* Lista de tickets */}
      {tickets.map(ticket => (
        <div key={ticket.id} style={{
          border: `2px solid ${colorPrioridad(ticket.prioridad)}`,
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px'
        }}>
          <p style={{ margin: 0 }}>{ticket.descripcion}</p>
          <small style={{ color: colorPrioridad(ticket.prioridad) }}>
            {ticket.prioridad.toUpperCase()} | {ticket.estado}
          </small>
        </div>
      ))}
    </div>
  )
}

export default App