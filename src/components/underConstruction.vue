<template>
  <div class="content">
    <div class="main-content">
      <h1 id="title">OptiFlow</h1>
      <div class="text-container">
        <p id="subtitle"></p>
        <span class="cursor">_</span>
      </div>
    </div>
    <img class="uc-logo" src="/src/assets/underConstr.png" alt="under-construction" />

    <Footer />
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import Footer from './Footer.vue'

export default {
  name: 'UnderConstruction',
  components: {
    Footer
  },
  mounted() {
    gsap.registerPlugin(TextPlugin)

    this.startCursorAnimation()

    gsap.to('#title', {
      duration: 0.5,
      opacity: 1,
      y: 0,
      ease: 'power2.out'
    })

    gsap.to('#subtitle', {
      duration: 3,
      delay: 1,
      text: {
        value:
          '🚧 Under Construction... Volveremos Pronto! - <a style="color: white; !important!;" target="_blank" href="#">OptiFlow Team.</a>'
      },
      ease: 'power1.inOut'
    })
  },
  methods: {
    startCursorAnimation() {
      gsap.set('.cursor', { opacity: 1 })
      this.cursorTimeline = gsap.timeline({ repeat: -1 })
      this.cursorTimeline.to('.cursor', { opacity: 0, duration: 0.5, ease: 'power2.inOut' })
      this.cursorTimeline.to('.cursor', { opacity: 1, duration: 0.5, ease: 'power2.inOut' })
    }
  },
  beforeDestroy() {
    if (this.cursorTimeline) {
      this.cursorTimeline.kill()
    }
  }
}
</script>
