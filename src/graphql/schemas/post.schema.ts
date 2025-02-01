export const postTypeDefs = `#graphql
  type Post {
    id: ID!
    title: String!
    description: String!
    author: User!
    likes: [User!]!
    dislikes: [User!]!
    createdAt: String!
    updatedAt: String!
    likeCount: Int!
    dislikeCount: Int!
    isLiked: Boolean!
    isDisliked: Boolean!
  }

  input CreatePostInput {
    title: String!
    description: String!
  }

  input UpdatePostInput {
    id: ID!
    title: String!
    description: String!
  }

  extend type Query {
    posts(offset: Int, limit: Int, userId: ID): [Post!]!
    post(id: ID!): Post!
  }

  extend type Mutation {
    createPost(input: CreatePostInput!): Post!
    updatePost(input: UpdatePostInput!): Post!
    deletePost(id: ID!): Boolean!
    likePost(id: ID!): Post!
    dislikePost(id: ID!): Post!
  }
`;
