class Speaker {
  constructor () {
    this.audio = new Audio()
    this.duration = 0
    this.currentTime = 0
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration
      this.currentTime = this.audio.currentTime
    }, true)
    this.audio.addEventListener('play', () => {
    }, true)
    this.audio.addEventListener('pause', () => {
    }, true)
    this.audio.addEventListener('ended', () => {
      this.status = 'stopped'
    }, true)
    this.audio.addEventListener('timeupdate', () => {
      this.duration = this.audio.duration
      this.currentTime = this.audio.currentTime
    }, true)

    this.source = null
    this.status = 'disable'
  }

  convertBlobToBase64 (blob) {
    return new Promise(resolve => {
      var reader = new window.FileReader()
      reader.readAsDataURL(blob)
      reader.onload = () => {
        const base64data = reader.result
        resolve(base64data.split(',', 2)[1])
      }
      reader.onerror = (err) => {
        throw new Error(err)
      }
    })
  }

  load (data) {
    return Promise.resolve().then(() => {
      this.source = 'data:audio/mp3;base64,' + data
      this.audio.src = this.source
      this.audio.load()
      this.status = 'stopped'
    })
  }

  play () {
    if (!['stopped', 'paused'].includes(this.status)) return
    this.audio.play()
    this.status = 'playing'
  }

  pause () {
    if (!['playing'].includes(this.status)) return
    this.audio.pause()
    this.status = 'paused'
  }

  stop () {
    if (!['playing'].includes(this.status)) return
    this.audio.pause()
    this.audio.currentTime = 0
    this.status = 'stopped'
  }
}

export default Speaker
