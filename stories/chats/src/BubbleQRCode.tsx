import * as React from 'react';
import { ImageStyle, StyleProp, View, ViewStyle } from 'react-native';

import {
    QRCodeSize,
    QRCodeType,
    QRCodeRef,
    UIImage,
    UIQRCodeView,
    useQRCodeValueError,
} from '@tonlabs/uikit.media';
import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { uiLocalized } from '@tonlabs/localization';
import { UIAssets } from '@tonlabs/uikit.assets';
import {
    ColorVariants,
    makeStyles,
    Theme,
    TypographyVariants,
    UILabel,
    useTheme,
} from '@tonlabs/uikit.themes';
import { UIPressableArea } from '@tonlabs/uikit.controls';

import { useBubbleContainerStyle, useBubblePosition } from './useBubblePosition';
import { useBubbleBackgroundColor, useBubbleRoundedCornerStyle } from './useBubbleStyle';
import { MessageStatus } from './constants';
import type { ChatQRCodeMessage, QRCodeMessage } from './types';

export const ChatBubbleQRCode: React.FC<ChatQRCodeMessage> = (message: ChatQRCodeMessage) => {
    return <BubbleQRCode {...message} />;
};

const getErrorMessage = (messageStatus: MessageStatus): string => {
    switch (messageStatus) {
        case MessageStatus.Received:
            return uiLocalized.Chats.QRCode.errorReceived;
        default:
            return uiLocalized.Chats.QRCode.errorSent;
    }
};

const renderErrorIcon = (
    messageStatus: MessageStatus,
    iconStyles: StyleProp<ImageStyle>,
): React.ReactElement | null => {
    switch (messageStatus) {
        case MessageStatus.Received:
            return null;
        default:
            return (
                <UIImage
                    source={UIAssets.icons.ui.info}
                    style={iconStyles}
                    tintColor={ColorVariants.TextSecondary}
                />
            );
    }
};

const renderError = (
    messageStatus: MessageStatus,
    containerStyle: StyleProp<ViewStyle>,
    roundedCornerStyle: StyleProp<ViewStyle>,
    errorBubble: StyleProp<ViewStyle>,
    iconStyles: StyleProp<ImageStyle>,
): React.ReactElement => {
    return (
        <View style={containerStyle}>
            <View
                style={[
                    roundedCornerStyle,
                    UIStyle.padding.verticalNormal(),
                    UIStyle.padding.horizontalNormal(),
                    errorBubble,
                ]}
            >
                <UILabel
                    role={TypographyVariants.ParagraphText}
                    color={ColorVariants.TextSecondary}
                >
                    {getErrorMessage(messageStatus)}
                </UILabel>
            </View>
            {renderErrorIcon(messageStatus, iconStyles)}
        </View>
    );
};

export const BubbleQRCode: React.FC<QRCodeMessage> = (message: QRCodeMessage) => {
    const { status, data, onError, onSuccess } = message;
    const theme = useTheme();
    const position = useBubblePosition(status);
    const containerStyle = useBubbleContainerStyle(message);
    const bubbleBackgroundColor = useBubbleBackgroundColor(message);
    const roundedCornerStyle = useBubbleRoundedCornerStyle(
        message,
        position,
        UIConstant.mediumBorderRadius(),
    );
    const styles = useStyles(theme);
    const ref = React.useRef<QRCodeRef>(null);
    const onPress = React.useCallback(async () => {
        if (!message.onPress) {
            return;
        }
        
        const base64 = await ref.current?.getPng();
        if (!base64) {
            return;
        }

        message.onPress(base64);
    }, []);

    const error = useQRCodeValueError(data, onError, onSuccess);

    if (error) {
        return renderError(
            message.status,
            [containerStyle, styles.errorContainer],
            roundedCornerStyle,
            styles.errorBubble,
            styles.icon as ImageStyle,
        );
    }

    return (
        <View style={containerStyle} onLayout={message.onLayout}>
            <View
                style={[
                    UIStyle.padding.verticalNormal(),
                    UIStyle.padding.horizontalNormal(),
                    bubbleBackgroundColor,
                    roundedCornerStyle,
                ]}
            >
                <UIPressableArea onPress={onPress}>
                    <View style={styles.qrCode}>
                        <UIQRCodeView
                            ref={ref}
                            size={QRCodeSize.Medium}
                            testID={`chat_qr_code_${data}`}
                            type={QRCodeType.Square}
                            logo={UIAssets.icons.brand.tonSymbolBlack}
                            value={data}
                        />
                    </View>
                </UIPressableArea>
            </View>
        </View>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    qrCode: {
        borderRadius: UIConstant.mediumBorderRadius(),
        overflow: 'hidden',
    },
    errorBubble: {
        backgroundColor: theme[ColorVariants.BackgroundNeutral],
    },
    errorContainer: {
        flexDirection: 'row',
    },
    icon: {
        height: 24,
        aspectRatio: 1,
        marginLeft: 8,
    },
}));
