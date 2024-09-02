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

