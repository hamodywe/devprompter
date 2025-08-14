🚀 To Run the Backend

1. Install dependencies:
   cd backend
   npm install

2. Set up PostgreSQL and create .env file (copy from .env.example)
3. Run database migrations:
   npx prisma migrate dev
   npx prisma db seed

4. Start the server:
   npm run dev
