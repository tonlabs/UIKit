import * as React from 'react';
import { ColorValue, Platform, TextStyle, View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { makeStyles } from '@tonlabs/uikit.themes';
import Animated from 'react-native-reanimated';
import { UITextView, UITextViewRef } from '../UITextView';

import type { MaterialTextViewLayoutProps } from './types';
import { MaterialTextViewComment } from './MaterialTextViewComment';
import { InputColorScheme, useInputBackgroundColor } from '../Common';
import { usePlaceholderColors } from './hooks';

const UITextViewAnimated = Animated.createAnimatedComponent(UITextView);

export const MaterialTextViewSimple = React.forwardRef<UITextViewRef, MaterialTextViewLayoutProps>(
    function MaterialTextViewSimpleForwarded(props: MaterialTextViewLayoutProps, passedRef) {
        const {
            children,
            onMouseEnter,
            onMouseLeave,
            borderViewRef,
            isHovered,
            colorScheme = InputColorScheme.Default,
            ...rest
        } = props;
        const { editable = true } = rest;

        const hasChildren = React.useMemo(() => {
            return React.Children.count(children) > 0;
        }, [children]);

        const placeholderColors = usePlaceholderColors(colorScheme);
        const placeholderTextColor = React.useMemo(() => {
            return isHovered && editable ? placeholderColors.hover : placeholderColors.default;
        }, [isHovered, editable, placeholderColors]);

        const backgroundColor = useInputBackgroundColor(colorScheme, editable);
        const styles = useStyles(editable, backgroundColor, hasChildren);

        return (
            <MaterialTextViewComment {...props}>
                <View
                    style={styles.container}
                    // @ts-expect-error
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    ref={borderViewRef}
                >
                    <Animated.View style={styles.inputContainer} /* layout={Layout} */>
                        <UITextViewAnimated
                            ref={passedRef}
                            {...rest}
                            placeholder={props.placeholder}
                            placeholderTextColor={placeholderTextColor}
                            style={styles.input}
                        />
                    </Animated.View>
                    {children}
                </View>
            </MaterialTextViewComment>
        );
    },
);

const useStyles = makeStyles((editable: boolean, backgroundColor: ColorValue, hasChildren) => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: UILayoutConstant.input.borderRadius,
        backgroundColor,
        paddingLeft: UILayoutConstant.contentOffset,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: UILayoutConstant.contentInsetVerticalX4,
        paddingRight: hasChildren
            ? UILayoutConstant.smallContentOffset
            : UILayoutConstant.contentOffset,
    },
    input: {
        ...Platform.select({
            web: {
                ...(!editable ? ({ cursor: 'default' } as TextStyle) : null),
            },
        }),
    },
}));
