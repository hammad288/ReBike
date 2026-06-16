const mongoose = require('mongoose');
require('dotenv').config();

const checkBikes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Bike = require('./models/Bike');
        const bike = await Bike.findOne({ status: 'approved' });
        if (bike) {
            console.log('Bike found:', {
                id: bike._id,
                brand: bike.brand,
                model: bike.model,
                status: bike.status,
                price: bike.price,
                imagesCount: bike.images ? bike.images.length : 0
            });
        } else {
            console.log('No approved bike found');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkBikes();
