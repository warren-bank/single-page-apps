const fs = require('fs')
const path = require('path')

const data = {}
const baseurl = 'https://warren-bank.github.io/mirror-Retro-Gaming-Console-ROMs/'

const data_keys = {
  "atari2600": "Atari 2600",
  "atari7800": "Atari 7800",
  "atarilynx": "Atari Lynx",
  "fds": "Nintendo Entertainment System",
  "gamegear": "Sega Game Gear",
  "gb": "Nintendo Game Boy",
  "gba": "Nintendo Game Boy Advance",
  "mastersystem": "Sega Master System",
  "n64": "Nintendo 64",
  "nes": "Nintendo Entertainment System",
  "ngp": "SNK NeoGeo Pocket",
  "ngpc": "SNK NeoGeo Pocket (Color)",
  "pcengine": "PC Engine",
  "sega32x": "Sega 32X",
  "snes": "Super Nintendo Entertainment System"
}

const basepath = path.join(__dirname, 'mirror-Retro-Gaming-Console-ROMs')
const subdirs_blacklist = ['.git', 'gbc', 'sg-1000']
const subdirs  = fs.readdirSync(basepath, {withFileTypes: true, recursive: false})
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .filter(name => !subdirs_blacklist.includes(name))

for (const subdir of subdirs) {
  const key = data_keys[subdir]
  data[key] = []
  const _dat = data[key]

  const dirpath = path.join(basepath, subdir)
  const roms = fs.readdirSync(dirpath, {withFileTypes: true, recursive: false})
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name)

  for (const rom of roms) {
    const relpath = `${subdir}/${rom}`
    const url     = baseurl + relpath
    const name    = rom.substring(0, rom.lastIndexOf('.'))

    _dat.push({relpath, url, name})
  }
}

fs.writeFileSync(
  path.resolve(__dirname, '../urls.json'),
  JSON.stringify(data, null, 2),
  {encoding: 'utf8'}
)
