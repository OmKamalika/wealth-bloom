/**
 * Utilities for managing anonymous sessions
 */

/**
 * Generate a unique session ID
 * @returns A unique UUID v4 string
 */
export function generateSessionId(): string {
  // Simple UUID v4 implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Get the current anonymous session ID from localStorage
 * Creates a new one if none exists
 * @returns The session ID
 */
export function getAnonymousSessionId(): string {
  let sessionId = localStorage.getItem('anonymous_session_id');
  
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('anonymous_session_id', sessionId);
  }
  
  return sessionId;
}

/**
 * Clear the anonymous session ID from localStorage
 * Typically called after a user signs in and their data is associated
 */
export function clearAnonymousSessionId(): void {
  localStorage.removeItem('anonymous_session_id');
}