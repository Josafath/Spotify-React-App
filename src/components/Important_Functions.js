export function return_artists(array_artists) {
    let artists = []
    array_artists.forEach((artist) => {
        artists.push(artist["name"])
    })
    return artists.join(', ')
}

export function return_token(old_) {
    let cadena_token = old_;
    const token = []
    for (let i = 14; i < cadena_token.length; i++) {
        if (cadena_token[i] === '&') {
            break;
        }
        token.push(cadena_token[i]);
    }
    return token.join("");
}