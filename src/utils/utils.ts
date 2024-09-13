export function formatDuration(durationMs: number) {
    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);

    const hoursFormat = hours < 10 ? `0${hours}` : hours;
    const minutesFormat = minutes < 10 ? `0${minutes}` : minutes;
    const secondsFormat = seconds < 10 ? `0${seconds}` : seconds;

    // Adjusting the format based on whether there are any hours
    return hours > 0 
        ? `${hoursFormat}:${minutesFormat}:${secondsFormat}` 
        : `${minutesFormat}:${secondsFormat}`;
}

export const pitchClassToKey = (pitchClass: number): string => {
    const pitchClasses = [
      'C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F',
      'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'
    ];
    
    if (pitchClass >= 0 && pitchClass <= 11) {
      return pitchClasses[pitchClass];
    } else {
      return 'Unknown';
    }
};

export const generateLandingGradient = (): string => {
  const colors = ['white', 'silver', '#1d4ed8']; // blue-700
  const stops = Math.floor(Math.random() * 3) + 2; // 2 to 4 stops
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  const angle = angles[Math.floor(Math.random() * angles.length)];

  let gradient = `linear-gradient(${angle}deg,`;

  for (let i = 0; i < stops; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const position = i === 0 ? 0 : i === stops - 1 ? 100 : Math.floor(Math.random() * 100);
    gradient += `${color} ${position}%${i < stops - 1 ? ',' : ')'}`;
  }

  return gradient;
};
