export function validateContactForm(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request data');
  }

  const { email, subject, message, timestamp } = data;

  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      errors.push('Invalid email address');
    }
    if (trimmedEmail.length > 254) {
      errors.push('Email is too long');
    }
  }

  if (!subject || typeof subject !== 'string') {
    errors.push('Subject is required');
  } else {
    const trimmedSubject = subject.trim();
    if (trimmedSubject.length < 3) {
      errors.push('Subject must be at least 3 characters');
    }
    if (trimmedSubject.length > 200) {
      errors.push('Subject must be less than 200 characters');
    }
  }

  if (!message || typeof message !== 'string') {
    errors.push('Message is required');
  } else {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 10) {
      errors.push('Message must be at least 10 characters');
    }
    if (trimmedMessage.length > 5000) {
      errors.push('Message must be less than 5000 characters');
    }
  }

  if (!timestamp || typeof timestamp !== 'number') {
    errors.push('Invalid timestamp');
  } else {
    const now = Date.now();
    const timeDiff = now - timestamp;
    if (timeDiff < 0 || timeDiff > 5 * 60 * 1000) {
      errors.push('Request expired or invalid timestamp');
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  return {
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim()
  };
}

export function detectSpam(subject, message) {
  const combinedText = (subject + ' ' + message).toLowerCase();

  const spamKeywords = [
    'viagra', 'cialis', 'lottery', 'winner', 'claim your prize',
    'click here', 'buy now', 'limited time', 'act now',
    'make money fast', 'work from home', 'free money',
    'nigerian prince', 'inheritance', 'bitcoin investment'
  ];

  for (const keyword of spamKeywords) {
    if (combinedText.includes(keyword)) {
      return true;
    }
  }

  const urlCount = (combinedText.match(/https?:\/\//gi) || []).length;
  if (urlCount > 2) {
    return true;
  }

  if (/https?:\/\/.*\.(ru|cn|tk|ml|ga|cf|gq)/i.test(combinedText)) {
    return true;
  }

  const numberMatches = combinedText.match(/\d+/g) || [];
  const totalDigits = numberMatches.join('').length;
  if (totalDigits > 20) {
    return true;
  }

  const capsCount = (combinedText.match(/[A-Z]/g) || []).length;
  const totalChars = combinedText.replace(/\s/g, '').length;
  if (totalChars > 0 && capsCount / totalChars > 0.5) {
    return true;
  }

  return false;
}

export function sanitizeForEmail(text) {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
