/* eslint-disable no-param-reassign */
import * as React from 'react';
import { StyleProp, ViewStyle, StyleSheet, processColor } from 'react-native';
import {
    GestureEvent,
    NativeViewGestureHandlerPayload,
    NativeViewGestureHandlerProps,
    RawButton as GHRawButton,
    RawButtonProps,
} from 'react-native-gesture-handler';
import Animated, {
    interpolate,
    interpolateColor,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

import { hapticSelection } from '@tonlabs/uikit.controls';
import { UIImage } from '@tonlabs/uikit.media';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
    useColorParts,
} from '@tonlabs/uikit.themes';
import { UIAssets } from '@tonlabs/uikit.assets';

import { DotsContext } from './DotsContext';
import { DOT_WITH_SPRING_CONFIG, KEY_HEIGHT, KEY_WIDTH, UIPinCodeBiometryType } from './constants';

// @inline
const CIRCLE_ANIMATION_ACTIVE = 0;
// @inline
const CIRCLE_ANIMATION_NOT_ACTIVE = 1;
type CircleAnimationStatus =
    | typeof CIRCLE_ANIMATION_ACTIVE
    | typeof CIRCLE_ANIMATION_NOT_ACTIVE
    | number;

// @inline
const DOT_ANIMATION_ACTIVE = 1;
// @inline
const DOT_ANIMATION_NOT_ACTIVE = 0;

function useCircleAboveStyle(circleAnimProgress: Animated.SharedValue<CircleAnimationStatus>) {
    const { colorParts } = useColorParts(ColorVariants.BackgroundSecondary);
    const circleColorTransparent = `rgba(${colorParts},1)`;
    const circleColorOpaque = `rgba(${colorParts},0)`;

    return useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                circleAnimProgress.value,
                [CIRCLE_ANIMATION_ACTIVE, CIRCLE_ANIMATION_NOT_ACTIVE],
                [circleColorTransparent, circleColorOpaque],
            ),
            transform: [
                {
                    scale: interpolate(
                        circleAnimProgress.value,
                        [CIRCLE_ANIMATION_ACTIVE, CIRCLE_ANIMATION_NOT_ACTIVE],
                        [0.8, 1],
                    ),
                },
            ],
        };
    });
}

export const RawButton = Animated.createAnimatedComponent<
    RawButtonProps &
        NativeViewGestureHandlerProps & {
            testID?: string;
            style?: StyleProp<ViewStyle>;
        }
>(GHRawButton);

export const Key = React.memo(function Key({ num }: { num: number }) {
    const { activeDotIndex, dotsValues, dotsAnims, dotsCount, disabled } =
        React.useContext(DotsContext);

    const circleAnimProgress = useSharedValue(CIRCLE_ANIMATION_NOT_ACTIVE);

    const gestureHandler = useAnimatedGestureHandler<GestureEvent<NativeViewGestureHandlerPayload>>(
        {
            onActive: () => {
                circleAnimProgress.value = CIRCLE_ANIMATION_ACTIVE;
            },
            onFinish: () => {
                if (activeDotIndex.value > dotsCount - 1) {
                    return;
                }

                // A number was chosen
                dotsValues[activeDotIndex.value].value = num;
                dotsAnims[activeDotIndex.value].value = withSpring(
                    DOT_ANIMATION_ACTIVE,
                    DOT_WITH_SPRING_CONFIG,
                );
                activeDotIndex.value += 1;

                hapticSelection();
            },
            onCancel: () => {
                circleAnimProgress.value = withSpring(CIRCLE_ANIMATION_NOT_ACTIVE);
            },
            onEnd: () => {
                circleAnimProgress.value = withSpring(CIRCLE_ANIMATION_NOT_ACTIVE);
            },
        },
    );

    const circleAboveButtonStyle = useCircleAboveStyle(circleAnimProgress);

    return (
        <RawButton
            testID={`pincode_digit_${num}`}
            enabled={!disabled}
            onGestureEvent={gestureHandler}
            style={[styles.button, disabled ? styles.disabledKey : null]}
            rippleColor={processColor('transparent')}
        >
            <Animated.View style={[styles.circleAbove, circleAboveButtonStyle]} />
            <UILabel color={UILabelColors.TextPrimary} role={UILabelRoles.LightHuge}>
                {num}
            </UILabel>
        </RawButton>
    );
});

export type GetPasscodeCb<T = void> = () => Promise<T>;

function BiometryIcon({
    usePredefined,
    biometryType,
}: {
    usePredefined: boolean;
    biometryType: UIPinCodeBiometryType;
}) {
    if (usePredefined) {
        return (
            <UILabel color={UILabelColors.TextPrimary} role={UILabelRoles.ActionFootnote}>
                DEV
            </UILabel>
        );
    }

    if (biometryType === UIPinCodeBiometryType.None) {
        return null;
    }
    return (
        <UIImage
            source={
                biometryType === UIPinCodeBiometryType.Face
                    ? UIAssets.icons.security.faceId
                    : UIAssets.icons.security.touchId
            }
            tintColor={ColorVariants.TextPrimary}
        />
    );
}

