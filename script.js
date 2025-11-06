// ===== VARIÁVEIS GLOBAIS =====
const nav = document.getElementById("header")
const navMenu = document.getElementById("nav-menu")
const navToggle = document.getElementById("nav-toggle")
const navLinks = document.querySelectorAll(".nav__link")
const sections = document.querySelectorAll(".section")
const contactForm = document.getElementById("contact-form")

// ===== MENU MOBILE =====
function toggleMobileMenu() {
  navMenu.classList.toggle("show")
  navToggle.classList.toggle("active")
}

// Event listener para o botão do menu mobile
if (navToggle) {
  navToggle.addEventListener("click", toggleMobileMenu)
}

// Fechar menu ao clicar em um link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show")
    navToggle.classList.remove("active")
  })
})

// ===== SCROLL SUAVE E NAVEGAÇÃO ATIVA =====
function updateActiveNavLink() {
  let current = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight

    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
}

// ===== HEADER SCROLL EFFECT =====
function handleHeaderScroll() {
  if (window.scrollY >= 100) {
    nav.style.background = "rgba(10, 10, 10, 0.98)"
    nav.style.boxShadow = "0 4px 20px rgba(0, 212, 255, 0.1)"
  } else {
    nav.style.background = "rgba(10, 10, 10, 0.95)"
    nav.style.boxShadow = "none"
  }
}

// ===== ANIMAÇÃO DAS BARRAS DE HABILIDADES =====
function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skills__percentage")

  skillBars.forEach((bar) => {
    const width = bar.getAttribute("data-width")
    bar.style.width = width + "%"
  })
}

// ===== OBSERVER PARA ANIMAÇÕES NO SCROLL =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Animar elementos com classe animate-on-scroll
      if (entry.target.classList.contains("animate-on-scroll")) {
        entry.target.classList.add("visible")
      }

      // Animar barras de habilidades quando a seção skills aparecer
      if (entry.target.id === "skills") {
        setTimeout(animateSkillBars, 300)
      }

      // Animar cards de projetos
      if (entry.target.classList.contains("project__card")) {
        entry.target.style.animationDelay = Math.random() * 0.5 + "s"
        entry.target.classList.add("slide-in-up")
      }
    }
  })
}, observerOptions)

// ===== SISTEMA DE PARTÍCULAS =====
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.particles = []
    this.particleCount = 100

    this.resize()
    this.init()
    this.animate()

    window.addEventListener("resize", () => this.resize())
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  init() {
    this.particles = []
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.particles.forEach((particle, index) => {
      // Atualizar posição
      particle.x += particle.vx
      particle.y += particle.vy

      // Verificar bordas
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1
      }

      // Desenhar partícula
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`
      this.ctx.fill()

      // Conectar partículas próximas
      for (let j = index + 1; j < this.particles.length; j++) {
        const dx = this.particles[j].x - particle.x
        const dy = this.particles[j].y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          this.ctx.beginPath()
          this.ctx.moveTo(particle.x, particle.y)
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y)
          this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 100)})`
          this.ctx.lineWidth = 1
          this.ctx.stroke()
        }
      }
    })

    requestAnimationFrame(() => this.animate())
  }
}

// ===== VALIDAÇÃO DO FORMULÁRIO =====
function validateForm(formData) {
  const errors = []

  const name = formData.get("name").trim()
  const email = formData.get("email").trim()
  const message = formData.get("message").trim()

  if (name.length < 2) {
    errors.push("Nome deve ter pelo menos 2 caracteres")
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    errors.push("Email inválido")
  }

  if (message.length < 10) {
    errors.push("Mensagem deve ter pelo menos 10 caracteres")
  }

  return errors
}

function showFormMessage(message, isError = false) {
  // Remove mensagem anterior se existir
  const existingMessage = document.querySelector(".form-message")
  if (existingMessage) {
    existingMessage.remove()
  }

  const messageDiv = document.createElement("div")
  messageDiv.className = `form-message ${isError ? "error" : "success"}`
  messageDiv.textContent = message

  // Adicionar estilos
  messageDiv.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 0.5rem;
        font-weight: 500;
        text-align: center;
        ${
          isError
            ? "background: rgba(255, 0, 128, 0.1); color: #ff0080; border: 1px solid rgba(255, 0, 128, 0.3);"
            : "background: rgba(0, 255, 136, 0.1); color: #00ff88; border: 1px solid rgba(0, 255, 136, 0.3);"
        }
    `

  contactForm.appendChild(messageDiv)

  // Remover mensagem após 5 segundos
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove()
    }
  }, 5000)
}

// ===== MANIPULADOR DO FORMULÁRIO =====
function handleFormSubmit(e) {
  e.preventDefault()

  const formData = new FormData(contactForm)
  const errors = validateForm(formData)

  if (errors.length > 0) {
    showFormMessage(errors.join(", "), true)
    return
  }

  // Simular envio do formulário
  const submitButton = contactForm.querySelector('button[type="submit"]')
  const originalText = submitButton.innerHTML

  submitButton.innerHTML = "Enviando... ⏳"
  submitButton.disabled = true

  setTimeout(() => {
    showFormMessage("Mensagem enviada com sucesso! Entrarei em contato em breve.")
    contactForm.reset()

    submitButton.innerHTML = originalText
    submitButton.disabled = false
  }, 2000)
}

// ===== EVENT LISTENERS =====
window.addEventListener("scroll", () => {
  updateActiveNavLink()
  handleHeaderScroll()
})

if (contactForm) {
  contactForm.addEventListener("submit", handleFormSubmit)
}

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar sistema de partículas
  const particlesCanvas = document.getElementById("particles-canvas")
  if (particlesCanvas) {
    new ParticleSystem(particlesCanvas)
  }

  // Adicionar classe de animação aos elementos
  const elementsToAnimate = document.querySelectorAll(".about__content, .skills__container, .contact__content")
  elementsToAnimate.forEach((el) => {
    el.classList.add("animate-on-scroll")
  })

  // Observar elementos para animação
  document.querySelectorAll(".animate-on-scroll, .project__card, #skills").forEach((el) => {
    observer.observe(el)
  })

  // Inicializar navegação ativa
  updateActiveNavLink()

  console.log("🚀 Portfolio AnderDev carregado com sucesso!")
})

// ===== SMOOTH SCROLL PARA NAVEGAÇÃO =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))

    if (target) {
      const headerHeight = nav.offsetHeight
      const targetPosition = target.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

// ===== EASTER EGG - KONAMI CODE =====
const konamiCode = []
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
]

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.code)

  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift()
  }

  if (konamiCode.join(",") === konamiSequence.join(",")) {
    // Easter egg ativado!
    document.body.style.animation = "rainbow 2s infinite"
    setTimeout(() => {
      document.body.style.animation = ""
    }, 10000)

    console.log("🎉 Easter egg ativado! AnderDev mode ON!")
  }
})

// Adicionar animação rainbow para o easter egg
const style = document.createElement("style")
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`
document.head.appendChild(style)
