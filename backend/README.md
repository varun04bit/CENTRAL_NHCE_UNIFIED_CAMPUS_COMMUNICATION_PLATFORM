cd backend
npm install
cp .env.example .env //creates a .env copy where you have to fill the fields
Fill in:DATABASE_URL & JWT_SECRET
npx prisma generate
npm run dev 
