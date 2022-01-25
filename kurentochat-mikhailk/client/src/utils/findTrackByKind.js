//функция примет массив треков и вернет один трек

export function findTrackIndexByKind(tracks, kind) {
    if (tracks.length) {
        for (let i = 0; i < tracks.length; i++) {
            if(tracks[i].kind === kind) {
                return i
            }
        }
            
    }
}