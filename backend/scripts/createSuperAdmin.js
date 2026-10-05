import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../config/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createSuperAdmin() {
  console.log('\n🔒 ── PENGUIN MENSWEAR SUPERADMIN INITIALIZER (PostgreSQL) ──');
  console.log('Connecting to PostgreSQL database...');

  try {
    await prisma.$connect();
    console.log('🐘 Connected to PostgreSQL.\n');

    const email = (await askQuestion('Enter Superadmin Email (default: admin@penguin.com): ')).trim() || 'admin@penguin.com';
    const password = (await askQuestion('Enter Strong Superadmin Password (default: admin123): ')).trim() || 'admin123';

    if (!password || password.length < 6) {
      console.error('❌ Password must be at least 6 characters long.');
      process.exit(1);
    }

    const name = (await askQuestion('Enter Superadmin Name (default: Lead Architect): ')).trim() || 'Lead Architect';

    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log(`⚠️ User with email "${email}" already exists. Upgrading to superadmin & updating credentials...`);
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          role: 'superadmin',
          name,
          password: hashedPassword,
          mfaEnabled: false,
          mfaSecret: null,
          backupCodes: [],
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
      console.log(`✅ Superadmin updated successfully for ${email}`);
    } else {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'superadmin',
          mfaEnabled: false,
        },
      });
      console.log(`✅ Superadmin account "${email}" created successfully in PostgreSQL.`);
    }

    console.log('\n💡 You can now log into the Penguin Superadmin Console (/penguin-super-ctrl) and initialize TOTP MFA.');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Could not connect to PostgreSQL:', err.message);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createSuperAdmin();
