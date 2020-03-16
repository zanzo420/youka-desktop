const packageJson = require("./package.json")
const { version } = packageJson

const config = {
  packagerConfig: {
    executableName: "youka",
    icon: "assets/logo.icns",
    ignore: (file) => {
      if (!file) return false;
      return !/^[/\\]\.webpack($|[/\\]).*$/.test(file)
    },
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      platforms: ["win32"],
      config: arch => {
        return {
          name: "youka",
          exe: "youka.exe",
          setupExe: `youka-win32-${arch}-${version}-setup.exe`,
          setupIcon: "assets/logo.ico",
        }
      }
    },
    {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {
        name: `youka-${version}`,
        icon: "assets/logo.icns"
      },
    },
    {
      name: "@electron-forge/maker-deb",
      platforms: ["linux"],
      config: {
        name: "youka",
        icon: "assets/logo.svg"
      }
    },
    {
      name: "@electron-forge/maker-rpm",
      platforms: ["linux"],
      config: {
        name: "youka",
        icon: "assets/logo.svg"
      }
    }
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "youkaclub",
          name: "youka-desktop"
        },
        draft: true
      }
    }
  ],
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        mainConfig: "./webpack/webpack.main.config.js",
        renderer: {
          config: "./webpack/webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/index.html",
              js: "./src/index.jsx",
              name: "main_window"
            }
          ]
        }
      }
    ]
  ]
}

module.exports = config
