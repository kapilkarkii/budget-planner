export const fireConfetti = (originX = 0.5, originY = 0.5) => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return

  const canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100vw'
  canvas.style.height = '100vh'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '9999'
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  const colors = ['#006c49', '#6cf8bb', '#f59e0b', '#131b2e', '#ba1a1a']
  const count = 120
  const particles = Array.from({ length: count }, () => ({
    x: canvas.width * originX,
    y: canvas.height * originY,
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -14 - 4,
    size: Math.random() * 6 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 20,
    gravity: 0.35,
    life: 1,
  }))

  let frame
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let alive = false

    particles.forEach((p) => {
      if (p.life <= 0) return
      alive = true
      p.vy += p.gravity
      p.x += p.vx
      p.y += p.vy
      p.rotation += p.rotSpeed
      p.life -= 0.012

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = Math.max(p.life, 0)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
      ctx.restore()
    })

    if (alive) {
      frame = requestAnimationFrame(animate)
    } else {
      cancelAnimationFrame(frame)
      canvas.remove()
    }
  }
  animate()
}