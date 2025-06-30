"use strict";
// src/utils/currencyUtils.ts
// Utility functions for currency formatting and handling
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = formatCurrency;
exports.parseCurrency = parseCurrency;
exports.formatCompactCurrency = formatCompactCurrency;
exports.formatPercentage = formatPercentage;
const currencyData_1 = require("./currencyData");
/**
 * Format a number as currency using the provided currency info
 * @param amount The amount to format
 * @param currencyInfo The currency information to use for formatting
 * @param options Additional formatting options
 * @returns Formatted currency string
 */
function formatCurrency(amount, currencyInfo = currencyData_1.defaultCurrency, options = {}) {
    try {
        const formatter = new Intl.NumberFormat(currencyInfo.locale, {
            style: 'currency',
            currency: currencyInfo.code,
            maximumFractionDigits: 0,
            ...options
        });
        return formatter.format(amount);
    }
    catch (error) {
        console.error('Error formatting currency:', error);
        // Fallback formatting if Intl.NumberFormat fails
        const formattedNumber = amount.toLocaleString();
        return currencyInfo.position === 'prefix'
            ? `${currencyInfo.symbol}${formattedNumber}`
            : `${formattedNumber} ${currencyInfo.symbol}`;
    }
}
/**
 * Parse a currency string back to a number
 * @param currencyString The currency string to parse
 * @returns The parsed number value
 */
function parseCurrency(currencyString) {
    // Remove currency symbols and non-numeric characters except decimal point
    const numericString = currencyString.replace(/[^\d.-]/g, '');
    return parseFloat(numericString) || 0;
}
/**
 * Format a large number in a more readable way (e.g., 1.5M, 2.3K)
 * @param amount The amount to format
 * @param currencyInfo The currency information to use
 * @returns Formatted currency string with abbreviated large numbers
 */
function formatCompactCurrency(amount, currencyInfo = currencyData_1.defaultCurrency) {
    if (amount >= 10000000) { // 1 crore or more
        return `${currencyInfo.symbol}${(amount / 10000000).toFixed(1)}Cr`;
    }
    else if (amount >= 100000) { // 1 lakh or more
        return `${currencyInfo.symbol}${(amount / 100000).toFixed(1)}L`;
    }
    else if (amount >= 1000) { // 1 thousand or more
        return `${currencyInfo.symbol}${(amount / 1000).toFixed(1)}K`;
    }
    else {
        return formatCurrency(amount, currencyInfo);
    }
}
/**
 * Format a number as a percentage
 * @param value The decimal value to format as percentage
 * @param locale The locale to use for formatting
 * @returns Formatted percentage string
 */
function formatPercentage(value, locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(value);
}
