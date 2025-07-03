import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test manufacturers
  const manufacturers = await Promise.all([
    prisma.manufacturer.upsert({
      where: { licenseNumber: 'MFG-001' },
      update: {},
      create: {
        name: 'PharmaCorp Ltd.',
        licenseNumber: 'MFG-001',
        contactEmail: 'contact@pharmacorp.com',
        isVerified: true,
      },
    }),
    prisma.manufacturer.upsert({
      where: { licenseNumber: 'MFG-002' },
      update: {},
      create: {
        name: 'MediTech Solutions',
        licenseNumber: 'MFG-002',
        contactEmail: 'info@meditech.com',
        isVerified: true,
      },
    }),
    prisma.manufacturer.upsert({
      where: { licenseNumber: 'MFG-003' },
      update: {},
      create: {
        name: 'BioHealth Inc.',
        licenseNumber: 'MFG-003',
        contactEmail: 'support@biohealth.com',
        isVerified: true,
      },
    }),
  ]);

  console.log('✅ Created manufacturers:', manufacturers.length);

  // Create test batches
  const batches = await Promise.all([
    prisma.batch.upsert({
      where: { batchId: 'TEST_GENUINE_1' },
      update: {},
      create: {
        batchId: 'TEST_GENUINE_1',
        drugName: 'Paracetamol 500mg',
        manufacturer: 'PharmaCorp Ltd.',
        dosage: '500mg',
        quantity: 10000,
        expiryDate: new Date('2025-12-31'),
        manufacturingDate: new Date('2024-01-15'),
        nftId: 'nft_test_genuine_1',
        cardanoAssetId: 'test_asset_1',
      },
    }),
    prisma.batch.upsert({
      where: { batchId: 'TEST_GENUINE_2' },
      update: {},
      create: {
        batchId: 'TEST_GENUINE_2',
        drugName: 'Amoxicillin 250mg',
        manufacturer: 'MediTech Solutions',
        dosage: '250mg',
        quantity: 5000,
        expiryDate: new Date('2025-08-15'),
        manufacturingDate: new Date('2024-02-01'),
        nftId: 'nft_test_genuine_2',
        cardanoAssetId: 'test_asset_2',
      },
    }),
    prisma.batch.upsert({
      where: { batchId: 'TEST_GENUINE_3' },
      update: {},
      create: {
        batchId: 'TEST_GENUINE_3',
        drugName: 'Ibuprofen 400mg',
        manufacturer: 'BioHealth Inc.',
        dosage: '400mg',
        quantity: 7500,
        expiryDate: new Date('2025-10-30'),
        manufacturingDate: new Date('2024-01-20'),
        nftId: 'nft_test_genuine_3',
        cardanoAssetId: 'test_asset_3',
      },
    }),
  ]);

  console.log('✅ Created batches:', batches.length);

  // Create test verifications
  const verifications = await Promise.all([
    prisma.verification.create({
      data: {
        batchId: 'TEST_GENUINE_1',
        isGenuine: true,
        pharmacyId: 'PHARM-001',
        location: 'City Pharmacy, Mumbai',
      },
    }),
    prisma.verification.create({
      data: {
        batchId: 'TEST_GENUINE_2',
        isGenuine: true,
        pharmacyId: 'PHARM-002',
        location: 'MedPlus, Delhi',
      },
    }),
    prisma.verification.create({
      data: {
        batchId: 'TEST_FAKE_1',
        isGenuine: false,
        pharmacyId: 'PHARM-003',
        location: 'Apollo Pharmacy, Bangalore',
      },
    }),
  ]);

  console.log('✅ Created verifications:', verifications.length);
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });