-- CreateTable
CREATE TABLE "kid_profiles" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "blood_group" TEXT,
    "allergies" TEXT,
    "medical_conditions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kid_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaccinations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "recommended_age" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'GENERAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vaccinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kid_vaccinations" (
    "id" SERIAL NOT NULL,
    "kid_id" INTEGER NOT NULL,
    "vaccination_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "administered_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kid_vaccinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pregnancy_profiles" (
    "id" SERIAL NOT NULL,
    "mother_id" INTEGER NOT NULL,
    "mother_name" TEXT NOT NULL,
    "expected_delivery_date" TIMESTAMP(3) NOT NULL,
    "pregnancy_week" INTEGER NOT NULL DEFAULT 1,
    "medical_history" TEXT,
    "doctor_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pregnancy_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pregnancy_symptom_logs" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "symptoms" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "notes" TEXT,
    "logged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pregnancy_symptom_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_remedies" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "illness_type" TEXT NOT NULL,
    "guidance" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_remedies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sops" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "steps" TEXT NOT NULL,
    "portal_type" TEXT NOT NULL,
    "is_emergency" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "kid_profiles_parent_id_idx" ON "kid_profiles"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "vaccinations_name_key" ON "vaccinations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "kid_vaccinations_kid_id_vaccination_id_key" ON "kid_vaccinations"("kid_id", "vaccination_id");

-- CreateIndex
CREATE UNIQUE INDEX "pregnancy_profiles_mother_id_key" ON "pregnancy_profiles"("mother_id");

-- CreateIndex
CREATE INDEX "pregnancy_profiles_mother_id_idx" ON "pregnancy_profiles"("mother_id");

-- CreateIndex
CREATE INDEX "pregnancy_symptom_logs_profile_id_idx" ON "pregnancy_symptom_logs"("profile_id");

-- AddForeignKey
ALTER TABLE "kid_profiles" ADD CONSTRAINT "kid_profiles_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kid_vaccinations" ADD CONSTRAINT "kid_vaccinations_kid_id_fkey" FOREIGN KEY ("kid_id") REFERENCES "kid_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kid_vaccinations" ADD CONSTRAINT "kid_vaccinations_vaccination_id_fkey" FOREIGN KEY ("vaccination_id") REFERENCES "vaccinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pregnancy_profiles" ADD CONSTRAINT "pregnancy_profiles_mother_id_fkey" FOREIGN KEY ("mother_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pregnancy_symptom_logs" ADD CONSTRAINT "pregnancy_symptom_logs_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "pregnancy_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
