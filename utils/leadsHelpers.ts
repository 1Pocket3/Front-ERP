import type { StatusColor } from '@/types/leads';

/**
 * Форматирует дату в формат YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

/**
 * Маскирует номер телефона для менеджеров (показывает только последние 4 цифры)
 */
export const maskPhoneNumber = (phoneNumber: string, isAdmin: boolean): string => {
  if (!phoneNumber) return phoneNumber;
  
  // Если пользователь админ, показываем полный номер
  if (isAdmin) {
    return phoneNumber;
  }
  
  // Для менеджеров показываем только последние 4 цифры
  const digits = phoneNumber.replace(/[^\d]/g, '');
  if (digits.length <= 4) {
    return phoneNumber; // Если номер короткий, показываем как есть
  }
  
  const lastFour = digits.slice(-4);
  const masked = '*'.repeat(digits.length - 4) + lastFour;
  
  // Сохраняем оригинальный формат (пробелы, скобки, дефисы)
  let result = phoneNumber;
  for (let i = 0; i < digits.length - 4; i++) {
    result = result.replace(/\d/, '*');
  }
  
  return result;
};

/**
 * Получает отображаемое имя пользователя
 */
export const getUserDisplayName = (user: any): string => {
  if (!user) return '';
  return `${user.first_name} ${user.last_name}`.trim() || user.username;
};

/**
 * Возвращает цвет для статуса лида
 */
export const getStatusColor = (status: string): StatusColor => {
  switch (status) {
    case 'New':
      return 'default';
    case 'Ftd':
      return 'success';
    case 'Ftd Na':
      return 'info';
    case 'No answer':
      return 'warning';
    case 'Call again':
      return 'primary';
    case 'Money Call':
      return 'info';
    case 'Awaiting Deposit':
      return 'warning';
    case 'Kachin Kachin':
      return 'success';
    case 'Not interested':
      return 'error';
    case 'Reassign':
      return 'secondary';
    case 'Risk':
      return 'error';
    case 'Number not in service':
      return 'warning';
    case 'Different Person':
      return 'info';
    case 'Wrong number':
      return 'warning';
    case 'No Language':
      return 'info';
    default:
      return 'secondary';
  }
};

/**
 * Получает иконку для статуса
 */
export const getStatusIcon = (color: StatusColor): string => {
  switch (color) {
    case 'success':
      return 'mdi-check';
    case 'error':
      return 'mdi-close';
    case 'warning':
      return 'mdi-alert';
    case 'info':
      return 'mdi-information';
    case 'primary':
      return 'mdi-star';
    default:
      return 'mdi-circle-outline';
  }
};

/**
 * Генерирует имя файла для экспорта
 */
export const generateExportFilename = (
  format: 'csv' | 'excel',
  statusFilter: string[],
  campaignFilter: string[]
): string => {
  const today = new Date().toISOString().split('T')[0];
  const statusPart = statusFilter.length ? statusFilter.join(',') : 'all';
  const campaignPart = campaignFilter.length ? campaignFilter.join(',') : 'all';
  const extension = format === 'excel' ? 'xlsx' : 'csv';
  
  return `leads_export_${today}_${statusPart}_${campaignPart}.${extension}`;
};

