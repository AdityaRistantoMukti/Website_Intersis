-- ============================================================================
-- SQL Migration: Penambahan Dukungan Bilingual (ID & EN)
-- Database: isa_career_hrd
-- ============================================================================

USE `isa_career_hrd`;

-- 1. Tambah Kolom Bahasa Inggris pada Profil Perusahaan
ALTER TABLE `company_profile` 
  ADD COLUMN IF NOT EXISTS `title_en` varchar(150) NULL AFTER `title`,
  ADD COLUMN IF NOT EXISTS `description_en` text NULL AFTER `description`,
  ADD COLUMN IF NOT EXISTS `vision_en` text NULL AFTER `vision`,
  ADD COLUMN IF NOT EXISTS `mission_en` text NULL AFTER `mission`;

-- 2. Tambah Kolom Bahasa Inggris pada Kontak
ALTER TABLE `contact_recruitment`
  ADD COLUMN IF NOT EXISTS `address_en` text NULL AFTER `address`;

-- 3. Tambah Kolom Bahasa Inggris pada Core Values
ALTER TABLE `core_values`
  ADD COLUMN IF NOT EXISTS `title_en` varchar(100) NULL AFTER `title`,
  ADD COLUMN IF NOT EXISTS `description_en` text NULL AFTER `description`;

-- 4. Inisialisasi Data Default English
UPDATE `company_profile` SET
  `title_en` = 'PT. Global Philsonic Technologies',
  `description_en` = 'PT. Global Philsonic Technologies (GPT) is a premier high-precision electronics manufacturing and industrial automation solutions provider operating in the Batam Free Trade Zone (FTZ). With a 10,000 m² IATF 16949-certified facility, we manufacture automotive electronic modules, smart QLED head units, DSP audio processor systems, driving safety sensor devices, and high-speed automated functional test fixtures at 80,000 CPH.',
  `vision_en` = 'To be the trusted Tier-1 automotive electronics and automation engineering manufacturing partner in Southeast Asia with zero-defect quality standards and global duty-free logistics efficiency.',
  `mission_en` = '1. Deliver high-precision SMT assembly with micron tolerance meeting international IATF 16949 automotive standards.\n2. Provide end-to-end OEM/ODM services from DFM, rapid prototyping, to mass production and turnkey box-build.\n3. Develop automation engineering solutions and smart test jigs to maximize Industry 4.0 yield.\n4. Leverage Batam Free Trade Zone strategic advantages to deliver duty-free supply chain and 45-minute freight to Singapore.'
WHERE `id` = 1;

UPDATE `contact_recruitment` SET
  `address_en` = 'Batam Industrial Park, Mukakuning, Batam Free Trade Zone, Riau Islands 29433, Indonesia'
WHERE `id` = 1;

UPDATE `core_values` SET `title_en` = 'Micron SMT Precision', `description_en` = 'High-speed 80,000 CPH placement line with 100% inline 3D SPI and AOI inspection.' WHERE `title` LIKE '%Presisi SMT%';
UPDATE `core_values` SET `title_en` = 'IATF 16949 Quality Compliance', `description_en` = 'Strict automotive standard operating procedure with zero-defect quality discipline.' WHERE `title` LIKE '%Kepatuhan Mutu%';
UPDATE `core_values` SET `title_en` = 'Automation & Smart Jigs', `description_en` = 'Custom automated functional test fixtures (FCT) integrated with cloud MES traceability.' WHERE `title` LIKE '%Otomasi &%';
UPDATE `core_values` SET `title_en` = '0% Tariff FTZ Logistics', `description_en` = 'Batam Free Trade Zone strategic hub with 45-minute direct sea freight to Singapore port.' WHERE `title` LIKE '%Logistik Bebas%';
