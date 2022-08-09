import * as React from 'react';
import Animated, { useAnimatedRef, useDerivedValue } from 'react-native-reanimated';
import { NativeModules } from 'react-native';
import type { UIAmountInputEnhancedRef, UIAmountInputEnhancedProps } from './types';
import { AmountInputContext } from './constants';
import { useAmountInputHandlers, useAmountInputHover, useConnectOnChangeAmount } from './hooks';
import { UITextView, UITextViewRef } from '../UITextView';
import { TapHandler } from './TapHandler';
import { InputMessage } from '../InputMessage';

const UITextViewAnimated = Animated.createAnimatedComponent(UITextView);

NativeModules.UIKitInputModule?.install();

export const UIAmountInputEnhancedContent = React.forwardRef<
    UIAmountInputEnhancedRef,
    UIAmountInputEnhancedProps
>(function UIAmountInputEnhancedContent(
    { children: _children, ...props }: UIAmountInputEnhancedProps,
    _forwardedRef: React.Ref<UIAmountInputEnhancedRef>,
) {
    const {
        editable,
        onFocus,
        onBlur,
        onHover,
        onSelectionChange,
        onChangeAmount: onChangeAmountProp,
        precision,
        multiline,
        message,
        messageType,
    } = props;
    // @ts-ignore
    const ref = useAnimatedRef<UITextViewRef>();

    const { isFocused, formattedText, isHovered, selectionEndPosition, normalizedText } =
        React.useContext(AmountInputContext);

    /**
     * TODO Remove
     */
    useDerivedValue(() => {
        console.log({
            isHovered: isHovered.value,
            isFocused: isFocused.value,
            selectionEndPosition: selectionEndPosition.value,
            normalizedText: normalizedText.value,
            formattedText: formattedText.value,
        });
    });

    const textViewHandlers = useAmountInputHandlers(
        ref,
        editable,
        onFocus,
        onBlur,
        onSelectionChange,
        precision,
        multiline,
    );

    useConnectOnChangeAmount(onChangeAmountProp);
    const { onMouseEnter, onMouseLeave } = useAmountInputHover(onHover);

    return (
        <InputMessage type={messageType} text={message}>
            <TapHandler inputRef={ref}>
                <Animated.View
                    // @ts-expect-error
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    <UITextViewAnimated {...props} {...textViewHandlers} ref={ref} />
                </Animated.View>
            </TapHandler>
        </InputMessage>
    );
});