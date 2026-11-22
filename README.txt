記帳 PWA — 使用說明

檔案內容
- index.html：App 介面
- style.css：科技深色風格
- app.js：記帳功能與本機資料保存
- manifest.json：PWA 安裝資訊
- service-worker.js：離線快取
- icon-192.png / icon-512.png：App 圖示

重要：PWA 必須透過 HTTPS 網址或 localhost 提供，直接點開 index.html 無法完整啟用安裝與離線功能。

部署方式（簡易）
1. 將整個資料夾內容上傳到支援 HTTPS 的靜態網站主機。
2. 用 iPhone 的 Safari 開啟網站網址。
3. 點「分享」→「加入主畫面」。
4. 將名稱保留為「記帳」，按「加入」。

資料保存
帳目使用瀏覽器 localStorage 儲存在目前裝置。清除 Safari 網站資料、使用私密瀏覽或更換裝置，可能導致資料消失。建議不要清除該網站資料；目前版本沒有雲端備份。

功能
- 新增收入與支出
- 顯示目前餘額
- 查看明細
- 編輯與刪除紀錄
