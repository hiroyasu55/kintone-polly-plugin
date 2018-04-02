import kintoneUtility from 'kintone-utility/docs/kintoneUtility'
import Polly from '@/models/Polly'

const pluginId = kintone.$PLUGIN_ID
const pluginConfig = kintone.plugin.app.getConfig(pluginId) || {}
const config = {
  accessKeyId: pluginConfig.accessKeyId || '',
  secretAccessKey: pluginConfig.secretAccessKey || '',
  apiVersion: pluginConfig.apiVersion || '2016-06-10',
  region: pluginConfig.region || 'ap-northeast-1',

  VoiceId: pluginConfig.VoiceId || 'Mizuki',
  SampleRate: pluginConfig.SampleRate || '22050',
  LexiconName: pluginConfig.LexiconName || '',

  pitch: pluginConfig.pitch || 'medium',
  rate: pluginConfig.rate || 'medium',

  textField: pluginConfig.textField || '',
  fileField: pluginConfig.fileField || '',
  controlsSpace: pluginConfig.controlsSpace || ''
}

new Vue({
  el: '#app',
  data: {
    config: config,
    textFields: [],
    fileFields: [],
    regions: Polly.regions,
    voices: Polly.voices,
    sampleRates: Polly.sampleRates,
    rates: Polly.ssmlRates,
    pitches: Polly.ssmlPitches
  },
  created () {
    kintoneUtility.rest.getFormFields({
      app: kintone.app.getId(),
      lang: 'default'
    })
    .then(response => {
      Object.keys(response.properties).forEach(key => {
        const property = response.properties[key]
        if (property.type === 'SINGLE_LINE_TEXT' || property.type === 'MULTI_LINE_TEXT') {
          this.textFields.push(property)
        } else if (property.type === 'FILE') {
          this.fileFields.push(property)
        }
      })
    })
    .catch(err => {
      console.error(err)
    })
  },
  methods: {
    onsubmit () {
      kintone.plugin.app.setConfig(this.config)
    },
    cancel () {
      history.back()
    }
  }
})
