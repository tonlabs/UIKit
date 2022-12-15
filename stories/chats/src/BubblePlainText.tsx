import * as React from 'react';
import {
    TouchableWithoutFeedback,
    StyleSheet,
    Platform,
    View,
    Animated,
    TextStyle,
    I18nManager,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { runOnUI } from 'react-native-reanimated';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/localization';
import { hapticImpact } from '@tonlabs/uikit.controls';
import {
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
    useTheme,
} from '@tonlabs/uikit.themes';

import { MessageStatus, RegExpConstants } from './constants';
import type { OnLongPressText, OnPressUrl, ChatPlainTextMessage, PlainTextMessage } from './types';
import { useBubblePosition, useBubbleContainerStyle } from './useBubblePosition';
import { useBubbleBackgroundColor, useBubbleRoundedCornerStyle } from './useBubbleStyle';

const renderParsedText = (matchingString: string) => {
    return matchingString.replace(RegExpConstants.protocol, '');
};

const useUrlStyle = (status: MessageStatus) => {
    const theme = useTheme();

    if (status === MessageStatus.Received) {
        return [{ color: theme[ColorVariants.TextPrimary] }, styles.urlReceived];
    }

    return [{ color: theme[ColorVariants.StaticTextPrimaryLight] }, styles.urlSent];
};

export const UrlPressHandlerContext = React.createContext<OnPressUrl>(undefined);

export const TextLongPressHandlerContext = React.createContext<OnLongPressText>(undefined);

function useUrlPressHandler() {
    return React.useContext(UrlPressHandlerContext);
}

function useTextLongPressHandler() {
    return React.useContext(TextLongPressHandlerContext);
}

const getFontColor = (message: PlainTextMessage) => {
    if (message.status === MessageStatus.Aborted) {
        return UILabelColors.StaticTextPrimaryLight;
    }

    if (message.status === MessageStatus.Received) {
        return UILabelColors.TextPrimary;
    }

    return UILabelColors.StaticTextPrimaryLight;
};

const getTimeFontColor = (message: PlainTextMessage) => {
    if (message.status === MessageStatus.Aborted) {
        return UILabelColors.StaticTextOverlayLight;
    }

    if (message.status === MessageStatus.Received) {
        return UILabelColors.TextOverlay;
    }

    return UILabelColors.StaticTextOverlayLight;
};

const getActionString = (message: PlainTextMessage) => {
    if (message.status === MessageStatus.Aborted) {
        return message.actionText || uiLocalized.Chats.Bubbles.TapToSendAgain;
    }

    return message.actionText;
};

const getActionStringColor = (message: PlainTextMessage) => {
    if (message.status === MessageStatus.Aborted) {
        return UILabelColors.TextNegative;
    }

    return UILabelColors.TextTertiary;
};

// For e2e tests, to create unique id as in those tests
// we don't know much about messages
const createUniqTestId = (pattern: string, variable: string) => pattern.replace('%', variable);

const createTestId = (pattern: string, text: string) => {
    return createUniqTestId(pattern, `_${text.split(' ').slice(0, 2).join(' ')}`);
};

function BubbleTime(
    props: ChatPlainTextMessage & {
        style?: TextStyle;
        formattedTime: string;
        isHidden?: boolean;
    },
) {
    const { isHidden, style, formattedTime } = props;
    return (
        <UILabel
            role={UILabelRoles.ParagraphFootnote}
            color={isHidden ? UILabelColors.Transparent : getTimeFontColor(props)}
            style={style}
        >
            {/* Use spaces instead of margins
             *  since they're not working for nested text
             *  \u00A0 is https://en.wikipedia.org/wiki/Non-breaking_space
             */}
            {`\u00A0\u00A0${formattedTime}`}
        </UILabel>
    );
}

function PlainTextContainer(props: PlainTextMessage & { children: React.ReactNode }) {
    const { status, text, onLayout, onTouchText, children } = props;
    const scale = React.useRef(new Animated.Value(1)).current;
    const bubbleScaleAnimation = React.useCallback(
        (scaleIn = false) => {
            Animated.spring(scale, {
                toValue: scaleIn ? UIConstant.animationScaleInFactor() : 1.0,
                friction: 3,
                useNativeDriver: true,
            }).start();
        },
        [scale],
    );
    const position = useBubblePosition(status);
    const containerStyle = useBubbleContainerStyle(props);
    const bubbleBackgroundColor = useBubbleBackgroundColor(props);
    const roundedCornerStyle = useBubbleRoundedCornerStyle(props, position);
    const actionString = getActionString(props);

    const textLongPressHandler = useTextLongPressHandler();

    const longPressHandle = React.useCallback(() => {
        bubbleScaleAnimation(true);
        text && textLongPressHandler && textLongPressHandler(text);
        /**
         * Maybe it's not the best place to run haptic
         * but I don't want to put it in legacy package
         * so left it here, until we make new share manager
         */
        runOnUI(hapticImpact)('medium');
    }, [text, textLongPressHandler, bubbleScaleAnimation]);

    return (
        <View style={containerStyle} onLayout={onLayout}>
            <TouchableWithoutFeedback
                onPressOut={() => bubbleScaleAnimation()}
                onPress={onTouchText}
                onLongPress={longPressHandle}
            >
                <View>
                    <Animated.View
                        style={[
                            UIStyle.padding.verticalSmall(),
                            UIStyle.padding.horizontalNormal(),
                            styles.msgContainer,
                            bubbleBackgroundColor,
                            roundedCornerStyle,
                            { transform: [{ scale }] },
                        ]}
                    >
                        {children}
                    </Animated.View>
                    {actionString && (
                        <UILabel
                            style={styles.actionString}
                            role={UILabelRoles.ActionFootnote}
                            color={getActionStringColor(props)}
                        >
                            {actionString}
                        </UILabel>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

export function BubbleChatPlainText(props: ChatPlainTextMessage) {
    const { status, time, text } = props;
    const urlStyle = useUrlStyle(status);
    const formattedTime = React.useMemo(() => uiLocalized.formatTime(time || Date.now()), [time]);

    const urlPressHandler = useUrlPressHandler();

    return (
        <PlainTextContainer {...props}>
            <UILabel
                testID={createTestId('chat_text_message%', text)}
                role={UILabelRoles.ParagraphText}
                color={getFontColor(props)}
            >
                <ParsedText
                    parse={[
                        {
                            /**
                             * We need to use our RegExp because we must also
                             * identify links with cyrillic.
                             * The library doesn't do this.
                             * */
                            pattern: RegExpConstants.url,
                            style: urlStyle,
                            onPress: urlPressHandler,
                            renderText: renderParsedText,
                        },
                    ]}
                >
                    {text}
                </ParsedText>
            </UILabel>
            {/* The idea is to always draw time in a corner
             * but it should be kinda wrapped by a main text.
             * In order to achive it we draw it two times.
             * First time we draw it with a main text of a message
             * but at the same time make it invisible, this allow us
             * to have a proper padding for the last line.
             * That padding is needed for a time that we draw second time,
             * except this time we place it with `position: absolute` in a corner.
             */}
            <UILabel
                testID={createTestId('chat_text_message%_time', text)}
                role={UILabelRoles.NarrowParagraphNote}
            >
                <BubbleTime {...props} formattedTime={formattedTime} />
            </UILabel>
        </PlainTextContainer>
    );
}

export function BubbleSimplePlainText(props: PlainTextMessage) {
    const { status, text } = props;
    const urlStyle = useUrlStyle(status);
    const urlPressHandler = useUrlPressHandler();

    return (
        <PlainTextContainer {...props}>
            <UILabel
                testID={createTestId('chat_text_message%', text)}
                role={UILabelRoles.ParagraphText}
                color={getFontColor(props)}
            >
                <ParsedText
                    parse={[
                        {
                            pattern: RegExpConstants.url,
                            style: urlStyle,
                            onPress: urlPressHandler,
                            renderText: renderParsedText,
                        },
                    ]}
                >
                    {text}
                </ParsedText>
            </UILabel>
        </PlainTextContainer>
    );
}

const styles = StyleSheet.create({
    urlReceived: {
        // Some android devices seem to render the underline wrongly
        textDecorationLine: Platform.OS === 'android' ? 'none' : 'underline',
    },
    urlSent: {
        // Some android devices seem to render the underline wrongly
        textDecorationLine: Platform.OS === 'android' ? 'none' : 'underline',
    },
    timeHidden: {
        // Beside we set transparent color
        // (that needed mostly for Android)
        // we need opacity for web
        opacity: 0,
        ...Platform.select({
            web: {
                userSelect: 'none',
            },
        }),
    },
    msgContainer: {
        position: 'relative',
        flexDirection: I18nManager.getConstants().isRTL ? 'row-reverse' : 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    actionString: {
        textAlign: 'right',
        paddingTop: UIConstant.tinyContentOffset(),
    },
});
