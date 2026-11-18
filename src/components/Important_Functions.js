export function return_artists(array_artists) {
    let artists = []
    array_artists.forEach((artist) => {
        artists.push(artist["name"])
    })
    return artists.join(', ')
}

// Spotify returns images largest first; fall back to whatever exists.
export function image_url(images, preferred = 0) {
    if (!images || images.length === 0) return undefined;
    return (images[preferred] || images[0]).url;
}