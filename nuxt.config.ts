import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@invictus.codes/nuxt-vuetify'],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
          mdi,
        },
      },
    },
    moduleOptions: {},
  },
});
