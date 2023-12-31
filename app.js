const path = require('path');

const express = require('express');
const multer = require('multer'); // 暫存圖片

const db = require('./models/db_connector')
const s3FileUploader = require('./models/s3_file_uploader')
const fileNameGenerator = require('./views/file_name_generator')

const app = express();
const portNum = 5000;
let imageFileExt = '';

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('static'));

// 套用檔案上傳位置、檔案大小與類型的限制
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024, // 1MB
    },
    fileFilter: (req, file, cb) => {
        // path.extname() 取得副檔名(如 .jpg)
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
            // 拒絕上傳的檔案
            cb('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。');
        };
        // 接受檔案
        imageFileExt = ext;
        cb(null, true);
    }
});

// 首頁
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/templates/homepage.html')
});

// 取得留言資料
app.get('/api/message', async (req, res) => {
    const connection = await db.getConnection();
    connection.query('SELECT comment, image_name FROM post ORDER BY id DESC', (error, results, fields) => {
        connection.release();
        if(error){
            console.error(error);
            return res.json({'error': true, 'message': 'Database error'})
        }else{
            return res.json(results);
        };
    });
});

// 新增留言
app.post('/api/message', upload.single('image'), async (req, res) => {

    // 檢查request中是否包含使用者的留言與檔案
    if (!req.file || !req.body.comment) {
        return res.status(400).json({ 'error': true, message: 'Missing comment or image.' });
    };

    const imageFile = req.file.buffer;
    const comment = req.body.comment;
    const imageFileName = fileNameGenerator.generateFileName(imageFileExt)
    
    try{
        // 上傳照片至S3
        const uploadResult = await s3FileUploader.uploadFileToS3(imageFileName, imageFile);
        imageFile.buffer = null; // 將圖檔從緩存中釋放
    }
    catch(err){
        imageFile.buffer = null; // 將圖檔從緩存中釋放
        console.log('catch', err);
        return res.status(500).json({'error': true, 'message': 'Fail to upload file to S3.'});
    }
    
    // 留言與圖檔名稱存入資料庫
    try{
        const connection = await db.getConnection();
        connection.query('INSERT INTO post(comment, image_name) VALUES(?, ?)', [comment, imageFileName], (err, results, fields) => {
            connection.release();
            if(err){
                console.error(err);
                return res.status(500).json({'error': true, 'message': 'Database error'});
            }else{
                return res.status(200).json({'ok': true, 'imageName': imageFileName, 'comment': comment});
            };
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({'error': true, 'message': 'Database error'});
    };
});

// 錯誤頁面處理
app.get('*', (req, res) => {
    res.status(404).send('錯誤頁面')
});

// 聆聽port
app.listen(portNum, () => {
console.log(`伺服器正在聆聽port ${portNum}`)
}); 