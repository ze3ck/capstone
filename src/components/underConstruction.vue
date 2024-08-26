<template>
  <div class="content" @click="generateBinary">
    <div id="plexus-container"></div>
    <!-- Contenedor para el plexus -->
    <div class="main-content">
      <h1 id="title">OptiFlow</h1>
      <div class="text-container">
        <p id="subtitle"></p>
        <span class="cursor">__</span>
      </div>
    </div>
    <Footer />
    <div id="binary-container"></div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import Footer from './Footer.vue'
import p5 from 'p5'

export default {
  name: 'UnderConstruction',
  components: {
    Footer
  },
  mounted() {
    // Registra el plugin de texto
    gsap.registerPlugin(TextPlugin)

    this.startCursorAnimation()
    this.focusEffect()

    gsap.to('#subtitle', {
      duration: 3,
      delay: 2,
      text: {
        value: '> Capstone - OptiFlow Dev Team.'
      },
      ease: 'power1.inOut'
    })

    this.createPlexusEffect() // Llama al método para crear el efecto Plexus
  },
  methods: {
    startCursorAnimation() {
      gsap.set('.cursor', { opacity: 1 })
      this.cursorTimeline = gsap.timeline({ repeat: -1 })
      this.cursorTimeline.to('.cursor', { opacity: 0, duration: 0.5, ease: 'power2.inOut' })
      this.cursorTimeline.to('.cursor', { opacity: 1, duration: 0.5, ease: 'power2.inOut' })
    },
    focusEffect() {
      // Enfoque progresivo
      gsap.fromTo(
        '#title',
        { opacity: 0, blur: 10, scale: 1.2 },
        {
          opacity: 1,
          blur: 0,
          scale: 1,
          duration: 2.5,
          ease: 'power2.out',
          onComplete: this.triggerGlitch
        }
      )
    },
    triggerGlitch() {
      // Configuración para que el glitch ocurra ocasionalmente
      const glitchTimeline = gsap.timeline({ repeat: -1, repeatDelay: 5 })

      glitchTimeline
        .to('#title', {
          duration: 0.1,
          x: Math.random() * 20 - 10,
          y: Math.random() * 20 - 10,
          color: '#ff00ff',
          textShadow: '2px 2px #00ff00',
          ease: 'none'
        })
        .to(
          '#title',
          {
            duration: 0.1,
            x: Math.random() * 20 - 10,
            y: Math.random() * 20 - 10,
            color: '#00ffff',
            textShadow: '2px 2px #ff0000',
            ease: 'none'
          },
          '+=0.05'
        )
        .to(
          '#title',
          {
            duration: 0.1,
            x: 0,
            y: 0,
            color: 'white',
            textShadow: '2px 2px rgba(0, 0, 0, 0.5)',
            ease: 'none'
          },
          '+=0.05'
        )
    },
    generateBinary(event) {
      const binaryContainer = document.getElementById('binary-container')
      const binaryElement = document.createElement('div')
      binaryElement.classList.add('binary')
      binaryElement.innerText = Math.random() > 0.5 ? '0' : '1'

      const x = event.clientX
      const y = event.clientY

      binaryElement.style.position = 'absolute'
      binaryElement.style.left = `${x}px`
      binaryElement.style.top = `${y}px`
      binaryContainer.appendChild(binaryElement)

      // Animación para hacer que los "0" y "1" caigan y desaparezcan
      gsap.to(binaryElement, {
        y: 100,
        opacity: 0,
        duration: 2,
        ease: 'power2.out',
        onComplete: () => {
          binaryContainer.removeChild(binaryElement)
        }
      })
    },
    createPlexusEffect() {
      const sketch = (p) => {
        const particles = []
        const numParticles = 100

        p.setup = () => {
          const canvas = p.createCanvas(window.innerWidth, window.innerHeight)
          canvas.parent('plexus-container')

          for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle(p))
          }
        }

        p.draw = () => {
          p.background(10, 20, 30)

          particles.forEach((particle) => {
            particle.update()
            particle.show()
          })

          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const distance = p.dist(
                particles[i].x,
                particles[i].y,
                particles[j].x,
                particles[j].y
              )
              if (distance < 120) {
                p.stroke(0, 255, 0)
                p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y)
              }
            }
          }
        }

        class Particle {
          constructor(p) {
            this.p = p
            this.x = p.random(p.width)
            this.y = p.random(p.height)
            this.r = p.random(2, 7)
            this.xSpeed = p.random(-1, 2)
            this.ySpeed = p.random(-1, 2)
          }

          update() {
            this.x += this.xSpeed
            this.y += this.ySpeed

            if (this.x > this.p.width || this.x < 0) this.xSpeed *= -1
            if (this.y > this.p.height || this.y < 0) this.ySpeed *= -1

            // Mover partículas hacia el mouse
            const mouseDist = this.p.dist(this.x, this.y, this.p.mouseX, this.p.mouseY)
            if (mouseDist < 100) {
              const angle = this.p.atan2(this.y - this.p.mouseY, this.x - this.p.mouseX)
              this.xSpeed += Math.cos(angle) * 0.5
              this.ySpeed += Math.sin(angle) * 0.5
            }
          }

          show() {
            this.p.noStroke()
            this.p.fill(255)
            this.p.circle(this.x, this.y, this.r)
          }
        }
      }

      new p5(sketch)
    }
  },
  beforeDestroy() {
    if (this.cursorTimeline) {
      this.cursorTimeline.kill()
    }
  }
}
</script>
