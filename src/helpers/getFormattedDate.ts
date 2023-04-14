export const getFormattedDate = (date: Date) => {
  const day = date.getUTCDate();
  const fullYear = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const hour = date.getHours();
  const minute = date.getMinutes();

  const dayFormatted = day.toString().length === 1 ? `0${day}` : day
  const monthFormatted = month.toString().length === 1 ? `0${month}` : month
  const minuteFormatted = minute.toString().length === 1 ? `0${minute}` : minute

  return {
    hour: `${hour}:${minuteFormatted}`,
    date: `${dayFormatted}/${monthFormatted}/${fullYear}`
  }
}