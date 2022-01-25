import { DEVICE_ERRORS_DENIED } from "../const/DEVICE_ERRORS";

const VIDEO_QUALITY = 720;
const VIDEO_ASPECT_RATIO = 16 / 9;

export const getUserMedia = async (constraints) => {
    const copy = [...constraints];

    try {
        const constraint = copy.shift();
        return await navigator.mediaDevices.getUserMedia(constraint); // вспл. диалог запрашивает разрешение на запись, возвращает поток, состоящий из tracks 
    } catch (err) {
        console.log('getUserMedia error: ;', err);
        if (DEVICE_ERRORS_DENIED.includes(err.name) || !copy.length) {
            throw err;
        } else {

            return getUserMedia(copy);
        }
    }
}

export const getConstraints = () => {  // мы делаем это для поддержки большего количества браузеров 
    const height = VIDEO_QUALITY;           // (заводим массив constraints'ов и в случае проблемы берем другого его представителя)
    const aspectRatio = VIDEO_ASPECT_RATIO;

    return [
        {
            video: {
                aspectRatio,
                height,
            },
            audio: true,
        },
        {
            video: {
                aspectRatio,
                height: { max: height },
            },
            audio: true,
        },
        {
            video: {
                aspectRatio,
            },
            audio: true,
        },
        {
            video: true,
            audio: true,
        },
    ];
}