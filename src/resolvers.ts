const resolvers = {
  Query: {
    posts: async (_, { offset = 0, limit = 10, userId }, { prisma, user }) => {
      const where = userId ? { authorId: userId } : {};

      const posts = await prisma.post.findMany({
        where,
        include: {
          author: true,
          likes: true,
          dislikes: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: limit,
      });

      return posts.map((post) => ({
        ...post,
        likeCount: post.likes.length,
        dislikeCount: post.dislikes.length,
        isLiked: user ? post.likes.some((like) => like.id === user.id) : false,
        isDisliked: user ? post.dislikes.some((dislike) => dislike.id === user.id) : false,
      }));
    },
    // ... other resolvers
  },
};
