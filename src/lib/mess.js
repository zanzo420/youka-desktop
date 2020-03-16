const debug = require("debug")("youka:mess")
const ffmpeg = require("fluent-ffmpeg")
const ffbinaries = require("ffbinaries")
const streamToBlob = require("stream-to-blob")
const youtube = require("@youka/youtube")
const lyricsFinder = require("@youka/lyrics")
const fs = require("fs")
const join = require("path").join
const homedir = require("os").homedir()
const mkdirp = require("mkdirp")

const FILE_VIDEO = ".mp4"
const FILE_AUDIO = ".m4a"
const FILE_CAPTIONS = ".vtt"
const FILE_TEXT = ".txt"
const FILE_JSON = ".json"

const MODE_MEDIA_ORIGINAL = "original"
const MODE_MEDIA_INSTRUMENTS = "instruments"
const MODE_MEDIA_VOCALS = "vocals"

const MODE_CAPTIONS_LINE = "line"
const MODE_CAPTIONS_WORD = "word"
const MODE_CAPTIONS_ALL = "all"
const MODE_CAPTIONS_OFF = "off"

const MODE_LYRICS = "lyrics"
const MODE_INFO = "info"

const CAPTIONS_MODES = [
  MODE_CAPTIONS_LINE,
  MODE_CAPTIONS_WORD,
  MODE_CAPTIONS_ALL,
  MODE_CAPTIONS_OFF,
]

const MEDIA_MODES = [
  MODE_MEDIA_ORIGINAL,
  MODE_MEDIA_INSTRUMENTS,
  MODE_MEDIA_VOCALS,
]

const ROOT = join(homedir, ".youka", "youtube")
const BINARIES_PATH = join(homedir, ".youka", "binaries")
const FFMPEG_PATH = join(BINARIES_PATH, "ffmpeg")

function info(youtubeID) {
  const fpath = join(ROOT, youtubeID, "info.json")
  if (!fs.existsSync(fpath)) {
    return
  }
  return JSON.parse(fs.readFileSync(fpath, "utf-8"))
}

function fileurl(youtubeID, mode, file) {
  const fpath = filepath(youtubeID, mode, file)
  if (fs.existsSync(fpath)) {
    return `file://${fpath}`
  }
}

function filepath(youtubeID, mode, file) {
  return join(ROOT, youtubeID, `${mode}${file}`)
}

async function generate(youtubeID) {
  debug("youtube-id", youtubeID)

  if (fs.existsSync(filepath(youtubeID, MODE_MEDIA_INSTRUMENTS, FILE_VIDEO))) {
    return
  }

  if (!ffmpegExists()) {
    await downloadFfpmeg()
  }

  process.env.FFMPEG_PATH = FFMPEG_PATH
  ffmpeg.setFfmpegPath(FFMPEG_PATH)

  await mkdirp(join(ROOT, youtubeID))

  debug("download video")
  const videoOriginal = await youtube.download(youtubeID)
  fs.writeFileSync(filepath(youtubeID, MODE_MEDIA_ORIGINAL, FILE_VIDEO), videoOriginal)

  debug("find lyrics")
  const info = await youtube.info(youtubeID)
  fs.writeFileSync(filepath(youtubeID, MODE_INFO, FILE_JSON), JSON.stringify(info, null, 2) , "utf-8")
  const title = youtube.utils.cleanTitle(info.title)
  const lyrics = await lyricsFinder(title)

  debug("seperate audio")
  await new Promise((resolve, reject) => {
    ffmpeg(filepath(youtubeID, MODE_MEDIA_ORIGINAL, FILE_VIDEO))
      .on("error", error => reject(error))
      .on("end", () => resolve())
      .addOptions(["-map 0:a", "-c copy"])
      .save(filepath(youtubeID, MODE_MEDIA_ORIGINAL, FILE_AUDIO))
  })

  debug("split and align")
  const url = "https://api.audioai.online/split-align"
  const fd = new window.FormData()
  const audioBlob = await streamToBlob(fs.createReadStream(filepath(youtubeID, MODE_MEDIA_ORIGINAL, FILE_AUDIO)))
  fd.append("audio", audioBlob)
  if (lyrics) {
    fs.writeFileSync(filepath(youtubeID, MODE_LYRICS, FILE_TEXT), lyrics, "utf-8")
    const transcriptBlob = await streamToBlob(fs.createReadStream(filepath(youtubeID, MODE_LYRICS, FILE_TEXT)))
    fd.append("transcript", transcriptBlob)
  }
  const response = await window.fetch(url, { method: "post", body: fd })
  const { audio, captions, message } = await response.json()
  if (response.status !== 200) {
    throw new Error(message)
  }
  if (audio) {
    for (const [mode, value] of Object.entries(audio)) {
      const fpath = filepath(youtubeID, mode, FILE_AUDIO)
      fs.writeFileSync(fpath, value, "base64")
    }
  }
  if (captions) {
    for (const [mode, value] of Object.entries(captions)) {
      const fpath = filepath(youtubeID, mode, FILE_CAPTIONS)
      fs.writeFileSync(fpath, value, "base64")
    }
  }

  debug("create videos")
  const medias = [MODE_MEDIA_INSTRUMENTS, MODE_MEDIA_VOCALS]
  for (let i = 0; i < medias.length; i++) {
    const media = medias[i];
    await new Promise((resolve, reject) => {
      ffmpeg()
        .on("error", error => reject(error))
        .on("end", () => resolve())
        .input(filepath(youtubeID, MODE_MEDIA_ORIGINAL, FILE_VIDEO))
        .input(filepath(youtubeID, media, FILE_AUDIO))
        .addOptions(["-vcodec copy", "-acodec copy", "-map 0:0", "-map 1:0"])
        .save(filepath(youtubeID, media, FILE_VIDEO))
    })
  }
}

function ffmpegExists() {
  return fs.existsSync(FFMPEG_PATH)
}

async function downloadFfpmeg() {
  await mkdirp(BINARIES_PATH)
  await new Promise((resolve, reject) => {
    ffbinaries.downloadBinaries("ffmpeg", { destination: BINARIES_PATH }, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

export {
  info,
  fileurl,
  filepath,
  generate,
  ffmpegExists,
  downloadFfpmeg,
  MEDIA_MODES,
  CAPTIONS_MODES,
  FILE_VIDEO,
  FILE_CAPTIONS,
  MODE_MEDIA_INSTRUMENTS,
  MODE_CAPTIONS_WORD,
  MODE_CAPTIONS_LINE,
  MODE_CAPTIONS_OFF,
}