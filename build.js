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
    appDirectory: path.join(rootPath, 'electron-nuxt-example-win32-x64/'),
    noMsi: true,
    outputDirectory: path.join(rootPath, 'windows-installer'),
    loadingGif: path.join(rootPath, 'assets/installing_png.gif'),
    exe: 'NuxtExample.exe',
    setupExe: 'example_installer.exe',
    setupIcon: path.join(rootPath, 'assets', 'icons', 'icon.ico')
  })
}
