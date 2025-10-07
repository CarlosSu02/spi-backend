export const dateToHHMM = (date: Date): string => {
  const d = new Date(date);

  return (
    d.getUTCHours().toString().padStart(2, '0') +
    ':' +
    d.getUTCMinutes().toString().padStart(2, '0')
  );
};
