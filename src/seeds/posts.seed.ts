import { Post } from '../models/post.model.js';
import type { UserDocument } from '../types/model.types.js';

const generatePosts = (users: UserDocument[]) => {
  const posts = [];
  const topics = ['Web Development', 'React Native', 'GraphQL', 'TypeScript', 'System Design', 'Node.js', 'MongoDB', 'AWS', 'Docker'];

  for (const user of users) {
    for (let i = 0; i < 3; i++) {
      const topic = topics[Math.floor(Math.random() * topics.length)];
      const isFirstUser = user.username === 'pavithran';
      const isSecondUser = user.username === 'rajkumar';

      let title, description;

      if (isFirstUser) {
        title = `${topic} Best Practices and Tips`;
        description = `In this comprehensive guide, I'll share my experience with ${topic}. 
          We'll cover advanced concepts, common pitfalls to avoid, and professional tips 
          that I've learned throughout my journey as a developer.`;
      } else if (isSecondUser) {
        title = `Building Scalable ${topic} Applications`;
        description = `Let's explore how to build enterprise-grade applications using ${topic}. 
          This post covers architecture decisions, performance optimizations, and real-world 
          examples from my experience in building large-scale systems.`;
      } else {
        title = `Modern ${topic} Development in 2024`;
        description = `A deep dive into modern ${topic.toLowerCase()} development practices. 
          We'll explore the latest tools, frameworks, and methodologies that are shaping 
          the future of software development.`;
      }

      posts.push({
        title,
        description,
        author: user._id,
        likes: [users[(users.indexOf(user) + 1) % users.length]._id],
        dislikes: [users[(users.indexOf(user) + 2) % users.length]._id],
      });
    }
  }

  return posts;
};

export const seedPosts = async (users: UserDocument[]) => {
  try {
    // Clear existing posts
    await Post.deleteMany({});

    // Generate and insert posts
    const posts = generatePosts(users);
    await Post.insertMany(posts);

    console.log('✅ Posts seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding posts:', error);
    throw error;
  }
};
