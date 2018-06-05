const http = require('http')
const { Nuxt, Builder } = require('nuxt')
let config = require('./nuxt.config.js')
config.rootDir = __dirname
const nuxt = new Nuxt(config)
const builder = new Builder(nuxt)
const server = http.createServer(nuxt.render)

if (config.dev) {
	builder.build().catch(e => {
		console.error(e)
		process.exit(1)
	})
}

server.listen()
const _NUXT_URL_ = `http://localhost:${server.address().port}`
console.log(`Nuxt on ${_NUXT_URL_}`)

const setupEvents = require('./squirrel')
if (setupEvents.handleSquirrelEvent()) {
   return
}

let win = null
const electron = require('electron')
const path = require('path')
const app = electron.app
const newWin = () => {
	win = new electron.BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    skipTaskbar: false,
    toolbar: false,
		icon: path.join(__dirname, 'static/icon.png')
  })
  win.on('ready-to-show', () => {
    win.show()
    win.webContents.openDevTools()
  })
  win.on('closed', () => win = null)
	if (config.dev) {
	  !function pollServer() {
			http.get(_NUXT_URL_, res => {
				if (res.statusCode === 200) {
          win.loadURL(_NUXT_URL_)
        } else {
          setTimeout(pollServer, 300)
        }
      })
      .on('error', pollServer)
		}()
	} else {
    return win.loadURL(_NUXT_URL_)
  }
}
app.on('ready', () => {
  if (config.dev) require('vue-devtools').install()
  newWin()
})
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())