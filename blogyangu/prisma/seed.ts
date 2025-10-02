import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a sample user if none exists
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeUfkZMBs9kYZP6', // password: "password"
      displayName: 'Admin User',
      role: 'ADMIN',
      isVerified: true,
    },
  })

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest tech news and tutorials',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Web dev tips and tricks',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'programming' },
      update: {},
      create: {
        name: 'Programming',
        slug: 'programming',
        description: 'Programming concepts and best practices',
      },
    }),
  ])

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Getting Started with Next.js 15',
        slug: 'getting-started-nextjs-15',
        excerpt: 'Learn the new features and improvements in Next.js 15 and how to get started with your first project.',
        content: `# Getting Started with Next.js 15

Next.js 15 brings exciting new features and improvements that make web development even better. In this post, we'll explore what's new and how you can leverage these features in your projects.

## What's New in Next.js 15?

1. **Improved Performance**: Faster builds and better optimization
2. **Enhanced Developer Experience**: Better error messages and debugging
3. **New App Router Features**: More powerful routing capabilities
4. **Better TypeScript Support**: Improved type checking and IntelliSense

## Setting Up Your First Project

To create a new Next.js 15 project, run:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

This will set up a new project with all the latest features enabled.

## Conclusion

Next.js 15 is a significant update that brings many improvements. Start exploring these features today to build better web applications!`,
        authorId: user.id,
        categoryId: categories[1].id,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        metaDescription: 'Learn about Next.js 15 features and get started with your first project.',
      },
    }),
    prisma.post.create({
      data: {
        title: 'Understanding React Server Components',
        slug: 'understanding-react-server-components',
        excerpt: 'Deep dive into React Server Components and how they revolutionize modern web development.',
        content: `# Understanding React Server Components

React Server Components (RSC) represent a paradigm shift in how we build React applications. Let's explore what they are and why they matter.

## What are Server Components?

Server Components are components that render exclusively on the server. This means:

- They have direct access to server-side resources
- They don't increase your client-side JavaScript bundle size
- They can use async/await directly in the component

## Benefits

1. **Reduced Bundle Size**: Less JavaScript sent to the client
2. **Better Performance**: Faster initial page loads
3. **Improved SEO**: Better search engine optimization
4. **Direct Data Access**: No need for API layers

## Example

Here's a simple Server Component:

\`\`\`tsx
async function PostsPage() {
  const posts = await db.posts.findMany()
  
  return (
    <div>
      <h1>Latest Posts</h1>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
\`\`\`

## Conclusion

Server Components are a game-changer for React development. Start using them today to build faster, more efficient applications!`,
        authorId: user.id,
        categoryId: categories[2].id,
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        metaDescription: 'Learn about React Server Components and their benefits for modern web development.',
      },
    }),
    prisma.post.create({
      data: {
        title: 'The Future of Web Development',
        slug: 'future-web-development',
        excerpt: 'Exploring emerging trends and technologies that will shape the future of web development.',
        content: `# The Future of Web Development

The web development landscape is constantly evolving. Let's explore the trends and technologies that will shape the future of our industry.

## Emerging Trends

### 1. AI-Powered Development
Artificial Intelligence is transforming how we write code, debug applications, and optimize performance.

### 2. Edge Computing
Moving computation closer to users for better performance and lower latency.

### 3. WebAssembly
Enabling high-performance applications to run in the browser at near-native speed.

### 4. Progressive Web Apps (PWAs)
Bridging the gap between web and native applications.

## What This Means for Developers

As developers, we need to:
- Stay curious and keep learning
- Embrace new technologies thoughtfully
- Focus on user experience and performance
- Build accessible and inclusive applications

## Conclusion

The future of web development is exciting! By staying informed and adaptable, we can build amazing experiences for users around the world.`,
        authorId: user.id,
        categoryId: categories[0].id,
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        metaDescription: 'Explore emerging trends and technologies shaping the future of web development.',
      },
    }),
  ])

  console.log('✅ Database seeded successfully!')
  console.log(`Created ${posts.length} posts and ${categories.length} categories`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
