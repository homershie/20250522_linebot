import 'dotenv/config'
import linebot from 'linebot'
import commandUsd from './commands/usd.js'
import commandFood from './commands/food.js'
import commandQr from './commands/qr.js'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
})

bot.on('message', (event) => {
  if (event.message.type === 'text') {
    if (event.message.text === 'usd') {
      commandUsd(event)
    } else if (event.message.text === 'qr') {
      commandQr(event)
    }
  } else if (event.message.type === 'location') {
    commandFood(event)
  }
})
// posetback
bot.on('postback', (event) => {
  console.log(event)
  if (event.postback.data === 'action=addFriend') {
    event.reply('感謝您加入好友！')
  } else {
    event.reply('無法辨識的 postback 事件。')
  }
})
bot.listen('/', process.env.PORT || 3000, () => {
  console.log('LINE Bot is running.')
})
