import React from "react";
import { Platform, Animated, StyleSheet } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { UIStyle, UIColor, UIConstant } from "@tonlabs/uikit.core";

import { ChatPicker } from "./ChatPicker";
import type { OnSendMedia, OnSendDocument } from "./types";

const AndroidKeyboardAdjust =
    Platform.OS === "android"
        ? require("react-native-android-keyboard-adjust")
        : null;

const MAX_INPUT_LENGTH = 320;

type InputWrapperProps = {
    stickersVisible: boolean;

    placeholder: string;
    editable: boolean;
    inputHidden?: boolean;
    menuPlusHidden?: boolean;
    menuPlusDisabled?: boolean;
    menuMoreDisabled?: boolean;
    onContentBottomInsetUpdate: (bottom: number) => void;

    onSendMedia?: OnSendMedia;
    onSendDocument?: OnSendDocument;
};

const InputWrapper = React.forwardRef((props: InputWrapperProps, ref) => {
    const {
        placeholder,
        editable,
        hideInput,
        hideMenuPlus,
        disableMenuPlus,
        disabledMenuMore,
        // quickAction,
        stickersVisible,
        onContentBottomInsetUpdate,
    } = this.props;
    const borderOpacity = React.useRef<Animated.Value>(new Animated.Value(0))
        .current;

    React.useEffect(() => {
        if (Platform.OS !== "android") {
            return;
        }

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                if (ref.current && ref.current.isFocused()) {
                    UICustomKeyboardUtils.dismiss();
                    return true;
                }
                return false;
            }
        );

        return () => {
            backHandler.remove();
        };
    }, []);

    React.useImperativeHandle(ref, () => ({
        showBorder: (show: boolean) => {
            Animated.spring(borderOpacity, {
                toValue: show ? 1 : 0,
                useNativeDriver: true,
                speed: 20,
            }).start();
        },
    }));

    const [inputText, setInputText] = React.useState<string>("");
    const pickerRef = React.useRef();

    return (
        <UIKeyboardAccessory
            onContentBottomInsetUpdate={onContentBottomInsetUpdate}
            customKeyboardVisible={stickersVisible}
            disableTrackingView // since the UICustomKeyboard is used!
        >
            <View
                style={UIStyle.color.getBackgroundColorStyle(
                    UIColor.backgroundPrimary()
                )}
            >
                {/* actionsView TODO: Make actions */}
                <Animated.View
                    style={[styles.border, { opacity: this.borderOpacity }]}
                />
                <TODOUIChatInput
                    ref={ref}
                    testID="chat_input"
                    containerStyle={
                        menuPlusHidden ? UIStyle.margin.leftDefault() : null
                    }
                    autoCorrect={false}
                    value={inputText}
                    editable={editable}
                    stickersActive={stickersVisible}
                    hasStickers={editable}
                    menuPlus={null /*TODO*/}
                    menuPlusDisabled={menuPlusDisabled}
                    menuMore={null /*TODO*/}
                    menuMoreDisabled={menuMoreDisabled}
                    placeholder={placeholder}
                    maxHeight={UIConstant.chatInputMaxHeight()}
                    maxLength={MAX_INPUT_LENGTH}
                    inputHidden={inputHidden}
                    onChangeText={() => {}}
                    onSendText={() => {}}
                    onStickersPress={() => {}}
                    onBlur={() => {}}
                    onFocus={() => {}}
                    onKeyPress={() => {}}
                    onHeightChange={() => {}}
                />
            </View>
            {!hideMenuPlus && (
                <ChatPicker
                    ref={pickerRef}
                    onSendDocument={props.onSendDocument}
                    onSendMedia={props.onSendMedia}
                />
            )}
        </UIKeyboardAccessory>
    );
});

type PickedSticker = {
    // TODO
};

type UIStickerPackage = {
    // TODO
};

type StickersPressOptions = {
    show: boolean;
    dismiss: boolean;
    stickersVisible: boolean;
    setStickersVisible: (visible: boolean) => void;
    onStickersVisible?: (visible: boolean) => void | Promise<void>;
};

const onStickersPress = (options: StickersPressOptions) => {
    if (options.stickersVisible) {
        return;
    }

    if (AndroidKeyboardAdjust) {
        // Apply a hack for Android animation
        AndroidKeyboardAdjust.setAdjustNothing();
        // N.B. It will change back to resize automatically once UICustomKeyboard is dismissed!
    }

    if (Platform.OS === "web") {
        // nothing
    } else if (options.show) {
        Keyboard.dismiss();
    } else if (options.dismiss) {
        UICustomKeyboardUtils.dismiss();
    }

    if (Platform.OS === "android") {
        // nothing
    } else {
        setStickersVisible(options.show);
    }

    if (onStickersVisible) {
        onStickersVisible(options.show);
    }

    (async () => {
        if (options.show) {
            await UIStickerPicker.show();
        } else {
            await UIStickerPicker.show();
        }
    })();
};

type Props = {
    onStickersVisible?: (visible: boolean) => void | Promise<void>;
};

export const UIChatInput = React.forwardRef(function UIChatInputInternal(
    props: Props,
    ref
) {
    const onSendSticker = React.useCallback((sticker: PickedSticker) => {
        if (props.onSendSticker) {
            props.onSendSticker(sticker);
        }
    }, []);
    const [stickersVisible, setStickersVisible] = React.useState<boolean>(
        false
    );
    const [stickers, setStickers] = React.useState<UIStickerPackage[]>([]);

    if (Platform.OS === "web") {
        return (
            <>
                <InputWrapper
                    ref={ref}
                    stickersVisible={stickersVisible}
                    {...props}
                />
                <UIStickerPicker
                    stickers={null /*TODO*/}
                    onPickSticker={onSendSticker}
                />
            </>
        );
    }

    return (
        <UICustomKeyboard
            renderContent={renderInput}
            kbInputRef={textInputRef}
            kbComponent={
                stickersVisible ? UIStickerPicker.keyboardName : undefined
            }
            kbInitialProps={{
                onPickSticker: onSendSticker,
                isCustomKeyboard: true,
                stickers,
            }}
            onItemSelected={(_kbID, sticker) => {
                onSendSticker(sticker);
            }}
            onKeyboardResigned={() => {
                onStickersPress({
                    show: false,
                    dismiss: true,
                    stickersVisible,
                    setStickersVisible,
                    onStickersVisible: props.onStickerVisible,
                });
            }}
        />
    );
});

const styles = StyleSheet.create({
    border: {
        height: 1,
        backgroundColor: UIColor.grey1(),
    },
});
