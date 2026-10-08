export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  modules: ['@pinia/nuxt'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },

      titleTemplate: '%s — Орбита CRM',

      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Клиенты, сделки и задачи в одной системе'
        },

        { name: 'robots', content: 'noindex' }
      ],

      link: [

        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400..600&display=swap'
        },

        {
          rel: 'icon',
          type: 'image/svg+xml',
          href:
            'data:image/svg+xml,' +
            encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#4c5fd7"/><circle cx="16" cy="16" r="4" fill="#fff"/><ellipse cx="16" cy="16" rx="11" ry="5.5" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.6" transform="rotate(-24 16 16)"/></svg>`
            )
        }
      ],

      script: [
        {
          innerHTML: `try{var t=localStorage.getItem('crm-theme');if(t&&t!=='auto')document.documentElement.setAttribute('data-theme',t)}catch(e){}`,
          tagPosition: 'head'
        }
      ]
    },

    pageTransition: { name: 'page', mode: 'out-in' }
  },

  runtimeConfig: {
    public: {
      appName: 'Орбита CRM'
    }
  }
})
