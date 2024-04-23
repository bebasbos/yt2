import express from 'express';
import ytdl from 'ytdl-core';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        var url = req.query.url;
        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }
        let info = await ytdl.getInfo(url);
        const format = {
            quality: 'highestaudio',
            filter: 'audioonly',
            format: 'mp3'
        };
        const audioInfo = ytdl.chooseFormat(info.formats, format);
        if (!audioInfo) {
            return res.status(500).json({ error: 'Could not find suitable audio format' });
        }
        const downloadURL = audioInfo.url;
        res.json({ success: true, downloadURL });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

export default router;
