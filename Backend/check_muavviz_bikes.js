const mongoose = require('mongoose');
require('dotenv').config();

const checkSellerBikes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const User = require('./models/User');
        const Bike = require('./models/Bike');
        
        const muavviz = await User.findOne({ name: /muavviz/i });
        if (!muavviz) {
            console.log('User muavviz not found');
            process.exit(0);
        }
        
        console.log(`User found: ${muavviz.name} (${muavviz._id}), Role: ${muavviz.role}`);
        
        const bikeCount = await Bike.countDocuments({ seller: muavviz._id });
        console.log(`Bikes owned by this user: ${bikeCount}`);
        
        const allBikes = await Bike.find({}).limit(5).populate('seller', 'name');
        console.log('Sample bikes and their sellers:');
        allBikes.forEach(b => {
            console.log(`- ${b.brand} ${b.model}: Seller ${b.seller ? b.seller.name : 'NONE'}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkSellerBikes();
