const mongoose = require('mongoose');
require('dotenv').config();

const checkBikes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Bike = require('./models/Bike');
        const bikes = await Bike.find({ status: 'approved' }).limit(10);
        console.log(`Fetched ${bikes.length} sample bikes`);
        
        bikes.forEach((bike, i) => {
            const imgCount = bike.images ? bike.images.length : 0;
            const firstImgSize = bike.images && bike.images[0] ? bike.images[0].length : 0;
            console.log(`Bike ${i+1}: ${bike.brand} ${bike.model} - Images: ${imgCount}, First Image Size: ${Math.round(firstImgSize/1024)} KB`);
        });
        
        const totalCount = await Bike.countDocuments({ status: 'approved' });
        console.log(`Total Approved Bikes: ${totalCount}`);
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkBikes();
