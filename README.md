# kintone-polly-plugin
kintone文章読み上げプラグイン

## Description
kintoneのテキストフィールドに登録された文章を日本語音声に変換、再生します。

Amazon Web Services(AWS)の文章→音声変換サービス「Amazon Polly」を利用しています。

**AWSの契約、Amazon Pollyのサービス登録が必要です。**

## How to Use

### Install
kintoneのプラグイン追加画面より　release/kintone-polly-plugins.zip を追加する。

### Setting of kintone app
適用するkintoneアプリにて、下記フィールドを追加する。
* 音声読み上げ対象となる文章を入力するテキストフィールド（一行または複数行）
* 音声変換されたファイルを保存するファイルフィールド
* 音声コントローラーを表示するスペース

### Setting of plugin
プラグイン設定画面で各種項目を設定する。
* AWSアクセスキー/シークレットキー/リージョン
* 話者（女性/男性）
* 音声変換レーティング/速度/高さ
* 読み上げ対象のkintoneテキストフィールド
* 音声読み上げ対象のkintoneテキストフィールド
* 音声ファイルを保存するファイルフィールド
* 音声コントローラーを表示するスペース（の要素ID）

## Licence

MIT License

## Copyright

Copyright(c) LogicHeart
