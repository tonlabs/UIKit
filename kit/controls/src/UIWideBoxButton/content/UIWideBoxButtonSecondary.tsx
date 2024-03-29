import * as React from 'react';
import { Platform, StyleSheet, ImageStyle } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import { ColorVariants, UILabelAnimated } from '@tonlabs/uikit.themes';
import { UIAnimatedImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import type { UIWideBoxButtonProps } from '../types';
import { usePressableAnimatedImageTintColorProps, usePressableContentColor } from '../../Pressable';
import { contentColors } from '../constants';
import { UIIndicator } from '../../UIIndicator';

function RightContent({
    icon,
    loading,
    contentColor,
}: Pick<UIWideBoxButtonProps, 'icon' | 'loading'> & {
    contentColor: Readonly<Animated.SharedValue<string>>;
}) {
    const animatedImageProps = usePressableAnimatedImageTintColorProps(contentColor);

    if (loading) {
        return <UIIndicator color={ColorVariants.TextOverlay} size={UILayoutConstant.iconSize} />;
    }
    if (icon) {
        return (
            <UIAnimatedImage
                source={icon}
                style={styles.image as ImageStyle}
                {...animatedImageProps}
            />
        );
    }
    return null;
}

export function UIWideBoxButtonSecondary({ title, icon, loading }: UIWideBoxButtonProps) {
    const contentColor = usePressableContentColor(contentColors.secondary);

    const animatedLabelProps = useAnimatedProps(() => {
        return {
            color: contentColor.value,
        };
    });

    const animatedStyles = useAnimatedStyle(() => {
        return {
            borderColor: contentColor.value,
        };
    });

    return (
        <Animated.View style={[styles.container, animatedStyles]}>
            <UILabelAnimated animatedProps={animatedLabelProps}>{title}</UILabelAnimated>
            <RightContent icon={icon} loading={loading} contentColor={contentColor} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingHorizontal: UILayoutConstant.contentOffset,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: UILayoutConstant.alertBorderRadius,
        borderWidth: 1,
        ...Platform.select({
            web: {
                userSelect: 'none',
            },
            default: null,
        }),
    },
    image: {
        marginLeft: UILayoutConstant.normalContentOffset,
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
});
