const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    posts: [Post!]!
    createdAt: String!
    updatedAt: String!
  }

  type Post {
    id: ID!
    title: String!
    description: String!
    author: User!
    likes: [User!]!
    dislikes: [User!]!
    likeCount: Int!
    dislikeCount: Int!
    isLiked: Boolean!
    isDisliked: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
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

  type Query {
    me: User
    posts(offset: Int, limit: Int, userId: ID): [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    createPost(input: CreatePostInput!): Post!
    updatePost(input: UpdatePostInput!): Post!
    deletePost(id: ID!): ID!
    likePost(id: ID!): Post!
    dislikePost(id: ID!): Post!
  }
`;

export default typeDefs;
