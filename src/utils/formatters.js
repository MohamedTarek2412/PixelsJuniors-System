export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatSalary = (amount) => {
  return new Intl.NumberFormat('ar-EG').format(amount);
};

export const formatPhone = (phone) => {
  // Format Egyptian phone numbers
  if (phone.length === 11 && phone.startsWith('01')) {
    return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
  }
  return phone;
};