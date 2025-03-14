-- CreateTable
CREATE TABLE "TP" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "TP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ReviewType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationStatus" (
    "id" SERIAL NOT NULL,
    "phaseId" INTEGER NOT NULL,

    CONSTRAINT "ModerationStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phase" (
    "id" SERIAL NOT NULL,
    "tPId" INTEGER NOT NULL,
    "stageId" INTEGER NOT NULL,
    "reviewTypeId" INTEGER NOT NULL,
    "triggerId" INTEGER NOT NULL,

    CONSTRAINT "Phase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhaseTrigger" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PhaseTrigger_pkey" PRIMARY KEY ("id")
);
