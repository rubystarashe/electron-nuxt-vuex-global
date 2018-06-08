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

const electron = require('electron')
const path = require('path')
const app = electron.app
const newWin = () => {
	let win = new electron.BrowserWindow({
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

const newWin2 = () => {
	let win = new electron.BrowserWindow({
    width: 1200,
    height: 500,
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
			http.get(_NUXT_URL_ + '/second', res => {
				if (res.statusCode === 200) {
          win.loadURL(_NUXT_URL_ + '/second')
        } else {
          setTimeout(pollServer, 300)
        }
      })
      .on('error', pollServer)
		}()
	} else {
    return win.loadURL(_NUXT_URL_ + '/second')
  }
}
app.on('ready', () => {
  if (config.dev) require('vue-devtools').install()
  newWin()
  newWin2()
})
app.on('window-all-closed', () => app.quit())


const Vue = require('vue')
const Vuex = require('vuex')
Vue.use(Vuex)

const clients = []
const store = new Vuex.Store()

electron.ipcMain.on('vuex-connect', (event) => {
  let winId = electron.BrowserWindow.fromWebContents(event.sender).id
  console.log('vuex-connected', winId)
  clients[winId] = event.sender
  event.returnValue = store.state
})

electron.ipcMain.on('vuex-init', (event, mes) => {
  if (!Object.getOwnPropertyNames(store.state).length) {
    console.log('vuex-inited', mes)
    store.replaceState(mes)
  } else electron.ipcMain.removeListener('vuex-init', () => {})
})

electron.ipcMain.on('vuex-changed', (event, mes) => {
  console.log('vuex-changed ', mes)
  clients.forEach(e => {
    if(e !== event.sender) electron.BrowserWindow.fromWebContents(e).webContents.send('vuex-changed', mes)
  })
  store.replaceState(mes)
})