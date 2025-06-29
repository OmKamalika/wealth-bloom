import { CountdownTimer } from '../api/countdown-timer-api';

/**
 * Calculate the time difference between the current time and the last update time
 * @param lastUpdateTime The timestamp of the last update
 * @returns Object containing the time difference in years, months, days, hours
 */
export function calculateTimeDifference(lastUpdateTime: number): {
  years: number;
  months: number;
  days: number;
  hours: number;
} {
  const now = Date.now();
  const diffMs = now - lastUpdateTime;
  
  // Calculate time units
  const msPerHour = 1000 * 60 * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30; // Approximate
  const msPerYear = msPerDay * 365; // Approximate
  
  const years = Math.floor(diffMs / msPerYear);
  const months = Math.floor((diffMs % msPerYear) / msPerMonth);
  const days = Math.floor((diffMs % msPerMonth) / msPerDay);
  const hours = Math.floor((diffMs % msPerDay) / msPerHour);
  
  return { years, months, days, hours };
}

/**
 * Update the countdown timer based on elapsed time
 * @param timer The current countdown timer values
 * @param lastUpdateTime The timestamp of the last update
 * @returns Updated countdown timer values
 */
export function updateCountdownTimer(
  timer: CountdownTimer,
  lastUpdateTime: number
): CountdownTimer {
  // Get the time difference since last update
  const diff = calculateTimeDifference(lastUpdateTime);
  
  // Calculate new timer values
  let newYears = timer.years - diff.years;
  let newMonths = timer.months - diff.months;
  let newWeeks = timer.weeks - Math.floor(diff.days / 7);
  let newDays = timer.days - (diff.days % 7) - Math.floor(diff.hours / 24);
  
  // Handle negative values with borrowing
  if (newDays < 0) {
    newWeeks -= 1;
    newDays += 7;
  }
  
  if (newWeeks < 0) {
    newMonths -= 1;
    newWeeks += 4; // Approximate
  }
  
  if (newMonths < 0) {
    newYears -= 1;
    newMonths += 12;
  }
  
  // Ensure we don't go below zero
  newYears = Math.max(0, newYears);
  newMonths = Math.max(0, newMonths);
  newWeeks = Math.max(0, newWeeks);
  newDays = Math.max(0, newDays);
  
  // Check if timer has reached zero
  if (newYears === 0 && newMonths === 0 && newWeeks === 0 && newDays === 0) {
    console.log('⏰ Countdown timer has reached zero!');
  }
  
  return {
    years: newYears,
    months: newMonths,
    weeks: newWeeks,
    days: newDays
  };
}

/**
 * Save the countdown timer and last update time to local storage
 * @param timer The countdown timer to save
 */
export function saveCountdownTimer(timer: CountdownTimer): void {
  const now = Date.now();
  localStorage.setItem('countdownTimer', JSON.stringify(timer));
  localStorage.setItem('lastTimerUpdate', now.toString());
}

/**
 * Load the countdown timer and last update time from local storage
 * @returns The saved countdown timer and last update time, or null if not found
 */
export function loadCountdownTimer(): { timer: CountdownTimer; lastUpdate: number } | null {
  const timerStr = localStorage.getItem('countdownTimer');
  const lastUpdateStr = localStorage.getItem('lastTimerUpdate');
  
  if (!timerStr || !lastUpdateStr) {
    return null;
  }
  
  try {
    const timer = JSON.parse(timerStr) as CountdownTimer;
    const lastUpdate = parseInt(lastUpdateStr, 10);
    return { timer, lastUpdate };
  } catch (error) {
    console.error('Error parsing saved countdown timer:', error);
    return null;
  }
}
