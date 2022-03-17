import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from '@tonlabs/uikit.controls';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIImage, UIImageProps } from '@tonlabs/uikit.media';
import Animated /* , { FadeIn, FadeOut } */ from 'react-native-reanimated';
import { useClearButton } from './useClearButton';

const UIImageAnimated = Animated.createAnimatedComponent(UIImage);
const UILabelAnimated = Animated.createAnimatedComponent(UILabel);

export function UIMaterialTextViewIcon({
    onPress,
    style,
    ...rest
}: UIImageProps & {
    onPress?: () => void;
}) {
    return (
        <TouchableOpacity onPress={onPress}>
            <UIImageAnimated
                {...rest}
                style={[styles.iconSize, style]}
                // entering={FadeIn}
                // exiting={FadeOut}
            />
        </TouchableOpacity>
    );
}

export function UIMaterialTextViewAction({
    children,
    onPress,
}: {
    children: string;
    onPress?: () => void;
}) {
    return (
        <TouchableOpacity onPress={onPress}>
            <UILabelAnimated
                role={UILabelRoles.Action}
                color={UILabelColors.TextPrimary}
                // entering={FadeIn}
                // exiting={FadeOut}
            >
                {children}
            </UILabelAnimated>
        </TouchableOpacity>
    );
}

export function UIMaterialTextViewText({ children }: { children: string }) {
    return (
        <UILabelAnimated
            role={UILabelRoles.ParagraphText}
            color={UILabelColors.TextTertiary}
            // entering={FadeIn}
            // exiting={FadeOut}
        >
            {children}
        </UILabelAnimated>
    );
}

const getChilds = (children: React.ReactNode) => {
    const configs = React.Children.toArray(children).reduce<React.ReactNode[]>((acc, child) => {
        if (React.isValidElement(child)) {
            if (
                child.type === UIMaterialTextViewIcon ||
                child.type === UIMaterialTextViewAction ||
                child.type === UIMaterialTextViewText
            ) {
                acc.push(child);
                return acc;
            }

            if (child.type === React.Fragment) {
                acc.push(...getChilds(child.props.children));

                return acc;
            }
        }

        throw new Error(
            `A UIMaterialText can only contain 'UIMaterialTextView.[Icon|Action|Text]' components as its direct children (found ${
                // eslint-disable-next-line no-nested-ternary
                React.isValidElement(child)
                    ? `${typeof child.type === 'string' ? child.type : child.type?.name}`
                    : typeof child === 'object'
                    ? JSON.stringify(child)
                    : `'${String(child)}'`
            })`,
        );
    }, []);

    return configs;
};

export function useMaterialTextViewChildren(
    children: React.ReactNode,
    inputHasValue: boolean,
    isFocused: boolean,
    isHovered: boolean,
    clear: () => void,
) {
    const clearButton = useClearButton(inputHasValue, isFocused, isHovered, clear);

    if (clearButton) {
        /**
         * It's wrapped with a View
         * to stick a clear button to the bottom
         * when an input is multilined
         */
        return <View style={styles.clearButtonWrapper}>{clearButton}</View>;
    }

    const { icons, action, text } = getChilds(children).reduce<{
        icons: React.ReactNode[];
        action: React.ReactNode;
        text: React.ReactNode;
    }>(
        (acc, child) => {
            if (React.isValidElement(child)) {
                if (child.type === UIMaterialTextViewIcon) {
                    acc.icons.push(child);
                } else if (child.type === UIMaterialTextViewAction) {
                    acc.action = child;
                } else if (child.type === UIMaterialTextViewText) {
                    acc.text = child;
                }
            }

            return acc;
        },
        {
            icons: [],
            action: null,
            text: null,
        },
    );

    const hasIcons = icons.length > 0;
    const hasAction = action != null;
    const hasText = text != null;

    if (hasIcons) {
        if (hasAction || hasText) {
            throw new Error(
                `You can't pass UIMaterialTextView.Action or UIMaterialTextView.Text with icons at the same time.`,
            );
        }

        return icons
            .slice(0, 2) // Render only two icons, as required by design system
            .reduce<React.ReactNode[]>((acc, item, index) => {
                if (!React.isValidElement(item)) {
                    return acc;
                }

                if (index !== 0) {
                    acc.push(
                        React.cloneElement(item, {
                            style: [item.props?.style, styles.iconsFiller],
                        }),
                    );
                } else {
                    acc.push(item);
                }

                return acc;
            }, []);
    }

    if (hasAction) {
        if (hasText) {
            throw new Error(`You can't pass UIMaterialTextView.Text with Action at the same time.`);
        }

        return action;
    }

    return text;
}

const styles = StyleSheet.create({
    iconSize: {
        width: UILayoutConstant.iconSize,
        height: UILayoutConstant.iconSize,
    },
    iconsFiller: {
        marginLeft: UILayoutConstant.smallContentOffset,
    },
    clearButtonWrapper: {
        justifyContent: 'flex-end',
    },
});
