import * as React from 'react';
import { BackHandler, Platform } from 'react-native';

import { uiLocalized } from '@tonlabs/localization';
import {
    useCustomKeyboard,
    UIInputAccessoryView,
    UICustomKeyboardView,
} from '@tonlabs/uicast.keyboard';
import { UIPopup } from '@tonlabs/uikit.popups';
import type { UIMenuActionProps } from '@tonlabs/uikit.popups';
import type { UITextViewRef } from '@tonlabs/uikit.inputs';

import { ChatInput } from './ChatInput';
import type { OnSendText, OnSendMedia, OnSendDocument, Shortcut, QuickActionItem } from './types';
import { ChatPicker, ChatPickerRef } from './ChatPicker';

function useMenuPlus(menuPlusHidden = false) {
    const chatPickerRef = React.useRef<ChatPickerRef>(null);
    const onPressImage = React.useCallback(() => {
        chatPickerRef.current?.openImageDialog();
    }, []);
    const onPressDocument = React.useCallback(() => {
        chatPickerRef.current?.openDocumentDialog();
    }, []);

    const menu: UIMenuActionProps[] = React.useMemo(() => {
        if (menuPlusHidden) {
            return [];
        }

        return [
            {
                type: UIPopup.Menu.Action.Type.Neutral,
                title: uiLocalized.Chats.Actions.AttachImage,
                onPress: onPressImage,
            },
            {
                type: UIPopup.Menu.Action.Type.Neutral,
                title: uiLocalized.Chats.Actions.AttachDocument,
                onPress: onPressDocument,
            },
        ];
    }, [menuPlusHidden, onPressImage, onPressDocument]);

    return {
        menuPlus: menu,
        chatPickerRef,
    };
}

export function useBackHandler(ref: React.RefObject<UITextViewRef>, dismissKeyboard: () => void) {
    React.useEffect(() => {
        if (Platform.OS !== 'android') {
            return undefined;
        }

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (ref.current && ref.current.isFocused()) {
                dismissKeyboard();
                return true;
            }
            return false;
        });

        return () => {
            if (backHandler) {
                backHandler.remove();
            }
        };
    }, [ref, dismissKeyboard]);
}

export type UIChatInputProps = {
    editable: boolean;
    autoFocus?: boolean;
    placeholder?: string;
    shortcuts?: Shortcut[];
    menuPlusHidden?: boolean;
    menuPlusDisabled?: boolean;
    menuMoreDisabled?: boolean;
    quickActions?: QuickActionItem[];
    // TODO: revisit how it should work after it'll be integrated to Surf
    inputHidden?: boolean;

    onSendText: OnSendText;
    onSendMedia: OnSendMedia;
    onSendDocument: OnSendDocument;
    onCustomKeyboardVisible?: (visible: boolean) => void | Promise<void>;
    onMaxLength?: (maxValue: number) => void;
    onHeightChange?: (height: number) => void;

    customKeyboard?: UICustomKeyboardView;

    managedScrollViewNativeID?: string;
};

export function UIChatInput({
    managedScrollViewNativeID,
    editable,
    autoFocus,
    placeholder,
    shortcuts,
    menuPlusHidden,
    menuPlusDisabled,
    menuMoreDisabled,
    inputHidden,
    quickActions,
    customKeyboard,
    onSendText,
    onMaxLength,
    onSendDocument,
    onSendMedia,
    onHeightChange,
}: UIChatInputProps) {
    const textInputRef = React.useRef<UITextViewRef>(null);

    const {
        customKeyboardView,
        toggle: toggleKeyboard,
        dismiss: dismissKeyboard,
    } = useCustomKeyboard(textInputRef, customKeyboard);

    const { menuPlus, chatPickerRef } = useMenuPlus(menuPlusHidden);

    useBackHandler(textInputRef, dismissKeyboard);

    return (
        <UIInputAccessoryView
            managedScrollViewNativeID={managedScrollViewNativeID}
            customKeyboardView={customKeyboardView}
        >
            <ChatInput
                textInputRef={textInputRef}
                editable={editable}
                autoFocus={autoFocus}
                placeholder={placeholder}
                shortcuts={shortcuts}
                menuPlus={menuPlus}
                menuPlusDisabled={menuPlusDisabled}
                menuMore={undefined /* TODO: we not render it right now, but could at some point */}
                menuMoreDisabled={menuMoreDisabled}
                inputHidden={inputHidden}
                quickActions={quickActions}
                customKeyboardVisible={customKeyboardView != null}
                onCustomKeyboardPress={toggleKeyboard}
                customKeyboardButton={
                    // It is broken on Android, I have to temporarely hide it
                    Platform.OS === 'android' ? undefined : customKeyboard?.button
                }
                onSendText={onSendText}
                onFocus={dismissKeyboard}
                onMaxLength={onMaxLength}
                onHeightChange={onHeightChange}
            />
            <ChatPicker
                ref={chatPickerRef}
                onSendDocument={onSendDocument}
                onSendMedia={onSendMedia}
                dismissKeyboard={dismissKeyboard}
            />
        </UIInputAccessoryView>
    );
}

export * from './constants';
