const ROLES = {
  ADMIN: 'admin',
  ANALYST: 'analyst',
  VIEWER: 'viewer'
};

const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

const CATEGORIES = [
  'salary',
  'freelance',
  'investment',
  'rent',
  'food',
  'transport',
  'utilities',
  'healthcare',
  'entertainment',
  'shopping',
  'education',
  'other'
];

module.exports = { ROLES, TRANSACTION_TYPES, CATEGORIES };