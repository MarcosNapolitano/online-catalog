import Link from 'next/link'
import backgroundImage from '@/../public/img/back.webp'
 
export default function NotFound() {
  return (
    <section id="0" className="notFoundSection" style={{ backgroundImage: `url(${backgroundImage.src})`, minHeight: "100dvh" }}>
      <div className='notFound'>
        <h2>404 - No Encontrado</h2>
        <p>Por acá no es!</p>
        <Link href="/">Volver</Link>
      </div>
    </section>
  )
}
