# 今日のおかずbot
今日のおかずを提供するDiscord Botです。

1つのチャンネルでのみ使用できます。
~~Hな画像をどこにでも提供することは公序良俗に反する~~

# 使い方
[Discord Developer Portal](https://discord.com/developers/applications)においてBotを作成したのち、このディレクトリに`config.json`を作成し、以下の情報を入力します。
```json
{
    "token": "APPのBotのトークン",
    "clientId": "APPのApplication ID",
    "guildId": "導入するサーバーのサーバーID",
    "channelId": "導入するチャンネルのチャンネルID"
}
```

`node index.js`で起動、Ctrl+Cで終了できます。

`okazu.db`に画像が保存されるので、これをSQLiteで操作することでデータを編集することができます。