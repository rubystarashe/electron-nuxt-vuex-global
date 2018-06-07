const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')

  return Promise.resolve({
    appDirectory: path.join(rootPath, 'electron-nuxt-win32-x64/'),
    noMsi: true,
    outputDirectory: path.join(rootPath, 'windows-installer'),
    loadingGif: path.join(rootPath, 'assets/installing.gif'),
    exe: 'NuxtExample.exe',
    setupExe: 'example_installer.exe'
  })
}
