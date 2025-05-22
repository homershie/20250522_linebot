export default async (event) => {
  await event.reply({
    type: 'text',
    text: '請選擇',
    quickReply: {
      items: [
        {
          type: 'action',
          action: {
            type: 'message',
            // 按下去後，使用者傳送出的文字
            text: 'usd',
            // 按鈕文字
            label: '查美元匯率',
          },
        },
        {
          type: 'action',
          action: {
            type: 'uri',
            uri: 'https://line.me/',
            label: 'LINE官網',
          },
        },
        {
          type: 'action',
          action: {
            type: 'postback',
            label: '加入好友',
            // 傳去 postback 事件的資料
            data: 'action=addFriend',
            displayText: '加入好友',
          },
        },
      ],
    },
  })
}
