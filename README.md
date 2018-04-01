# kintone-polly-plugin
kintone文章読み上げプラグイン

## Description
kintoneのテキストフィールドに登録された文章を日本語音声に変換、再生します。

Amazon Web Services(AWS)のテキスト音声変換サービス「Amazon Polly」を利用しています。

**AWSの契約、[Amazon Polly][polly]のサービス登録が必要です。**

## How to Use

### AWS setting
任意のAWSリージョンで、[Amazon IAM][iam-doc]ユーザーを作成します。
-   IAMユーザーには AmazonPollyReadOnlyAccess または AmazonPollyFullAccess権限を付与します。
-   IAMユーザーのアクセスキー、シークレットキーをメモしておきます。

### Install
kintoneのプラグイン追加画面より　release/kintone-polly-plugins.zip を追加します。

### Setting of kintone app
適用するkintoneアプリにて、下記フィールドを設定しておきます。
-   音声読み上げ対象となる文章を入力するテキストフィールド（一行または複数行）
-   音声変換されたファイルを保存するファイルフィールド
-   音声コントローラーを表示するスペース

### Setting of plugin
プラグイン設定画面で各種項目を設定します。
-   AWS Pollyのアクセスキー/シークレットキー/リージョン
-   読み上げ対象のkintoneテキストフィールド
-   音声ファイルを保存するファイルフィールド
-   音声コントローラーを表示するスペース（の要素ID）

以下は任意で設定
-   話者（女性:Mizuki/男性:Takumi）
-   音声変換レーティング/速度/高さ

## Licence

MIT License

## Copyright

Copyright(c) LogicHeart

[polly]: https://aws.amazon.com/jp/polly/
[iam-doc]: https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_users_create.html
