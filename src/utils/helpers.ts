export const formatTime = (seconds: number): string => {
 const minutes = Math.floor(seconds / 60);
 const remainderSeconds = seconds % 60;
 return `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
};
