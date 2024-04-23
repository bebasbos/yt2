import express from 'express';
import ytsr from '@distube/ytsr';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const query = req.query.q;
        const limit = req.query.limit || 20;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }

        const searchResults = await ytsr(query, { safeSearch: true, limit });
        
        if (!searchResults || !searchResults.items || searchResults.items.length === 0) {
            return res.status(404).json({ error: 'No videos found' });
        }

        const videos = searchResults.items.map(video => ({
            id: video.id,
            name: video.name,
            url: video.url,
            views: video.views,
            duration: video.duration,
            thumbnail: video.thumbnail,
            isLive: video.isLive,
        }));

        res.json({ videos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

export default router;
