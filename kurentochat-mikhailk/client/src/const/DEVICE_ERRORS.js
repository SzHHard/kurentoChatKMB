export const DEVICE_ERRORS = {
    NotAllowedError: 'NotAllowedError',
    PermissionDeniedError: 'PermissionDeniedError',
    NotReadableError: 'NotReadableError',
    TrackStartError: 'TrackStartError',
    NotFoundError: 'NotFoundError',
    DevicesNotFoundError: 'DevicesNotFoundError',
    Unknown: 'Unknown',
};

export const DEVICE_ERRORS_DENIED = [
    DEVICE_ERRORS.NotAllowedError,
    DEVICE_ERRORS.PermissionDeniedError,
];
