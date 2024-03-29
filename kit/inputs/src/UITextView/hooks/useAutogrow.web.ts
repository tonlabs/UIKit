import * as React from 'react';
import type { TextInput, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import type { UITextViewProps, AutogrowAttributes } from '../types';

function calculateWebInputHeight(elem: HTMLTextAreaElement) {
    const currentMaxHeight = elem.style.height;
    // To get real height of a textarea
    // (that is used under the hood of TextInput in rn-web)
    // eslint-disable-next-line no-param-reassign
    elem.style.maxHeight = `${0}px`;

    const height = elem.scrollHeight;

    // Remove it to apply again styles we pass in props
    // eslint-disable-next-line no-param-reassign
    elem.style.maxHeight = currentMaxHeight;

    return height;
}

function measureInputHeight(ref: React.Ref<TextInput> | null) {
    if (ref && 'current' in ref && ref.current) {
        // eslint-disable-next-line no-param-reassign
        const elem = ref.current as unknown as HTMLTextAreaElement;
        return calculateWebInputHeight(elem);
    }
    return 0;
}

function getConstrainedHeight(
    maxNumberOfLines: number | undefined,
    height: number,
    textViewLineHeight: number,
) {
    if (maxNumberOfLines) {
        return Math.min(height, textViewLineHeight * maxNumberOfLines);
    }
    return height;
}

function useMeasureAutogrowTextView(
    ref: React.RefObject<TextInput>,
    textViewLineHeight: number,
    onHeightChange: UITextViewProps['onHeightChange'],
    multiline: boolean | undefined,
    maxNumberOfLines: number | undefined,
    onNumberOfLinesChange: UITextViewProps['onNumberOfLinesChange'],
) {
    const [numberOfLines, setNumberOfLines] = React.useState<number>(1);
    const prevNumberOfLinesRef = React.useRef(0);
    const inputHeightRef = React.useRef(0);

    const onContentSizeChange = React.useCallback(
        (height: number) => {
            if (height <= 0 || height === inputHeightRef.current) {
                return;
            }

            const constrainedHeight = getConstrainedHeight(
                maxNumberOfLines,
                height,
                textViewLineHeight,
            );

            onHeightChange?.(constrainedHeight);
            inputHeightRef.current = constrainedHeight;

            const newNumberOfLines = Math.round(constrainedHeight / textViewLineHeight);

            if (prevNumberOfLinesRef.current !== newNumberOfLines) {
                prevNumberOfLinesRef.current = newNumberOfLines;
                setNumberOfLines(newNumberOfLines);
                onNumberOfLinesChange?.(numberOfLines);
            }
        },
        [
            maxNumberOfLines,
            numberOfLines,
            onHeightChange,
            onNumberOfLinesChange,
            textViewLineHeight,
        ],
    );

    const remeasureInputHeight = React.useCallback(
        function remeasureInputHeight() {
            if (multiline) {
                const measuredHeight = measureInputHeight(ref);
                onContentSizeChange(measuredHeight || textViewLineHeight);
            }
        },
        [multiline, ref, textViewLineHeight, onContentSizeChange],
    );

    return {
        numberOfLines,
        remeasureInputHeight,
    };
}

export function useAutogrow(
    ref: React.RefObject<TextInput>,
    textViewLineHeight: number,
    onChangeProp: UITextViewProps['onChange'],
    multiline: UITextViewProps['multiline'],
    maxNumberOfLines: UITextViewProps['maxNumberOfLines'],
    onHeightChange: UITextViewProps['onHeightChange'],
    onNumberOfLinesChange: UITextViewProps['onNumberOfLinesChange'],
): AutogrowAttributes {
    const { numberOfLines, remeasureInputHeight } = useMeasureAutogrowTextView(
        ref,
        textViewLineHeight,
        onHeightChange,
        multiline,
        maxNumberOfLines,
        onNumberOfLinesChange,
    );

    const onChange = React.useCallback(
        (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
            if (multiline) {
                remeasureInputHeight();
            }

            if (onChangeProp) {
                onChangeProp(event);
            }
        },
        [remeasureInputHeight, onChangeProp, multiline],
    );

    if (!multiline) {
        return {
            onChange: onChangeProp,
            remeasureInputHeight: undefined,
            numberOfLines: undefined,
            autogrowStyle: undefined,
        };
    }

    return {
        onChange,
        remeasureInputHeight,
        numberOfLines,
        autogrowStyle: undefined,
    };
}
