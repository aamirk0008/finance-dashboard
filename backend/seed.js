require('dotenv').config();
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Transaction = require('./src/models/Transaction');

const users = [
  {
    name: 'Admin User',
    email: 'admin@finance.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Analyst User',
    email: 'analyst@finance.com',
    password: 'analyst123',
    role: 'analyst'
  },
  {
    name: 'Viewer User',
    email: 'viewer@finance.com',
    password: 'viewer123',
    role: 'viewer'
  }
];

const generateTransactions = (adminId) => [
  { amount: 80000, type: 'income', category: 'salary', date: new Date('2026-01-01'), notes: 'January salary', createdBy: adminId },
  { amount: 80000, type: 'income', category: 'salary', date: new Date('2026-02-01'), notes: 'February salary', createdBy: adminId },
  { amount: 80000, type: 'income', category: 'salary', date: new Date('2026-03-01'), notes: 'March salary', createdBy: adminId },
  { amount: 80000, type: 'income', category: 'salary', date: new Date('2026-04-01'), notes: 'April salary', createdBy: adminId },
  { amount: 25000, type: 'income', category: 'freelance', date: new Date('2026-01-15'), notes: 'Freelance project', createdBy: adminId },
  { amount: 30000, type: 'income', category: 'freelance', date: new Date('2026-02-20'), notes: 'Freelance project', createdBy: adminId },
  { amount: 15000, type: 'income', category: 'investment', date: new Date('2026-03-10'), notes: 'Stock returns', createdBy: adminId },
  { amount: 15000, type: 'expense', category: 'rent', date: new Date('2026-01-05'), notes: 'Monthly rent', createdBy: adminId },
  { amount: 15000, type: 'expense', category: 'rent', date: new Date('2026-02-05'), notes: 'Monthly rent', createdBy: adminId },
  { amount: 15000, type: 'expense', category: 'rent', date: new Date('2026-03-05'), notes: 'Monthly rent', createdBy: adminId },
  { amount: 15000, type: 'expense', category: 'rent', date: new Date('2026-04-05'), notes: 'Monthly rent', createdBy: adminId },
  { amount: 8000, type: 'expense', category: 'food', date: new Date('2026-01-10'), notes: 'Groceries and dining', createdBy: adminId },
  { amount: 7500, type: 'expense', category: 'food', date: new Date('2026-02-10'), notes: 'Groceries and dining', createdBy: adminId },
  { amount: 9000, type: 'expense', category: 'food', date: new Date('2026-03-10'), notes: 'Groceries and dining', createdBy: adminId },
  { amount: 3000, type: 'expense', category: 'transport', date: new Date('2026-01-20'), notes: 'Cab and fuel', createdBy: adminId },
  { amount: 2500, type: 'expense', category: 'transport', date: new Date('2026-02-20'), notes: 'Cab and fuel', createdBy: adminId },
  { amount: 4000, type: 'expense', category: 'utilities', date: new Date('2026-01-25'), notes: 'Electricity and internet', createdBy: adminId },
  { amount: 3500, type: 'expense', category: 'utilities', date: new Date('2026-02-25'), notes: 'Electricity and internet', createdBy: adminId },
  { amount: 5000, type: 'expense', category: 'healthcare', date: new Date('2026-02-15'), notes: 'Doctor visit', createdBy: adminId },
  { amount: 6000, type: 'expense', category: 'entertainment', date: new Date('2026-03-20'), notes: 'Movies and events', createdBy: adminId },
  { amount: 12000, type: 'expense', category: 'shopping', date: new Date('2026-01-28'), notes: 'Clothes and electronics', createdBy: adminId },
  { amount: 10000, type: 'expense', category: 'education', date: new Date('2026-02-01'), notes: 'Online courses', createdBy: adminId },
];

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Transaction.deleteMany();
    console.log('Cleared existing data');

    const createdUsers = await User.create(users);
    const admin = createdUsers.find((u) => u.role === 'admin');
    console.log('Users created');

    await Transaction.create(generateTransactions(admin._id));
    console.log('Transactions created');

    console.log('\n--- Seed Complete ---');
    console.log('Admin    → admin@finance.com    / admin123');
    console.log('Analyst  → analyst@finance.com  / analyst123');
    console.log('Viewer   → viewer@finance.com   / viewer123');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();