/**
 * Provides default profile pictures based on gender
 * These are high-quality, modern, and cool default avatars for users
 */

// Default profile pictures for different genders
const DEFAULT_PICTURES = {
  // Male avatars - modern, tech-themed, cool
  male: [
    "https://i.imgur.com/7Bj0ACh.png", // Modern male developer with glasses
    "https://i.imgur.com/jgZoFvE.png", // Male developer with headphones
    "https://i.imgur.com/3QKkEDu.png", // Male tech enthusiast with laptop
    "https://i.imgur.com/YWtJTmx.png", // Male coder with dark background
    "https://i.imgur.com/Q9MSTQv.png", // Male developer with code background
  ],
  
  // Female avatars - modern, tech-themed, cool
  female: [
    "https://i.imgur.com/8zLTEPl.png", // Female developer with glasses
    "https://i.imgur.com/y0oPLIk.png", // Female coder with laptop
    "https://i.imgur.com/mE0tAqA.png", // Female tech enthusiast with headphones
    "https://i.imgur.com/JMZj1jL.png", // Female developer with code background
    "https://i.imgur.com/7Xj6lKg.png", // Female programmer with dark background
  ],
  
  // Gender-neutral avatars for "other" gender
  other: [
    "https://i.imgur.com/Q4VRrI2.png", // Tech-themed abstract avatar
    "https://i.imgur.com/pUjR9Ph.png", // Code-themed abstract avatar
    "https://i.imgur.com/KXZRJj4.png", // Modern abstract tech avatar
    "https://i.imgur.com/6YQ1Zzt.png", // Geometric tech-themed avatar
    "https://i.imgur.com/L7nGCIO.png", // Digital abstract avatar
  ],
};

/**
 * Get a random default profile picture based on gender
 * @param {string} gender - The user's gender (male, female, or other)
 * @returns {string} URL of a default profile picture
 */
export const getDefaultProfilePicture = (gender) => {
  // Normalize gender to lowercase and ensure it's one of our categories
  const normalizedGender = gender?.toLowerCase() || 'other';
  const validGender = ['male', 'female', 'other'].includes(normalizedGender) 
    ? normalizedGender 
    : 'other';
  
  // Get the array of pictures for this gender
  const pictures = DEFAULT_PICTURES[validGender];
  
  // Return a random picture from the array
  return pictures[Math.floor(Math.random() * pictures.length)];
};

/**
 * Get a specific default profile picture based on gender and index
 * Useful when you want a consistent picture rather than random
 * @param {string} gender - The user's gender (male, female, or other)
 * @param {number} index - The index of the picture to get (0-4)
 * @returns {string} URL of a default profile picture
 */
export const getSpecificDefaultProfilePicture = (gender, index = 0) => {
  // Normalize gender to lowercase and ensure it's one of our categories
  const normalizedGender = gender?.toLowerCase() || 'other';
  const validGender = ['male', 'female', 'other'].includes(normalizedGender) 
    ? normalizedGender 
    : 'other';
  
  // Get the array of pictures for this gender
  const pictures = DEFAULT_PICTURES[validGender];
  
  // Ensure index is within bounds
  const safeIndex = Math.max(0, Math.min(index, pictures.length - 1));
  
  // Return the specific picture
  return pictures[safeIndex];
};

export default getDefaultProfilePicture;