export const BiometryKey = React.memo(function BiometryKey({
    usePredefined,
    biometryType,
    onCallBiometry,
}: {
    usePredefined: boolean;
    biometryType: UIPinCodeBiometryType;
    onCallBiometry: GetPasscodeCb;
}) {
    const { disabled, dotsValues, dotsAnims, activeDotIndex } = React.useContext(DotsContext);

    const onTap = React.useCallback(() => {
        if (usePredefined) {
            dotsValues.forEach((_dot, index) => {
                dotsValues[index].value = 1;
                dotsAnims[index].value = withSpring(DOT_ANIMATION_ACTIVE, DOT_WITH_SPRING_CONFIG);
            });
            activeDotIndex.value = dotsValues.length;
            return;
        }
        onCallBiometry();
    }, [usePredefined, onCallBiometry, dotsValues, dotsAnims, activeDotIndex]);

    const circleAnimProgress = useSharedValue(CIRCLE_ANIMATION_NOT_ACTIVE);
    const gestureHandler = useAnimatedGestureHandler<GestureEvent<NativeViewGestureHandlerPayload>>(
        {
            onActive: () => {
                circleAnimProgress.value = CIRCLE_ANIMATION_ACTIVE;
            },
            onFinish: () => {
                hapticSelection();
                runOnJS(onTap)();
            },
            onCancel: () => {
                circleAnimProgress.value = withSpring(CIRCLE_ANIMATION_NOT_ACTIVE);
            },
            onEnd: () => {
                circleAnimProgress.value = withSpring(CIRCLE_ANIMATION_NOT_ACTIVE);
            },
        },
    );

    const circleAboveButtonStyle = useCircleAboveStyle(circleAnimProgress);

    return (
        <RawButton
            testID="pincode_biometry"
            enabled={!disabled}
            onGestureEvent={gestureHandler}
            style={[styles.button, disabled ? styles.disabledKey : null]}
            rippleColor={processColor('transparent')}
        >
            <Animated.View style={[styles.circleAbove, circleAboveButtonStyle]} />
            <BiometryIcon usePredefined={usePredefined} biometryType={biometryType} />
        </RawButton>
    );
});

export const DelKey = React.memo(function DelKey() {
    const { activeDotIndex, dotsValues, dotsAnims, disabled } = React.useContext(DotsContext);

    const circleAnimProgress = useSharedValue(CIRCLE_ANIMATION_NOT_ACTIVE);
    const circleAboveDelButtonStyle = useCircleAboveStyle(circleAnimProgress);
    const gestureHandlerDel = useAnimatedGestureHandler<
        GestureEvent<NativeViewGestureHandlerPayload>
    >({
        onActive: () => {
            circleAnimProgress.value = CIRCLE_ANIMATION_ACTIVE;
        },
        onFinish: () => {
            // Nothing to delete
            if (activeDotIndex.value <= 0) {
                return;
            }

            dotsValues[activeDotIndex.value - 1].value = -1;
            dotsAnims[activeDotIndex.value - 1].value = withSpring(
                DOT_ANIMATION_NOT_ACTIVE,
                DOT_WITH_SPRING_CONFIG,
            );
            activeDotIndex.value -= 1;

            hapticSelection();
        },
        onCancel: () => {
            circleAnimProgress.value = withSpring(CIRCLE_ANIMATION_NOT_ACTIVE);
        },
        onEnd: () => {
            circleAnimProgress.value = withSpring(CIRCLE_ANIMATION_NOT_ACTIVE);
        },
    });

    const delButtonStyle = useAnimatedStyle(() => {
        return {
            opacity: activeDotIndex.value > 0 ? 1 : 0.5,
        };
    });

    return (
        <RawButton
            testID="pincode_digit_delete"
            enabled={!disabled}
            onGestureEvent={gestureHandlerDel}
            style={[styles.button, delButtonStyle, disabled ? styles.disabledKey : null]}
            rippleColor={processColor('transparent')}
        >
            <Animated.View style={[styles.circleAbove, circleAboveDelButtonStyle]} />
            <UIImage source={UIAssets.icons.ui.delete} tintColor={ColorVariants.TextPrimary} />
        </RawButton>
    );
});

const styles = StyleSheet.create({
    button: {
        width: KEY_WIDTH,
        height: KEY_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    circleAbove: {
        position: 'absolute',
        left: (KEY_WIDTH - KEY_HEIGHT) / 2,
        top: 0,
        width: KEY_HEIGHT,
        height: KEY_HEIGHT,
        borderRadius: KEY_HEIGHT / 2,
        // Important for web, to not cover a number label
        zIndex: -1,
    },
    disabledKey: { opacity: 0.5 },
});
