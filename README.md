# ResearchHub

A modern research paper discovery and management platform built with Next.js, TypeScript, and Prisma— built while vibe-coding.

## Features

### 📚 Paper Management
- **Browse Research Papers**: Discover and explore a curated collection of research papers
- **Advanced Search**: Semantic search powered by AI to find relevant papers
- **Paper Details**: View comprehensive information about each paper including authors, tags, and categories
- **PDF Download**: Direct download links to research papers

### 🔖 Bookmarking System
- **Save Papers**: Bookmark papers for later reference
- **Bookmark Management**: View all bookmarked papers in a dedicated section
- **Dashboard Integration**: See bookmark count in your dashboard

### 👤 User Features
- **Authentication**: Secure login via Google OAuth or email/password credentials
- **User Dashboard**: Personalized dashboard showing uploads and bookmarks
- **Profile Management**: 
  - Update username
  - Add bio/description
  - Upload/change profile picture
- **Paper Upload**: Upload new research papers with metadata

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Database toolkit and ORM
- **NextAuth.js** - Authentication library

### Database
- **MySQL** - Relational database
- **Prisma Migrations** - Database versioning

### External Services
- **Cloudinary** - Image hosting and optimization
- **Google OAuth** - Social authentication
- **Genkit AI** - Semantic search capabilities

## Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- Cloudinary account (for pdf/image uploads)
- Google OAuth credentials (for OAuth login)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/pragyan-ghimire/ResearchHub.git
cd ResearchHub
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/researchhub"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"
```

4. **Setup Database**
```bash
# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   ├── auth/                   # Authentication pages
│   ├── dashboard/              # User dashboard
│   ├── papers/                 # Paper detail pages
│   ├── bookmarks/              # Bookmarks page
│   ├── upload/                 # Paper upload page
│   ├── actions.ts              # Server actions
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   ├── common/                 # Header, logo, theme
│   ├── dashboard/              # Dashboard components
│   ├── papers/                 # Paper components
│   ├── search/                 # Search components
│   └── ui/                     # UI components (Radix)
├── hooks/                      # Custom React hooks
├── lib/                        # Utilities and types
├── types/                      # TypeScript definitions
└── ai/                         # AI/ML related code

prisma/
├── schema.prisma               # Database schema
└── migrations/                 # Migration files
```

## Database Schema

### User
- Profile information (name, email, image, bio)
- Authentication credentials
- Relations: papers, bookmarks, accounts, sessions

### Paper
- Title, abstract, PDF URL
- Metadata (published date, uploaded date)
- Relations: authors, tags, categories, uploader, bookmarks

### Author, Tag, Category
- Classification and metadata for papers

## API Endpoints

### Papers
- `GET /api/papers/user` - Get user's uploaded papers
- `GET /api/papers/bookmarks` - Get user's bookmarked papers
- `GET /api/papers/download?url=...` - Download paper PDF

### Authentication
- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/callback/[provider]` - OAuth callback
- `GET /api/auth/signout` - Sign out

## Key Features Implementation

### Semantic Search
Papers are searchable using semantic similarity powered by AI, allowing users to find relevant research even with different keywords.

### Bookmark System
- Real-time bookmark toggle
- Persistent storage in database
- Reflects across dashboard and paper views

### Profile Management
- Update username, bio, and profile picture
- Changes immediately reflected in user session
- Profile pictures stored as URLs for optimal performance

## Build & Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deployment Options
- **Vercel**: Optimized for Next.js, one-click deployment
- **Google Cloud**: Using App Hosting
- **Docker**: Container support available
- **Traditional VPS**: Standard Node.js deployment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running on port 3306
- Verify DATABASE_URL in .env file
- Check database credentials

### Authentication Errors
- Verify NEXTAUTH_URL matches your deployment domain
- Check NEXTAUTH_SECRET is set
- Ensure Google OAuth credentials are valid

### Image Upload Issues
- Verify Cloudinary credentials in .env
- Check upload preset exists in Cloudinary console
- Ensure NEXT_PUBLIC variables are prefixed correctly

## Performance Optimizations

- ✅ Image optimization with next/image
- ✅ Server-side rendering for critical pages
- ✅ Efficient database queries with Prisma
- ✅ Semantic search with caching
- ✅ Authentication session management
- ✅ Dynamic code splitting

## License

This project is licensed under the MIT License - see LICENSE file for details.

**ResearchHub** - Making research discovery simple and accessible.
