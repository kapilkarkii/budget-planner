export const CURRENCIES = {
  USD: { symbol: '$', label: 'US Dollar' },
  EUR: { symbol: '€', label: 'Euro' },
  GBP: { symbol: '£', label: 'British Pound' },
  INR: { symbol: '₹', label: 'Indian Rupee' },
  NPR: { symbol: 'Rs.', label: 'Nepalese Rupee' },
  JPY: { symbol: '¥', label: 'Japanese Yen' },
  AUD: { symbol: 'A$', label: 'Australian Dollar' },
  CAD: { symbol: 'C$', label: 'Canadian Dollar' },
}

export const getCurrencySymbol = (code) => CURRENCIES[code]?.symbol || '$'