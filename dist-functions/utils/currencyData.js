"use strict";
// src/utils/currencyData.ts
// Mapping of country ISO codes to currency information
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCurrency = exports.countryCallingCodeMap = exports.countryCurrencyMap = void 0;
exports.getCurrencyInfoFromCountry = getCurrencyInfoFromCountry;
exports.getCurrencyInfoFromCallingCode = getCurrencyInfoFromCallingCode;
// Map of country ISO codes to currency information
exports.countryCurrencyMap = {
    // Top 25 countries by GDP
    'US': { code: 'USD', symbol: '$', locale: 'en-US', name: 'US Dollar', position: 'prefix' },
    'CN': { code: 'CNY', symbol: '¥', locale: 'zh-CN', name: 'Chinese Yuan', position: 'prefix' },
    'JP': { code: 'JPY', symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen', position: 'prefix' },
    'DE': { code: 'EUR', symbol: '€', locale: 'de-DE', name: 'Euro', position: 'suffix' },
    'IN': { code: 'INR', symbol: '₹', locale: 'en-IN', name: 'Indian Rupee', position: 'prefix' },
    'GB': { code: 'GBP', symbol: '£', locale: 'en-GB', name: 'British Pound', position: 'prefix' },
    'FR': { code: 'EUR', symbol: '€', locale: 'fr-FR', name: 'Euro', position: 'suffix' },
    'BR': { code: 'BRL', symbol: 'R$', locale: 'pt-BR', name: 'Brazilian Real', position: 'prefix' },
    'IT': { code: 'EUR', symbol: '€', locale: 'it-IT', name: 'Euro', position: 'suffix' },
    'CA': { code: 'CAD', symbol: '$', locale: 'en-CA', name: 'Canadian Dollar', position: 'prefix' },
    'RU': { code: 'RUB', symbol: '₽', locale: 'ru-RU', name: 'Russian Ruble', position: 'suffix' },
    'KR': { code: 'KRW', symbol: '₩', locale: 'ko-KR', name: 'South Korean Won', position: 'prefix' },
    'AU': { code: 'AUD', symbol: '$', locale: 'en-AU', name: 'Australian Dollar', position: 'prefix' },
    'ES': { code: 'EUR', symbol: '€', locale: 'es-ES', name: 'Euro', position: 'suffix' },
    'MX': { code: 'MXN', symbol: '$', locale: 'es-MX', name: 'Mexican Peso', position: 'prefix' },
    'ID': { code: 'IDR', symbol: 'Rp', locale: 'id-ID', name: 'Indonesian Rupiah', position: 'prefix' },
    'NL': { code: 'EUR', symbol: '€', locale: 'nl-NL', name: 'Euro', position: 'suffix' },
    'CH': { code: 'CHF', symbol: 'CHF', locale: 'de-CH', name: 'Swiss Franc', position: 'prefix' },
    'SA': { code: 'SAR', symbol: '﷼', locale: 'ar-SA', name: 'Saudi Riyal', position: 'suffix' },
    'TR': { code: 'TRY', symbol: '₺', locale: 'tr-TR', name: 'Turkish Lira', position: 'suffix' },
    'PL': { code: 'PLN', symbol: 'zł', locale: 'pl-PL', name: 'Polish Złoty', position: 'suffix' },
    'TW': { code: 'TWD', symbol: 'NT$', locale: 'zh-TW', name: 'New Taiwan Dollar', position: 'prefix' },
    'SE': { code: 'SEK', symbol: 'kr', locale: 'sv-SE', name: 'Swedish Krona', position: 'suffix' },
    'BE': { code: 'EUR', symbol: '€', locale: 'fr-BE', name: 'Euro', position: 'suffix' },
    'AR': { code: 'ARS', symbol: '$', locale: 'es-AR', name: 'Argentine Peso', position: 'prefix' }
};
// Map of country calling codes to ISO codes
exports.countryCallingCodeMap = {
    '+1': 'US', // United States/Canada
    '+86': 'CN', // China
    '+49': 'DE', // Germany
    '+81': 'JP', // Japan
    '+91': 'IN', // India
    '+44': 'GB', // United Kingdom
    '+33': 'FR', // France
    '+55': 'BR', // Brazil
    '+39': 'IT', // Italy
    '+7': 'RU', // Russia
    '+52': 'MX', // Mexico
    '+61': 'AU', // Australia
    '+82': 'KR', // South Korea
    '+34': 'ES', // Spain
    '+62': 'ID', // Indonesia
    '+31': 'NL', // Netherlands
    '+90': 'TR', // Turkey
    '+966': 'SA', // Saudi Arabia
    '+41': 'CH', // Switzerland
    '+48': 'PL', // Poland
    '+886': 'TW', // Taiwan
    '+32': 'BE', // Belgium
    '+46': 'SE', // Sweden
    '+54': 'AR' // Argentina
};
// Default currency info (fallback)
exports.defaultCurrency = {
    code: 'INR',
    symbol: '₹',
    locale: 'en-IN',
    name: 'Indian Rupee',
    position: 'prefix'
};
// Get currency info from country ISO code
function getCurrencyInfoFromCountry(countryCode) {
    return exports.countryCurrencyMap[countryCode] || exports.defaultCurrency;
}
// Get currency info from calling code
function getCurrencyInfoFromCallingCode(callingCode) {
    const countryCode = exports.countryCallingCodeMap[callingCode];
    return countryCode ? getCurrencyInfoFromCountry(countryCode) : exports.defaultCurrency;
}
