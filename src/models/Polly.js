class Polly {
  constructor (params, options) {
    this.options = Object.assign({
      OutputFormat: 'mp3',
      LexiconNames: [],
      TextType: 'ssml',
      pitch: 'medium',
      rate: 'medium'
    }, options || {})

    this.polly = new AWS.Polly(Object.assign({
      apiVersion: '2016-06-10',
      region: 'ap-northeast-1'
    }, params || {}))
  }

  static get regions () {
    return [
      { code: 'us-east-1', name: '米国東部（バージニア北部）' },
      { code: 'us-east-2', name: '米国東部 (オハイオ)' },
      { code: 'us-west-1', name: '米国西部 (北カリフォルニア)' },
      { code: 'us-west-2', name: '米国西部 (オレゴン)' },
      { code: 'ca-central-1', name: 'カナダ (中部)' },
      { code: 'eu-central-1', name: '欧州 (フランクフルト)' },
      { code: 'eu-west-1', name: '欧州 (アイルランド)' },
      { code: 'eu-west-2', name: '欧州 (ロンドン)' },
      { code: 'eu-west-3', name: '欧州 (パリ)' },
      { code: 'ap-northeast-1', name: 'アジアパシフィック (東京)' },
      { code: 'ap-northeast-2', name: 'アジアパシフィック (ソウル)' },
      { code: 'ap-southeast-1', name: 'アジアパシフィック (シンガポール)' },
      { code: 'ap-southeast-2', name: 'アジアパシフィック (シドニー)' },
      { code: 'ap-south-1', name: 'アジアパシフィック (ムンバイ)' },
      { code: 'sa-east-1', name: '南米 (サンパウロ)' }
    ]
  }

  static get voices () {
    return [
      { code: 'Mizuki', name: 'Mizuki（女性）'},
      { code: 'Takumi', name: 'Takumi（男性）'}
    ]
  }

  static get sampleRates () {
    return [
      { code: '8000', name: '8000Hz' },
      { code: '16000', name: '16000Hz' },
      { code: '22050', name: '22050Hz' }
    ]
  }

  static get ssmlRates () {
    return [
      { code: 'x-low', name: '遅い' },
      { code: 'slow', name: 'やや遅い' },
      { code: 'medium', name: '普通' },
      { code: 'fast', name: 'やや速い' },
      { code: 'x-fast', name: '速い' }
    ]
  }

  static get ssmlPitches () {
    return [
      { code: 'x-low', name: '低い' },
      { code: 'low', name: 'やや低い' },
      { code: 'medium', name: '普通' },
      { code: 'high', name: 'やや高い' },
      { code: 'x-high', name: '高い' }
    ]
  }

  /*
  putLexicon (file) {
    const filepath = path.join(__dirname, file)
    const pms = {
      Content: `file://${filepath}`,
      Name: 'W3C'
    }
    return this.polly.putLexicon(pms).promise()
      .then(result => {
        return result
      })
  }
  */

  getLexicon (name) {
    return this.polly.getLexicon({'Name': name}).promise()
  }

  convertTextToSsml (text, options) {
    options = Object.assign(this.options, options || {})

    return Promise.resolve().then(() => {
      /*
      const breakTime = '400ms'
      speekText = text
        .replace(/、\n/g, `<break time="${breakTime}" />`)
        .replace(/。\n/g, `<break time="${breakTime}" />`)
        .replace(/、/g, `<break time="200ms" />`)
        .replace(/。/g, `<break time="${breakTime}" />`)
        .replace(/\n/g, `<break time="${breakTime}" />`)
      */
      const ssml = `
<speak xml:lang="ja-JP">
<prosody pitch="${options.pitch}" rate="${options.rate}">
${text}
</prosody>
</speak>
`
      return ssml
    })
  }

  generateAudioStream (text, options) {
    options = Object.assign(this.options, options || {})
    const params = {
      OutputFormat: options.OutputFormat,
      VoiceId: options.VoiceId,
      SampleRate: options.SampleRate,
      TextType: options.TextType,
      LexiconNames: options.LexiconNames,
      Text: text
    }
    // console.log('params=%o', params)

    return this.polly.synthesizeSpeech(params).promise()
    .then(data => {
      return data.AudioStream
    })
  }
}

export default Polly
