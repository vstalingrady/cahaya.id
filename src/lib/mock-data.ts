// src/lib/mock-data.ts

export const mockInstitutions = [
  {
    institution_id: 'mock-bank-bca',
    name: 'Bank BCA',
    logo: 'https://placehold.co/40x40/png',
  },
  {
    institution_id: 'mock-bank-mandiri',
    name: 'Bank Mandiri',
    logo: 'https://placehold.co/40x40/png',
  },
  {
    institution_id: 'mock-ewallet-gopay',
    name: 'GoPay',
    logo: 'https://placehold.co/40x40/png',
  },
];

export const db = {
  users: [
    {
      id: 'user-1',
      name: 'Budi',
      bank_login: {
        username: 'budi.mock',
        password_plaintext: 'password123',
      },
    },
  ],
};
