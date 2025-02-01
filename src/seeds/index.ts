import mongoose from 'mongoose';
import { environment } from '../config/environment.js';
import { seedUsers } from './users.seed.js';
import { seedPosts } from './posts.seed.js';

const seed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(environment.mongodbUri);
    console.log('📦 Connected to MongoDB');

    // Seed users first
    const users = await seedUsers();

    // Then seed posts with the created users
    await seedPosts(users);

    console.log('🌱 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seed();
