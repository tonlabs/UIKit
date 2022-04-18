import * as React from 'react';
import { PressableStateVariant } from '../constants';

export function usePressableState(
    disabled: boolean | undefined,
    loading: boolean | undefined,
    isPressed: boolean,
    isHovered: boolean,
) {
    return React.useMemo<PressableStateVariant>(() => {
        if (loading) {
            return PressableStateVariant.Loading;
        }
        if (disabled) {
            return PressableStateVariant.Disabled;
        }
        if (isPressed) {
            return PressableStateVariant.Pressed;
        }
        if (isHovered) {
            return PressableStateVariant.Hovered;
        }
        return PressableStateVariant.Initial;
    }, [disabled, loading, isPressed, isHovered]);
}