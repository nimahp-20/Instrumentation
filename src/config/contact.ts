/**
 * Contact Configuration
 * 
 * Update these values with your actual contact information
 */

export const contactConfig = {
  // WhatsApp Business Number
  // Format: Country code + number (without + or spaces)
  // Example: '989123456789' for Iran
  whatsapp: '989395384787',
  
  // Alternative contact methods
  phone: '+98 939538478',
  email: 'info@example.com',
  
  // Social media
  telegram: 'https://t.me/yourcompany',
  instagram: 'https://instagram.com/yourcompany',
  
  // Business hours
  businessHours: {
    fa: 'شنبه تا چهارشنبه: ۹ صبح تا ۶ عصر',
    en: 'Sat-Wed: 9 AM - 6 PM'
  }
};

/**
 * Helper function to format WhatsApp URL
 */
export const getWhatsAppUrl = (message: string, phoneNumber?: string) => {
  const number = phoneNumber || contactConfig.whatsapp;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

/**
 * Helper function to get general WhatsApp share URL (without specific number)
 */
export const getWhatsAppShareUrl = (message: string) => {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
};
