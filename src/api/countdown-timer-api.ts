// API client for countdown timer
// This file provides a client-side API for fetching the countdown timer data

import { supabase } from '../lib/supabase';

/**
 * Interface for countdown timer data
 */
export interface CountdownTimer {
  years: number;
  months: number;
  weeks: number;
  days: number;
}

/**
 * Default countdown timer values
 */
export const DEFAULT_COUNTDOWN_TIMER: CountdownTimer = {
  years: 8,
  months: 3,
  weeks: 0,
  days: 27
};

/**
 * Fetch countdown timer data for a user
 * @param userId The user ID to fetch data for
 * @returns The countdown timer data
 */
export async function fetchCountdownTimer(userId: string): Promise<CountdownTimer> {
  try {
    console.log('🔄 Fetching countdown timer for user:', userId);
    
    // Query the user's quiz results to get their countdown timer
    const { data, error } = await supabase
      .from('user_quiz_results')
      .select('countdown_timer')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('❌ Error fetching countdown timer:', error);
      return DEFAULT_COUNTDOWN_TIMER;
    }
    
    // If no data found, return default values
    if (!data || !data.countdown_timer) {
      console.log('ℹ️ No countdown timer found for user, using default values');
      return DEFAULT_COUNTDOWN_TIMER;
    }
    
    console.log('✅ Countdown timer fetched successfully:', data.countdown_timer);
    
    // Parse the countdown timer data
    const timer: CountdownTimer = {
      years: data.countdown_timer.years || DEFAULT_COUNTDOWN_TIMER.years,
      months: data.countdown_timer.months || DEFAULT_COUNTDOWN_TIMER.months,
      weeks: data.countdown_timer.weeks || DEFAULT_COUNTDOWN_TIMER.weeks,
      days: data.countdown_timer.days || DEFAULT_COUNTDOWN_TIMER.days
    };
    
    return timer;
  } catch (error) {
    console.error('❌ Error in fetchCountdownTimer:', error);
    return DEFAULT_COUNTDOWN_TIMER;
  }
}
