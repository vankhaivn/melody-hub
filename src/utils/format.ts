export function formatView(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export function formatTrackName({
    trackName,
    characters,
}: {
    trackName: string
    characters: number
}): string {
    if (trackName.length > characters) {
        return `${trackName.slice(0, characters)}...`
    }
    return trackName
}
