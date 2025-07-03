-- CreateTable
CREATE TABLE "batches" (
    "batch_id" VARCHAR(64) NOT NULL,
    "drug_name" VARCHAR(200) NOT NULL,
    "manufacturer" VARCHAR(100) NOT NULL,
    "dosage" VARCHAR(50) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expiry_date" DATE NOT NULL,
    "manufacturing_date" DATE NOT NULL,
    "cardano_asset_id" VARCHAR(56),
    "nft_id" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("batch_id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" SERIAL NOT NULL,
    "batch_id" VARCHAR(64) NOT NULL,
    "is_genuine" BOOLEAN NOT NULL,
    "pharmacy_id" VARCHAR(64),
    "location" VARCHAR(200),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacturers" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "license_number" VARCHAR(50) NOT NULL,
    "contact_email" VARCHAR(100) NOT NULL,
    "wallet_address" VARCHAR(100),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manufacturers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "batches_manufacturer_idx" ON "batches"("manufacturer");

-- CreateIndex
CREATE INDEX "batches_expiry_date_idx" ON "batches"("expiry_date");

-- CreateIndex
CREATE INDEX "batches_created_at_idx" ON "batches"("created_at");

-- CreateIndex
CREATE INDEX "verifications_batch_id_idx" ON "verifications"("batch_id");

-- CreateIndex
CREATE INDEX "verifications_timestamp_idx" ON "verifications"("timestamp");

-- CreateIndex
CREATE INDEX "verifications_is_genuine_idx" ON "verifications"("is_genuine");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturers_license_number_key" ON "manufacturers"("license_number");

-- CreateIndex
CREATE INDEX "manufacturers_license_number_idx" ON "manufacturers"("license_number");

-- CreateIndex
CREATE INDEX "manufacturers_is_verified_idx" ON "manufacturers"("is_verified");

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("batch_id") ON DELETE CASCADE ON UPDATE CASCADE;
