const express = require('express');

const app = express();
const portNum = 5000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('static'));

// 首頁
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/templates/homepage.html')
});

// 取得留言資料
app.get('/api/message', (req, res) => {
    
});

// 新增留言
app.post('/api/message', (req, res) => {
    
});

// 錯誤頁面處理
app.get('*', (req, res) => {
    res.status(404).send('錯誤頁面')
});

// 聆聽port
app.listen(portNum, () => {
console.log(`伺服器正在聆聽port ${portNum}`)
}); 