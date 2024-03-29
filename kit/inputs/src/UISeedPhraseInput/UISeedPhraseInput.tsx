import * as React from 'react';
import {
    Platform,
    NativeSyntheticEvent,
    TextInputSelectionChangeEventData,
    TextInputFocusEventData,
} from 'react-native';

import { uiLocalized } from '@tonlabs/localization';

import { UIMaterialTextView, UIMaterialTextViewRef } from '../UIMaterialTextView';

import { useExtendedRef, useHelperCredentials } from './hooks';
import type { UISeedPhraseInputProps, UISeedPhraseInputState, ValidationResult } from './types';
import { UISeedPhraseInputMessageType } from './consts';
import { InputColorScheme } from '../Common';

const SPLITTER = ` `;

const WORDS_REG_EXP = /[\p{L}\p{N}]+/gu;
const NOT_LATIN_LETTERS_REG_EXP = /[^a-zA-Z]/g;

function getWordList(text: string, maxWords: number): string[] {
    const wordList = text.match(WORDS_REG_EXP);

    if (wordList && wordList.length > maxWords) {
        return wordList.slice(0, maxWords);
    }
    return wordList ?? [];
}

const initialState: UISeedPhraseInputState = {
    phrase: '',
    parts: [],
};

export const UISeedPhraseInput = React.forwardRef<UIMaterialTextViewRef, UISeedPhraseInputProps>(
    function UISeedPhraseInputForwarded(props: UISeedPhraseInputProps, ref) {
        const {
            onBlur: onBlurProp,
            onFocus: onFocusProp,
            onSubmit,
            onSuccess,
            testID,
            totalWords: totalWordsProp,
            validatePhrase,
            placeholder,
            colorScheme = InputColorScheme.Default,
            font,
        } = props;
        const totalWords = React.useMemo(() => {
            if (typeof totalWordsProp === 'number') {
                return [totalWordsProp];
            }

            return totalWordsProp;
        }, [totalWordsProp]);

        const textInputRef = React.useRef<UIMaterialTextViewRef>(null);

        const [state, setState] = React.useState<UISeedPhraseInputState>(initialState);

        useExtendedRef(ref, textInputRef);

        const [isFocused, setIsFocused] = React.useState(false);

        const onFocus = React.useCallback(
            (evt: NativeSyntheticEvent<TextInputFocusEventData>) => {
                setIsFocused(true);

                if (onFocusProp) {
                    onFocusProp(evt);
                }
            },
            [setIsFocused, onFocusProp],
        );

        const onBlur = React.useCallback(
            (evt: NativeSyntheticEvent<TextInputFocusEventData>) => {
                // To handle taps on hints we need to delay handling a bit
                // to get a room for event to fire (at least on web)
                // or with isFocused == true hints will be re-rendered before click occur
                setTimeout(() => {
                    // in onHintSelected method we call .focus() to continue typing
                    // so it means we don't need to handle blur event anymore
                    if (textInputRef && textInputRef.current?.isFocused()) {
                        return;
                    }
                    setIsFocused(false);
                }, 50);

                if (onBlurProp) {
                    onBlurProp(evt);
                }
            },
            [textInputRef, onBlurProp],
        );

        const [hasNonLatinCharacters, setHasNonLatinCharacters] = React.useState(false);

        const maxWords = React.useMemo(() => Math.max.apply(null, totalWords), [totalWords]);

        const onChangeText = React.useCallback(
            (textRaw: string) => {
                // Note: there is an issue with `.toLocaleLowerCase` on Android on some old API version
                // when `Hermes` is used. See issue: https://github.com/facebook/hermes/issues/582
                // The given function returns some incorrect result when applied to an empty string.
                // It was fixed for hermes@0.10.0 which is supposed to be used with react-native@0.67
                // For now we just need to ensure the string is not empty, when applying the function
                const text = textRaw ? textRaw.toLocaleLowerCase() : '';

                const wordList = getWordList(text, maxWords);

                if (wordList?.join('').match(NOT_LATIN_LETTERS_REG_EXP)) {
                    setHasNonLatinCharacters(true);
                } else {
                    setHasNonLatinCharacters(false);
                }

                let newText = wordList?.join(SPLITTER).trim() ?? '';

                if (newText && text.endsWith(SPLITTER) && wordList.length < maxWords) {
                    newText += SPLITTER;
                }

                if (newText !== text) {
                    textInputRef.current?.changeText(newText, false);
                }

                setState({ phrase: newText, parts: wordList });
            },
            [maxWords],
        );

        const [validationResult, setValidationResult] = React.useState<boolean | ValidationResult>(
            false,
        );

        // To not call validation at every prop change
        // (and prevent infinite cycles)
        const validatePhraseRef = React.useRef(validatePhrase);
        const onSuccessRef = React.useRef(onSuccess);
        React.useEffect(() => {
            validatePhraseRef.current = validatePhrase;
            onSuccessRef.current = onSuccess;
        }, [validatePhrase, onSuccess]);

        React.useEffect(() => {
            const { phrase, parts } = state;
            validatePhraseRef.current(phrase, parts).then(result => {
                setValidationResult(result);
                if (
                    result === true ||
                    (typeof result === 'object' &&
                        result.type === UISeedPhraseInputMessageType.Success)
                ) {
                    onSuccessRef.current(phrase, parts);
                }
            });
        }, [state]);

        const onSubmitEditing = React.useCallback(() => {
            if (
                validationResult === true ||
                (typeof validationResult === 'object' &&
                    validationResult.type === UISeedPhraseInputMessageType.Success)
            ) {
                onSubmit?.();
            }
        }, [validationResult, onSubmit]);

        const { helperText, error, warning, success } = useHelperCredentials(
            state,
            isFocused,
            hasNonLatinCharacters,
            totalWords,
            validationResult,
        );

        const onSelectionChange = React.useCallback(
            ({
                nativeEvent: {
                    selection: { start, end },
                },
            }: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
                // We want to protect seed phrase against copying
                // as it might be occasionally compromised in clipboard
                // NOTE: on android, this resets the input value for an unknown reason
                if (Platform.OS !== 'android' && start !== end) {
                    textInputRef.current?.moveCarret(end);
                }
            },
            [textInputRef],
        );

        return (
            <UIMaterialTextView
                ref={textInputRef}
                testID={testID}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                multiline
                contextMenuHidden
                label={uiLocalized.MasterPassword}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                onSelectionChange={onSelectionChange}
                placeholder={placeholder}
                helperText={helperText}
                error={error}
                warning={warning}
                success={success}
                returnKeyType="done"
                onSubmitEditing={onSubmitEditing}
                blurOnSubmit
                noPersonalizedLearning
                colorScheme={colorScheme}
                font={font}
            />
        );
    },
);
