import viteConfig from './vite.config.js'

export default {
  ...viteConfig.build,
  watch: {
    include: 'src/**',
  },
}
