import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { Pressable } from '@tonlabs/uikit.controls';
import { UIImage } from '@tonlabs/uikit.media';
import { UILayoutConstant } from '@tonlabs/uikit.layout';

import type { InputActionProps } from '../types';
import { StringPressableChild } from './StringPressableChild';
import { ImagePressableChild } from './ImagePressableChild';
import { InputColorScheme, InputFont } from '../../constants';
import { useInputChildrenLabelRole } from '../useInputChildrenLabelRole';

function useProcessedChildren(
    children: InputActionProps['children'],
    colorScheme: InputColorScheme,
    font: InputFont | undefined,
) {
    const labelRole = useInputChildrenLabelRole(font);
    return React.useMemo(() => {
        const length = React.Children.count(children);
        return React.Children.map(children, (child: React.ReactNode, index: number) => {
            const isLast = index === length - 1;
            const marginRight = !isLast ? UILayoutConstant.tinyContentOffset : 0;

            if (typeof child === 'string') {
                return (
                    <StringPressableChild
                        colorScheme={colorScheme}
                        style={{ marginRight }}
                        role={labelRole}
                    >
                        {child}
                    </StringPressableChild>
                );
            }
            if (React.isValidElement(child) && child.type === UIImage) {
                return (
                    <ImagePressableChild
                        {...child.props}
                        colorScheme={colorScheme}
                        style={{
                            ...styles.imageChild,
                            ...{ marginRight },
                            ...StyleSheet.flatten(child.props.style),
                        }}
                    />
                );
            }
            return null;
        });
    }, [children, colorScheme, labelRole]);
}

export function InputAction({
    children,
    onPress,
    colorScheme = InputColorScheme.Default,
    disabled = false,
    font,
}: InputActionProps) {
    const processedChildren = useProcessedChildren(children, colorScheme, font);

    return (
        <Pressable onPress={onPress} style={styles.container} disabled={disabled}>
            <Animated.View style={styles.actionContainer}>{processedChildren}</Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        ...Platform.select({
            web: {
                userSelect: 'none',
            },
            default: {},
        }),
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
    imageChild: {
        height: UILayoutConstant.iconSize,
        width: UILayoutConstant.iconSize,
    },
});
