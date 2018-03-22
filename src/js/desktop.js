import kintoneUtility from 'kintone-utility/docs/kintoneUtility'
import Speaker from '@/models/Speaker.js'
import Polly from '@/models/Polly.js'

const pluginId = kintone.$PLUGIN_ID
const config = Object.assign({
  apiVersion: '2016-06-10',
  region: 'ap-northeast-1',
  VoiceId: 'Mizuki',
  SampleRate: '22050',
  pitch: 'medium',
  rate: 'medium'
}, kintone.plugin.app.getConfig(pluginId) || {})

const HTML_TEMPLATE = `
<div class="container controls">
  <div class="row buttons-row">
    <div class="col">
      <button ref="playButton" type="button" class="btn btn-secondary"
        accesskey="x"
        v-on:click="play"
        :disabled="!['stopped', 'paused'].includes(speaker.status)">
        <i class="fa fa-play" aria-hidden="true"></i>
        再生 (<u>x</u>)
      </button>
      <button ref="pauseButton" type="button" class="btn btn-secondary"
        accesskey="c"
        v-on:click="pause"
        :disabled="!['playing'].includes(speaker.status)">
        <i class="fa fa-pause" aria-hidden="true"></i>
        中断 (<u>c</u>)
      </button>
      <button ref="stopButton" type="button" class="btn btn-secondary"
        accesskey="v"
        v-on:click="stop"
        :disabled="!['playing'].includes(speaker.status)">
        <i class="fa fa-stop" aria-hidden="true"></i>
        停止 (<u>v</u>)
      </button>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <div class="progress">
        <div class="progress-bar" role="progressbar"
          v-bind:aria-valuenow="speaker.currentTime"
          v-bind:aria-valuemin="0"
          v-bind:aria-valuemax="speaker.duration"
          v-bind:style="{ width: (speaker.currentTime / speaker.duration * 100) + '%' }">
        </div>
      </div>
    </div>
  </div>
  <div>
  </div>
</div>
`

kintone.events.on('app.record.detail.show', (event) => {
  // console.log('plugin:polly event=%s', event.type)
  // console.log('config=%o', config)
  const record = event.record

  if (!config.controlsSpace) {
    console.error('config "controlsSpace" not set.')
    return event
  }
  const controlsSpace = kintone.app.record.getSpaceElement(config.controlsSpace)
  if (!controlsSpace) {
    console.error('Space "%s" not exists.', config.controlsSpace)
    return event
  }

  new Vue({
    el: '#' + controlsSpace.id,
    template: HTML_TEMPLATE,
    data: {
      record: record,
      speaker: new Speaker(),
    },
    created () {
    },
    mounted () {
      if (!config.fileField || config.fileField === '') {
        console.error('Config "fileField" not set.')
        return
      }
      const fileField = record[config.fileField]
      if (!fileField) {
        console.error('fileField "%s" not exist.', config.fileField)
        return
      }

      if (fileField.value.length > 0) {
        const fileKey = fileField.value[0].fileKey
        kintoneUtility.rest.downloadFile({
          fileKey: fileKey
        })
        .then(data => {
          return this.speaker.convertBlobToBase64(data)
        })
        .then(base64data => {
          return this.speaker.load(base64data)
        })
      }
    },
    methods: {
      play () {
        this.speaker.play()
      },
      pause () {
        this.speaker.pause()
      },
      stop () {
        this.speaker.stop()
      }
    }
  })
})

kintone.events.on([
  'app.record.create.show', 'app.record.edit.show'
], (event) => {
  // console.log('config=%o', config)
  const controlsSpace = kintone.app.record.getSpaceElement(config.controlsSpace)
  if (controlsSpace) {
    controlsSpace.parentNode.style.display = 'none'
  }

  return event
})

kintone.events.on([
  'app.record.create.submit.success', 'app.record.edit.submit.success'
], (event) => {
  const record = event.record

  if (!config.fileField) return event

  const text = record[config.textField] ? record[config.textField].value : null
  if (!text || text.trim() === '') {
    const params = {
      app: event.appId,
      id: event.recordId,
      record: {
        [config.fileField]: {
          value: []
        }
      }
    }
    return kintoneUtility.rest.putRecord(params)
    .then(resp => {
      return event
    })
  }

  const polly = new Polly({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    apiVersion: config.apiVersion,
    region: config.region
  }, {
    VoiceId: config.VoiceId,
    SampleRate: config.SampleRate,
    pitch: config.pitch,
    rate: config.rate
  })

  return polly.convertTextToSsml(text)
  .then(ssmlText => {
    return polly.generateAudioStream(ssmlText)
  })
  .then(data => {
    const fileName = `${event.appId}_${event.recordId}.mp3`
    return kintoneUtility.rest.uploadFile({
      fileName: fileName,
      blob: new Blob([data], { type: 'audio/mpeg' })
    })
  })
  .then(resp => {
    const params = {
      app: event.appId,
      id: event.recordId,
      record: {
        [config.fileField]: {
          value: [
            { fileKey: resp.fileKey }
          ]
        }
      }
    }
    return kintoneUtility.rest.putRecord(params)
  })
  .then(resp => {
    return event
  })
  .catch(err => {
    console.error(err)
    alert('音声変換に失敗しました。')
  })
})
