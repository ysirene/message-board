const path = require('path');
const express = require('express');

const multer = require('multer'); // 上傳圖片用
const { v4: uuidv4 } = require('uuid'); // 圖片檔名

const db = require(__dirname + '/model/db_connector')

const app = express();
const portNum = 5000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('static'));

// 設定檔案上傳位置、檔名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 將使用者上傳的圖片儲存在upload資料夾中
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const newFileName = uuidv4() + ext
        cb(null, newFileName); // 使用uuid作為檔名
    },
});

// 套用檔案上傳位置、檔案大小與類型的限制
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000,
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        // path.extname() 取得副檔名(如 .jpg)
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
            // 拒絕上傳的檔案
            cb('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。');
        };
        // 接受檔案
        cb(null, true);
    }
});

// 首頁
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/templates/homepage.html')
});

// 取得留言資料
app.get('/api/message', (req, res) => {
    db.query("SELECT comment, image_url FROM post ORDER BY id DESC").then(
        ([result, fileds]) => {
            console.log(fileds)
            res.json(result)
        }
    )
});

// 新增留言
app.post('/api/message', upload.single('image'), (req, res) => {
    if (!req.file || !req.body.comment) {
        return res.json({ error: true, message: 'Missing comment or image.' });
    };
    // const imageFile = req.file;
    let comment = req.body.comment;
    db.query('INSERT INTO POST(comment, image_url) VALUES(?, "test")', [comment])
    res.json({'ok': true});
});

// 錯誤頁面處理
app.get('*', (req, res) => {
    res.status(404).send('錯誤頁面')
});

// 聆聽port
app.listen(portNum, () => {
console.log(`伺服器正在聆聽port ${portNum}`)
}); 