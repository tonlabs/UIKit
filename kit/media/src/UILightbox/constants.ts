const DUPLICATE_STATE_INITIAL = 0;
const DUPLICATE_STATE_MEASUREMENT = 1;
const DUPLICATE_STATE_OPENED = 2;
const DUPLICATE_STATE_CLOSED = 3;
export type DuplicateState =
    | typeof DUPLICATE_STATE_INITIAL
    | typeof DUPLICATE_STATE_MEASUREMENT
    | typeof DUPLICATE_STATE_OPENED
    | typeof DUPLICATE_STATE_CLOSED;

const VISIBILITY_STATE_CLOSED = 0;
const VISIBILITY_STATE_OPENED = 1;
export type VisibilityState = typeof VISIBILITY_STATE_CLOSED | typeof VISIBILITY_STATE_OPENED;

export enum MediaMessageError {
    DataIsEmpty,
    NotSupportedDataFormat,
    InvalidData,
}
