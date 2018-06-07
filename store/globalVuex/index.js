import { ipcRenderer } from 'electron'

export default store => {
  const globalVuexState = ipcRenderer.sendSync('vuex-connect')
  if (!Object.getOwnPropertyNames(globalVuexState).length) {
    delete store.state.globalVuex
    ipcRenderer.send('vuex-init', store.state)
  }
  else store.replaceState(globalVuexState)
  store.subscribe((mutation, state) => {
    ipcRenderer.send('vuex-changed', state)
  })
  ipcRenderer.on('vuex-changed', (event, mes) => {
    store.replaceState(mes)
  })
}
