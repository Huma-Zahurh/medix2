const Banner = require('../Models/BannerModel');
const { bannerUpload } = require('../Middlewares/Multer'); 

const uploadBanner = async (req, res) => {
    bannerUpload.single('bannerImage')(req, res, async (err) => {
        if (err) {
            return res.status(400).send(err.message);
        }
        try {
            if (!req.file) {
                return res.status(400).send('No file uploaded.');
            }

            const imageUrl = `${req.protocol}://${req.get('host')}/uploads/banners/${req.file.filename}`;

            await Banner.deleteMany({}); // Delete existing banners
            const newBanner = new Banner({ imageUrl });
            await newBanner.save();

            res.status(200).json({ message: 'Banner uploaded successfully', imageUrl });
        } catch (error) {
            console.error('Upload Error:', error);
            res.status(500).send('Server error');
        }
    });
};

const getBanner = async (req, res) => {
    try {
        const banner = await Banner.findOne();
        res.status(200).json({ imageUrl: banner ? banner.imageUrl : null });
    } catch (error) {
        console.error('Get Banner Error:', error);
        res.status(500).send('Server error');
    }
};

module.exports = { uploadBanner, getBanner };