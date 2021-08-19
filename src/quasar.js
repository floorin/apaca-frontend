import Vue from 'vue'

import 'quasar/dist/quasar.css'
import lang from 'quasar/lang/ro.js'
import '@quasar/extras/material-icons/material-icons.css'
import { Quasar, Notify, Dialog } from 'quasar'

Vue.use(Quasar, {
  config: {
    brand: {
      primary: '#0061AC',
      secondary: '#338892',
      accent: '#00aeff',

      dark: '#58595b',

      positive: '#8cc63f',
      negative: '#fc0303',
      info: '#e3e5e6',
      warning: '#ff8800'
    }
  },
  components: { /* not needed if importStrategy is not 'manual' */ },
  directives: { /* not needed if importStrategy is not 'manual' */ },
  plugins: {
    Notify, Dialog
  },
  lang: lang
 })
