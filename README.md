# MediChain - Blockchain Drug Verification

A secure pharmaceutical supply chain verification system using Cardano blockchain technology. This application runs entirely on testnet with no real ADA required.

## 🌟 Features

- **Drug Verification**: Scan QR codes or enter batch IDs to verify drug authenticity
- **NFT Minting**: Manufacturers can mint NFTs for drug batches on Cardano testnet
- **Analytics Dashboard**: Real-time verification statistics and trends
- **Testnet Only**: No real cryptocurrency required - uses Cardano preprod testnet

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), shadcn/ui, Tailwind CSS
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Prisma with Neon adapter
- **Blockchain**: Cardano Testnet (Preprod) via Blockfrost API
- **Deployment**: Vercel (Free Tier)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd medichain
npm install
```

### 2. Database Setup (Neon)

1. **Create Neon Account**:
   - Visit [Neon.tech](https://neon.tech)
   - Sign up for free account
   - Create a new project

2. **Get Database URLs**:
   - Copy the `DATABASE_URL` (pooled connection)
   - Copy the `DIRECT_URL` (direct connection)
   - Both URLs are available in your Neon dashboard

3. **Neon Free Tier Limits**:
   - 512 MB storage
   - 1 database
   - Automatic scaling to zero
   - Perfect for development and small projects

### 3. Cardano Testnet Setup

1. **Get Blockfrost API Key**:
   - Visit [Blockfrost.io](https://blockfrost.io)
   - Create account and project
   - Select "Preprod" network
   - Copy your project ID

2. **Get Free Test ADA**: [Cardano Testnet Faucet](https://faucet.preprod.world.dev.cardano.org)

### 4. Environment Variables

Create `.env.local`:

```env
# Neon Database URLs
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Cardano Testnet
BLOCKFROST_TESTNET_KEY="preprod_your_key_here"

# Optional - Enable mock mode for development
NEXT_PUBLIC_MOCK_MODE="true"
```

### 5. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to Neon database
npm run db:push

# Seed with test data
npm run db:seed
```

### 6. Development

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🧪 Testing

### Test Batch IDs

Use these batch IDs for testing verification:

- `TEST_GENUINE_1` - Paracetamol 500mg (PharmaCorp Ltd.)
- `TEST_GENUINE_2` - Amoxicillin 250mg (MediTech Solutions)
- `TEST_GENUINE_3` - Ibuprofen 400mg (BioHealth Inc.)
- `TEST_FAKE_1` - Counterfeit drug batch

### Mock Mode

Set `NEXT_PUBLIC_MOCK_MODE="true"` to bypass blockchain calls during development.

## 📊 Database Schema

```sql
-- Batches table
CREATE TABLE batches (
  batch_id VARCHAR(64) PRIMARY KEY,
  drug_name VARCHAR(200),
  manufacturer VARCHAR(100),
  dosage VARCHAR(50),
  quantity INTEGER,
  expiry_date DATE,
  manufacturing_date DATE,
  cardano_asset_id VARCHAR(56),
  nft_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Verifications table  
CREATE TABLE verifications (
  id SERIAL PRIMARY KEY,
  batch_id VARCHAR(64) REFERENCES batches(batch_id),
  is_genuine BOOLEAN,
  pharmacy_id VARCHAR(64),
  location VARCHAR(200),
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Manufacturers table
CREATE TABLE manufacturers (
  id TEXT PRIMARY KEY,
  name VARCHAR(100),
  license_number VARCHAR(50) UNIQUE,
  contact_email VARCHAR(100),
  wallet_address VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**:
   - Connect your GitHub repository to Vercel
   - Import the project

2. **Environment Variables**:
   Add these in Vercel dashboard:
   ```
   DATABASE_URL=@medichain-database-url
   DIRECT_URL=@medichain-direct-url
   BLOCKFROST_TESTNET_KEY=@blockfrost-testnet-key
   ```

3. **Deploy**:
   - Automatic deployment on push to main branch
   - Database migrations run automatically

### Neon Database Configuration

1. **Connection Pooling**: Neon automatically handles connection pooling
2. **Scaling**: Database scales to zero when not in use
3. **Branching**: Use Neon branches for different environments

## 🔒 Security & Privacy

- **GDPR Compliant**: No personal information stored
- **Testnet Only**: No real cryptocurrency transactions
- **Connection Security**: SSL-encrypted database connections
- **Serverless**: Automatic scaling and security updates
- **Data Retention**: Verification logs can be auto-pruned

## 📱 API Endpoints

- `POST /api/verify` - Verify drug batch
- `POST /api/mint` - Mint new drug batch NFT
- `GET /api/batches` - List drug batches
- `GET /api/analytics` - Get verification analytics

## 🎯 Key Features

### Neon Database Benefits
- **Serverless**: Automatic scaling to zero
- **Branching**: Database branches for development
- **Fast**: Sub-second cold starts
- **Cost-effective**: Pay only for what you use

### Testnet Indicator
Every page shows a clear indicator that the app uses Cardano testnet:

### QR Code Verification
- Camera-based QR scanning
- Manual batch ID entry
- Real-time blockchain verification
- Detailed verification results

### Manufacturer Portal
- NFT minting for drug batches
- Batch management dashboard
- QR code generation
- Supply chain tracking

### Analytics Dashboard
- Verification statistics
- Counterfeit detection rates
- Manufacturer performance
- Real-time monitoring

## 🛠️ Development Commands

```bash
# Database
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema changes
npm run db:migrate    # Create and run migrations
npm run db:studio     # Open Prisma Studio
npm run db:seed       # Seed test data

# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Neon Docs**: [Neon Documentation](https://neon.tech/docs)
- **Testnet Faucet**: [Get Free Test ADA](https://faucet.preprod.world.dev.cardano.org)
- **Blockfrost Docs**: [API Documentation](https://docs.blockfrost.io)
- **Cardano Docs**: [Developer Portal](https://developers.cardano.org)

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Check if DATABASE_URL is correct
npx prisma db pull

# Reset database (development only)
npx prisma migrate reset
```

### Neon Connection Limits
- Free tier: 100 concurrent connections
- Use connection pooling (automatically handled)
- Monitor usage in Neon dashboard

---

**⚠️ Important**: This application uses Cardano testnet only. No real ADA or mainnet transactions are involved.

**🚀 Powered by**: Neon Database - The serverless PostgreSQL platform