import axios from 'axios'

export default async (event) => {
  try {
    // 取得匯率資料
    const { data } = await axios.get('https://tw.rter.info/capi.php')
    // 回覆資料
    const result = await event.reply(data.USDTWD.Exrate.toString())
    console.log(result)
    // 回覆成功
    // {
    //   sentMessages: ...
    // }
    // 回覆失敗
    // {
    //   message: ...
    // }
    if (result.message) {
      await event.reply('發生錯誤')
    }
  } catch (error) {
    console.error(error)
    event.reply('發生錯誤：無法獲取 USD 價格。')
  }
}
