import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { environment } from '../config/environment.js';

export const users = [
  {
    username: 'pavithran',
    email: 'pavithran@example.com',
    password: 'password123',
  },
  {
    username: 'rajkumar',
    email: 'rajkumar@example.com',
    password: 'password123',
  },
  {
    username: 'pavi_raj',
    email: 'paviraj@example.com',
    password: 'password123',
  },
];

export const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Hash passwords before inserting
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log('✅ Users seeded successfully');
    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};
