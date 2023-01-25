function padWithZeroes(originalNumber: number) {
  return String(originalNumber).padStart(2, "0");
}

// return padded date in format: hh:mm:ss dd.mm.yyyy
export function padDate(date: Date) {
  const hours = padWithZeroes(date.getHours());
  const minutes = padWithZeroes(date.getMinutes());
  const seconds = padWithZeroes(date.getSeconds());

  const dayOfMonth = padWithZeroes(date.getDate());
  const month = padWithZeroes(date.getMonth() + 1);
  const year = date.getFullYear();

  return { hours, minutes, seconds, dayOfMonth, month, year };
}
