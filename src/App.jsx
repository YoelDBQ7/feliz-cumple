import { useEffect, useMemo, useRef, useState } from 'react'
import foto1 from './assets/foto1.jpg'
import foto2 from './assets/foto2.jpg'
import foto3 from './assets/foto3.jpg'
import foto4 from './assets/foto4.jpg'

/* ============================================================
   🎵 CANCIÓN: copia tu archivo mp3 en  public/musica/
   y renómbralo  cancion.mp3  (o cambia el nombre aquí abajo).
   Se reproduce automáticamente al llegar al mosaico.
   ============================================================ */
const SONG_SRC = `${import.meta.env.BASE_URL}musica/cancion.mp3`

const FOTOS = [
  { src: foto1, alt: 'Foto 1', mensaje: 'Verte feliz siempre es la mejor recompensa' },
  { src: foto2, alt: 'Foto 2', mensaje: 'Eres mi sonrisa bonita' },
  { src: foto3, alt: 'Foto 3', mensaje: 'Te amo mi blanquita preciosa' },
  { src: foto4, alt: 'Foto 4', mensaje: 'Toma, unas flores para ti pero ahora virtuales' },
]

function Rosa({ size = 120, className = '' }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <radialGradient id="petalo" cx="50%" cy="40%" r="65%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e9dff0" />
        </radialGradient>
      </defs>
      <g fill="url(#petalo)" stroke="#cdbbe0" strokeWidth="1">
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} transform={`rotate(${a} 60 60)`} d="M60 60 C30 55 22 18 60 8 C98 18 90 55 60 60Z" />
        ))}
        {[36, 108, 180, 252, 324].map((a) => (
          <path key={a} transform={`rotate(${a} 60 60)`} d="M60 60 C38 56 34 30 60 22 C86 30 82 56 60 60Z" />
        ))}
        <circle cx="60" cy="60" r="17" />
      </g>
      <path
        d="M60 50 C52 50 50 60 58 62 C66 64 70 54 62 48 C54 43 44 52 48 62"
        fill="none" stroke="#c4aedb" strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  )
}

function Corazon({ className = '', style }) {
  return (
    <svg viewBox="0 0 24 22" className={className} style={style} aria-hidden="true">
      <path d="M12 21C5 15 1 11.5 1 7.2 1 4 3.4 1.8 6.2 1.8c2.2 0 4.2 1.3 5.8 3.6 1.6-2.3 3.6-3.6 5.8-3.6C20.6 1.8 23 4 23 7.2 23 11.5 19 15 12 21Z" />
    </svg>
  )
}

/* Corazones morados que suben y pétalos que caen */
function Fondo() {
  const corazones = useMemo(
    () => Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 14 + Math.random() * 22,
      dur: 11 + Math.random() * 10,
      delay: -Math.random() * 20,
      tono: i % 3,
    })), [])
  const petalos = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 10 + Math.random() * 12,
      dur: 14 + Math.random() * 10,
      delay: -Math.random() * 24,
    })), [])

  return (
    <div className="fondo" aria-hidden="true">
      {petalos.map((p) => (
        <span key={p.id} className="petalo"
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.3, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }} />
      ))}
      {corazones.map((c) => (
        <Corazon key={c.id} className={`flota tono${c.tono}`}
          style={{ left: `${c.left}%`, width: c.size, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} />
      ))}
    </div>
  )
}

export default function App() {
  const [etapa, setEtapa] = useState(0) // 0 = primer botón, 1 = confirmación, 2 = mosaico
  const [abierta, setAbierta] = useState(null) // índice de la foto abierta
  const [vistas, setVistas] = useState([])
  const [suena, setSuena] = useState(false)
  const [hayCancion, setHayCancion] = useState(true)
  const audioRef = useRef(null)

  // Reproduce la canción al entrar al mosaico
  useEffect(() => {
    if (etapa !== 2 || !audioRef.current) return
    audioRef.current.volume = 0.7
    audioRef.current.play().then(() => setSuena(true)).catch(() => setSuena(false))
  }, [etapa])

  // Cerrar el mensaje con Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setAbierta(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const alternarMusica = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) a.play().then(() => setSuena(true)).catch(() => {})
    else { a.pause(); setSuena(false) }
  }

  const abrir = (i) => {
    setAbierta(i)
    setVistas((v) => (v.includes(i) ? v : [...v, i]))
  }

  return (
    <main className="escena">
      <Fondo />

      {etapa < 2 && (
        <section className="portada" key={etapa}>
          <Rosa size={150} className="rosa-grande" />
          <p className="pregunta">
            {etapa === 0
              ? 'Si eres de color de piel "blanca" presiona el botón'
              : 'Estás segura que eres blanca y quieres presionar el botón?'}
          </p>
          <button className="boton" onClick={() => setEtapa(etapa + 1)}>
            {etapa === 0 ? 'Presionar' : 'Sí, estoy segura'}
          </button>
        </section>
      )}

      {etapa === 2 && (
        <section className="mosaico-seccion">
          <Rosa size={64} className="rosa-mini" />
          <h1>Felices 21 años blanquita preciosa</h1>
          <p className="indicacion">Haz clic sobre cada imagen para ver los mensajes.</p>

          <div className="mosaico">
            {FOTOS.map((f, i) => (
              <button
                key={i}
                className={`foto foto-${i}`}
                style={{ animationDelay: `${0.5 + i * 1.3}s` }}
                onClick={() => abrir(i)}
                aria-label={`Ver mensaje de la foto ${i + 1}`}
              >
                <img src={f.src} alt={f.alt} />
                {vistas.includes(i) && <Corazon className="visto" />}
              </button>
            ))}
          </div>

          {hayCancion && (
            <button className="musica" onClick={alternarMusica}>
              {suena ? 'Pausar canción' : 'Reproducir canción'}
            </button>
          )}
          <audio ref={audioRef} src={SONG_SRC} loop preload="auto" onError={() => setHayCancion(false)} />
        </section>
      )}

      {abierta !== null && (
        <div className="velo" onClick={() => setAbierta(null)} role="dialog" aria-modal="true">
          <div className="carta" onClick={(e) => e.stopPropagation()}>
            <img src={FOTOS[abierta].src} alt={FOTOS[abierta].alt} />
            <Corazon className="carta-corazon" />
            <p>{FOTOS[abierta].mensaje}</p>
            <button className="boton chico" onClick={() => setAbierta(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </main>
  )
}
