import * as React from 'react';
import {
    runOnJS,
    SharedValue,
    useAnimatedReaction,
    useSharedValue,
    withSpring,
    WithSpringConfig,
} from 'react-native-reanimated';

// @inline
const POSITION_FOLDED: number = 0;
// @inline
const POSITION_EXPANDED: number = 1;

const withSpringConfig: WithSpringConfig = {
    stiffness: 150,
    overshootClamping: true,
};

function getPosition(isExpanded: boolean): number {
    'worklet';

    return isExpanded ? POSITION_EXPANDED : POSITION_FOLDED;
}

/**
 * Returns animated label expanding position.
 * It can be in the range from POSITION_FOLDED to POSITION_EXPANDED
 */
export function useExpandingValue(
    isExpanded: SharedValue<boolean>,
    showPlacehoder: () => void,
): Readonly<SharedValue<number>> {
    /**
     * Label position switcher:
     * `POSITION_FOLDED` or
     * `POSITION_EXPANDED`
     */
    const position = useSharedValue(getPosition(isExpanded.value));

    const onExpand = React.useCallback(
        (isFinished?: boolean): void => {
            'worklet';

            if (isFinished) {
                runOnJS(showPlacehoder)();
            }
        },
        [showPlacehoder],
    );

    useAnimatedReaction(
        () => getPosition(isExpanded.value),
        (expandingPosition, prevExpandingPosition) => {
            /**
             * We don't need to run animation if expandingPosition is already in correct state.
             * It leads to unwanted calling of `onExpand` callback.
             */
            if (prevExpandingPosition === expandingPosition) {
                return;
            }

            const callback = prevExpandingPosition === POSITION_FOLDED ? onExpand : undefined;
            position.value = withSpring(expandingPosition, withSpringConfig, callback);
        },
    );

    return position;
}
