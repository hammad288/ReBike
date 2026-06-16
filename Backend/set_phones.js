// Run this ONCE to set admin and seller phone numbers in DB
// Usage: node set_phones.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  // Set admin phone
  const adminResult = await User.updateMany(
    { role: 'admin' },
    { $set: { phone: '6355117661' } }
  );
  console.log(`✅ Admin phone set: ${adminResult.modifiedCount} admin(s) updated → 6355117661`);

  // Set seller "muavviz" phone by name
  const sellerResult = await User.updateOne(
    { name: { $regex: /muavviz/i }, role: 'seller' },
    { $set: { phone: '9723768192' } }
  );
  console.log(`✅ Seller muavviz phone set: ${sellerResult.modifiedCount} seller(s) updated → 9723768192`);

  await mongoose.disconnect();
  console.log('Done!');
};

run().catch(console.error);
