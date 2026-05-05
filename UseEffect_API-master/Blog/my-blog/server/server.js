    const express = require('express');
    const multer = require('multer');
    const cors = require('cors');
    const path = require('path');
    const fs = require('fs');

    const app = express();
    const port = 5000;

    app.use(cors());
    app.use(express.json());
    app.use('/uploads', express.static('uploads')); 

    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            const uniqueName = Date.now() + '-' + file.originalname;
            cb(null, uniqueName);
        }
    });
    const upload = multer({ storage });

    app.post('/upload', upload.single('image'), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'Không có file nào được tải lên.' });
        }

        const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
        res.json({ imageUrl: fileUrl });
    });

    app.delete('/delete-image', (req, res) => {
        const filename = req.query.filename;

        if (!filename) {
            return res.status(400).json({ error: 'Thiếu tên file ảnh' });
        }

        const filePath = path.join(__dirname, 'uploads', filename);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('❌ Lỗi khi xóa file:', err);
                return res.status(500).json({ error: 'Không thể xóa ảnh' });
            }
            return res.json({ message: '✅ Đã xóa ảnh thành công' });
        });
    });


    app.listen(port, () => {
        console.log(`Server đang chạy tại http://localhost:${port}`);
    });