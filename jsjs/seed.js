const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Equipment = require('./models/Equipment');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany();
  await Equipment.deleteMany();

  await User.create([
    { name: 'Pratik Shrestha', email: 'pratik@assetflow.com', password: 'pratik123', role: 'admin', port: '8081' },
    { name: 'Sahaj Sharma', email: 'sahaj@assetflow.com', password: 'sahaj123', role: 'admin', port: '8082' },
    { name: 'Subash Tiwari', email: 'subash@assetflow.com', password: 'subash123', role: 'technician', port: '9090' },
    { name: 'Mausham Yadav', email: 'mausham@assetflow.com', password: 'mausham123', role: 'technician', port: '9091' },
    { name: 'Alex Tamang', email: 'alex@demo.com', password: 'user123', role: 'user', port: '3001' },
    { name: 'Binita Rai', email: 'binita@demo.com', password: 'user123', role: 'user', port: '3002' },
  ]);

  await Equipment.create([
    { name: 'Epson PowerLite Projector', category: 'AV', status: 'available', location: 'Lab 301', dailyPenaltyRate: 5 },
    { name: 'Canon EOS 90D Camera', category: 'Photo', status: 'available', location: 'Media Center', dailyPenaltyRate: 7 },
    { name: 'MacBook Pro 16" M2', category: 'Laptop', status: 'available', location: 'IT Storeroom', dailyPenaltyRate: 10 },
    { name: 'Shure Wireless Mic Kit', category: 'Audio', status: 'maintenance', location: 'Repair Desk', dailyPenaltyRate: 4 },
    { name: 'Heavy Duty Tripod', category: 'Accessory', status: 'available', location: 'Equipment Rack', dailyPenaltyRate: 2 },
    { name: 'DJI Ronin Gimbal', category: 'Stabilizer', status: 'available', location: 'Creative Suite', dailyPenaltyRate: 8 },
  ]);

  console.log('✅ Database seeded!');
  process.exit();
};

seed().catch(err => { console.error(err); process.exit(1); });