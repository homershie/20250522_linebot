import axios from 'axios'
import fs from 'fs'
import { distance } from '../utils/distance.js'
import template from '../templates/food.js'
import { url } from 'inspector'

export default async (event) => {
  try {
    // 取得餐廳資料
    const { data } = await axios.get(
      'https://data.moa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx?IsTransData=1&UnitId=193'
    )

    const bubbles = data
      // 加上距離欄位，紀錄每個物件離使用者的距離
      .map((value) => {
        value.distance = distance(
          value.Latitude,
          value.Longitude,
          event.message.latitude,
          event.message.longitude,
          'K'
        )
        return value
      })
      // 依照距離欄位的值排序
      .sort((a, b) => {
        return a.distance - b.distance
      })
      // 取出前 3 筆資料
      .slice(0, 3)
      // 套用 flex 模板
      .map((value) => {
        const address = value.City + value.Town + value.Address
        const bubble = template()
        const url = value.Url || `https://www.google.com/maps/place/${encodeURIComponent(address)}`
        bubble.hero.url = value.PicURL
        bubble.hero.action.uri = url
        bubble.body.contents[0].text = value.Name
        bubble.body.contents[1].contents[0].contents[1].text = value.Address
        bubble.body.contents[1].contents[1].contents[1].text = value.Tel
        bubble.footer.contents[0].action.uri = url
        bubble.footer.contents[1].action.uri = `https://www.google.com/maps/place/${encodeURIComponent(
          address
        )}`
        return bubble
      })

    const result = await event.reply({
      type: 'flex',
      altText: '農村地方美食小吃特色料理',
      contents: {
        type: 'carousel',
        contents: bubbles,
      },
    })
    console.log(result)

    if (result.message) {
      await event.reply('發生錯誤')
      // 如果是開發環境，而且傳送訊息錯誤時
      if (process.env.DEV === 'true') {
        fs.writeFileSync(
          './dump/food.json',
          JSON.stringify(
            {
              type: 'carousel',
              contents: bubbles,
            },
            null,
            2
          )
        )
      }
    }
  } catch (error) {
    console.error(error)
    await event.reply('發生錯誤：無法獲取餐廳資料。')
  }
}
