const mongoose = require('mongoose');
require('dotenv').config();

const checkBikes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const Bike = require('./models/Bike');
        const count = await Bike.countDocuments({ status: 'approved' });
        console.log(`Approved bikes count: ${count}`);
        
        const bikes = await Bike.find({ status: 'approved' }).limit(5);
        console.log('Sample approved bikes:', JSON.stringify(bikes, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkBikes();
