import * as React from 'react';
import {
    runOnJS,
    runOnUI,
    useAnimatedRef,
    useSharedValue,
    useWorkletCallback,
} from 'react-native-reanimated';
import { Platform } from 'react-native';
import type { UIAmountInputEnhancedProps } from '../types';
import { useTextViewHandler } from '../../useTextViewHandler';
import { AmountInputContext, UIConstants } from '../constants';
import { useAmountMaskApplyer } from './amountMask';
import { setTextAndCaretPosition } from '../setTextAndCaretPosition';
import type { UITextViewRef } from '../../UITextView';
import { useDerivedReactValue } from './hooks';

export function useAmountInputHandlers(
    ref: React.RefObject<UITextViewRef>,
    editableProp: UIAmountInputEnhancedProps['editable'],
    onFocusProp: UIAmountInputEnhancedProps['onFocus'],
    onBlurProp: UIAmountInputEnhancedProps['onBlur'],
    onSelectionChangeProp: UIAmountInputEnhancedProps['onSelectionChange'],
    precision: UIAmountInputEnhancedProps['precision'],
    multiline: UIAmountInputEnhancedProps['multiline'],
    defaultAmount: UIAmountInputEnhancedProps['defaultAmount'],
) {
    const { isFocused, formattedText, selectionEndPosition, normalizedText } =
        React.useContext(AmountInputContext);

    const prevCaretPosition = useSharedValue(selectionEndPosition.value);

    const platformOS = useDerivedReactValue(Platform.OS);
    const editableAnimated = useDerivedReactValue(editableProp);
    const multilineAnimated = useDerivedReactValue(multiline);

    const numberOfDecimalDigits = React.useMemo(() => {
        switch (precision) {
            case 'Integer':
                return UIConstants.decimalAspect.integer;
            case 'Currency':
                return UIConstants.decimalAspect.currency;
            case 'Precise':
            default:
                return UIConstants.decimalAspect.precision;
        }
    }, [precision]);

    const applyAmountMask = useAmountMaskApplyer(numberOfDecimalDigits);

    // @ts-expect-error
    const inputManagerRef = useAnimatedRef<InputController | undefined>();

    const setTest = useWorkletCallback((text: string): void => {
        'worklet';

        const {
            formattedText: newFormattedText,
            carretPosition: newCaretPosition,
            normalizedText: newNormalizedText,
        } = applyAmountMask(
            text,
            platformOS.value === 'ios' && multilineAnimated.value
                ? prevCaretPosition
                : selectionEndPosition,
        );

        if (text !== newFormattedText) {
            setTextAndCaretPosition(ref, inputManagerRef, newFormattedText, newCaretPosition);
        }

        formattedText.value = newFormattedText;
        selectionEndPosition.value = newCaretPosition;
        normalizedText.value = newNormalizedText;
    });

    const defaultAmountRef = React.useRef(defaultAmount);
    React.useEffect(() => {
        runOnUI(setTest)(defaultAmountRef.current?.toString() ?? '');
    }, [setTest]);

    const textViewHandlers = useTextViewHandler(
        {
            onFocus: evt => {
                'worklet';

                /**
                 * Input still fire focus/blur events on web, even thought input isn't editable.
                 */
                if (editableAnimated.value === false) {
                    return;
                }

                isFocused.value = true;

                if (onFocusProp != null) {
                    runOnJS(onFocusProp)({ nativeEvent: evt } as any);
                }
            },
            onBlur: evt => {
                'worklet';

                /**
                 * Input still fire focus/blur events on web, even thought input isn't editable.
                 */
                if (editableAnimated.value === false) {
                    return;
                }

                isFocused.value = false;

                if (onBlurProp != null) {
                    runOnJS(onBlurProp)({ nativeEvent: evt } as any);
                }
            },
            onChange: evt => {
                'worklet';

                setTest(evt.text);
            },
            onSelectionChange: evt => {
                'worklet';

                if (onSelectionChangeProp != null) {
                    runOnJS(onSelectionChangeProp)({ nativeEvent: evt } as any);
                }

                prevCaretPosition.value = selectionEndPosition.value;
                selectionEndPosition.value = evt.selection.end;
            },
        },
        [onFocusProp, onBlurProp, onSelectionChangeProp, setTest],
    );

    return textViewHandlers;
}
