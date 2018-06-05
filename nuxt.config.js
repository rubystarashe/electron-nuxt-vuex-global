module.exports = {
	head: {
    title: 'Electron Nuxt'
  },
	loading: false,
	dev: process.env.NODE_ENV === 'DEV',
	build: {
		extend (config, { isDev, isClient }) {
			if (isClient) {
				config.target = 'electron-renderer'
			}
		}
	},
	plugins: [
		'~plugins/vue-electron.js'
	]
}
