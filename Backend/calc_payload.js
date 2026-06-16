const mongoose = require('mongoose');
require('dotenv').config();

const calculatePayload = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Bike = require('./models/Bike');
        const bikes = await Bike.find({ status: 'approved' });
        
        let totalSize = 0;
        bikes.forEach(bike => {
            // Simulate payload: stringified JSON of 1 image + basic info
            const sample = {
                brand: bike.brand,
                model: bike.model,
                price: bike.price,
                images: bike.images && bike.images[0] ? [bike.images[0]] : []
            };
            totalSize += JSON.stringify(sample).length;
        });
        
        console.log(`Total bikes: ${bikes.length}`);
        console.log(`Estimated Payload Size (with 1 image each): ${Math.round(totalSize / 1024 / 1024 * 100) / 100} MB`);
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

calculatePayload();
