module.exports = {
	head: {
    title: 'Electron Nuxt'
  },
	loading: false,
	build: {
		extend (config, { isDev, isClient }) {
			if (isClient) { config.target = 'electron-renderer' }
		}
	},
	dev: process.env.NODE_ENV === 'DEV'
}
