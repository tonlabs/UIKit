import * as React from 'react';
import { Platform } from 'react-native';
import BigNumber from 'bignumber.js';
import Clipboard from '@react-native-clipboard/clipboard';

import {
    UIChatInput,
    UIChatInputConstants,
    UIChatList,
    ChatMessageType,
    ChatMessage,
    MessageStatus,
    TransactionType,
    useAutoHandleInsets,
} from '@tonlabs/uistory.chats';
import { UIPopup } from '@tonlabs/uikit.popups';
import { uiLocalized } from '@tonlabs/localization';
import { useStickers, OnPickSticker } from '@tonlabs/uistory.stickers';
import { UIInputAccessoryViewAvailability } from '@tonlabs/uicast.keyboard';

import { useBase64Image } from './hooks/useBase64Image';

const userId = '0:000';
const companionId = '0:123';

const imageUrl = {
    original:
        'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/loon-image-original.jpeg?alt=media&token=8907ad38-4d43-47c1-8f80-fd272e617440',
    medium: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/loon-image-medium.jpeg?alt=media&token=8a2f5747-495e-4aae-a9d0-460f34b12717',
    small: 'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/loon-image-small.jpeg?alt=media&token=022bc391-19ec-4e7f-94c6-66349f2e212e',
};
const gifUrl =
    'https://firebasestorage.googleapis.com/v0/b/ton-uikit-example-7e797.appspot.com/o/jim-carrey-yes-sir.gif?alt=media&token=42bb8c1c-ffc7-429d-8838-0436410b1d74';

const useInitialMessages = (): ChatMessage[] => {
    const base64ImagePreview = useBase64Image(imageUrl.small);
    const base64Image = useBase64Image(imageUrl.medium);
    const base64Gif = useBase64Image(gifUrl);

    return React.useMemo(() => {
        return [
            {
                type: ChatMessageType.QRCode,
                data: '',
                time: Math.floor(Date.now() - 4 * 60 * 1000),
                sender: companionId,
                status: MessageStatus.Received,
                key: '',
            },
            {
                type: ChatMessageType.QRCode,
                data: '',
                time: Math.floor(Date.now() - 4 * 60 * 1000),
                sender: userId,
                status: MessageStatus.Sent,
                key: '',
            },
            {
                type: ChatMessageType.QRCode,
                data: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
                time: Math.floor(Date.now() - 4 * 60 * 1000),
                sender: companionId,
                status: MessageStatus.Received,
                key: '',
            },
            {
                type: ChatMessageType.QRCode,
                data: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
                time: Math.floor(Date.now() - 4 * 60 * 1000),
                sender: userId,
                status: MessageStatus.Sent,
                key: '',
            },
            {
                type: ChatMessageType.Media,
                data: base64Gif,
                preview: base64Gif,
                prompt: 'Yes Sir',
                time: Math.floor(Date.now() - 4 * 60 * 1000),
                sender: companionId,
                status: MessageStatus.Sent,
                key: '',
            },
            {
                type: ChatMessageType.Media,
                data: base64Image,
                preview: base64ImagePreview,
                prompt: 'Look at it!',
                time: Math.floor(Date.now() - 4 * 60 * 1000),
                sender: companionId,
                status: MessageStatus.Sent,
                key: '',
            },
            {
                type: ChatMessageType.PlainText,
                status: MessageStatus.Received,
                time: Math.floor(Date.now() - 4 * 60 * 1000),
                sender: companionId,
                text: 'This one is from me',
                key: '',
            },
            {
                type: ChatMessageType.PlainText,
                status: MessageStatus.Received,
                time: Math.floor(Date.now() - 5 * 60 * 1000),
                sender: companionId,
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                key: '',
            },
            {
                type: ChatMessageType.PlainText,
                status: MessageStatus.Sent,
                time: Math.floor(Date.now() - 4 * 60 * 1000),
                sender: userId,
                text: 'This one is from me',
                key: '',
            },
            {
                type: ChatMessageType.PlainText,
                status: MessageStatus.Sent,
                time: Math.floor(Date.now() - 5 * 60 * 1000),
                sender: userId,
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                key: '',
            },
            {
                type: ChatMessageType.ActionButton,
                status: MessageStatus.Sent,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: userId,
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                textMode: 'fit',
                key: '',
            },
            {
                type: ChatMessageType.ActionButton,
                status: MessageStatus.Received,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: companionId,
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                textMode: 'fit',
                key: '',
            },
            {
                type: ChatMessageType.ActionButton,
                status: MessageStatus.Sent,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: userId,
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                textMode: 'ellipsize',
                key: '',
            },
            {
                type: ChatMessageType.ActionButton,
                status: MessageStatus.Received,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: companionId,
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                textMode: 'ellipsize',
                key: '',
            },
            {
                type: ChatMessageType.ActionButton,
                status: MessageStatus.Sent,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: userId,
                text: 'This is action',
                key: '',
            },
            {
                type: ChatMessageType.ActionButton,
                status: MessageStatus.Received,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: companionId,
                text: 'This is action',
                key: '',
            },
            {
                type: ChatMessageType.Sticker,
                status: MessageStatus.Pending,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: userId,
                source: {
                    uri: 'https://firebasestorage.googleapis.com/v0/b/ton-surf.appspot.com/o/chatResources%2Fstickers%2Fsurf%2F7%402x.png?alt=media&token=a34d3bda-f83a-411c-a586-fdb730903928',
                },
                key: '',
            },
            {
                type: ChatMessageType.Sticker,
                status: MessageStatus.Sent,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: userId,
                source: {
                    uri: 'https://firebasestorage.googleapis.com/v0/b/ton-surf.appspot.com/o/chatResources%2Fstickers%2Fsurf%2F7%402x.png?alt=media&token=a34d3bda-f83a-411c-a586-fdb730903928',
                },
                key: '',
            },
            {
                type: ChatMessageType.Sticker,
                status: MessageStatus.Received,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: companionId,
                source: {
                    uri: 'https://firebasestorage.googleapis.com/v0/b/ton-surf.appspot.com/o/chatResources%2Fstickers%2Fsurf%2F7%402x.png?alt=media&token=a34d3bda-f83a-411c-a586-fdb730903928',
                },
                key: '',
            },
            {
                type: ChatMessageType.System,
                status: MessageStatus.Sent,
                time: Math.floor(Date.now() - 1 * 60 * 1000), // TODO: is this mandatory field for system message?
                sender: userId, // TODO: is this mandatory field for system message?
                text: 'This is a system message',
                key: '',
            },
            {
                type: ChatMessageType.Transaction,
                status: MessageStatus.Received,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: companionId,
                info: {
                    type: TransactionType.Income,
                    amount: new BigNumber(1),
                    balanceChange: '1.000',
                },
                comment: {
                    text: 'Pocket money 😅🎉🤔😂🙏😔',
                    // text: 'Pocket money 😅🎉🤔😂🙏😔😮👆👍❤️😍☺️😊😘😭😩',
                    encrypted: true,
                },
                onPress() {
                    console.log('hey');
                },
                key: '',
            },
            {
                type: ChatMessageType.Transaction,
                status: MessageStatus.Aborted,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: userId,
                info: {
                    balanceChange: '1.000',
                    type: TransactionType.Expense,
                    amount: new BigNumber(1),
                },
                comment: {
                    text: 'Pocket money',
                    encrypted: false,
                },
                onPress() {
                    console.log('hey');
                },
                key: '',
            },
            {
                type: ChatMessageType.Transaction,
                status: MessageStatus.Aborted,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: userId,
                info: {
                    balanceChange: '1.000',
                    type: TransactionType.Income,
                    amount: new BigNumber(1),
                },
                key: '',
            },
            {
                type: ChatMessageType.Transaction,
                status: MessageStatus.Sent,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: userId,
                info: {
                    balanceChange: '1.000',
                    type: TransactionType.Expense,
                    amount: new BigNumber(1),
                    text: MessageStatus.Sent,
                },
                comment: {
                    text: 'Some money',
                    encrypted: true,
                },
                key: '',
            },
            {
                type: ChatMessageType.Transaction,
                status: MessageStatus.Received,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: companionId,
                info: {
                    balanceChange: '1.000',
                    type: TransactionType.Expense,
                    amount: new BigNumber(1),
                    text: MessageStatus.Sent,
                },
                key: '',
            },
            {
                type: ChatMessageType.Transaction,
                status: MessageStatus.Sent,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: userId,
                info: {
                    balanceChange: '1.000',
                    type: TransactionType.Income,
                    amount: new BigNumber(9999.123456789),
                    text: MessageStatus.Received,
                },
                key: '',
            },
            {
                type: ChatMessageType.Transaction,
                status: MessageStatus.Received,
                time: Math.floor(Date.now() - 1 * 60 * 1000),
                sender: companionId,
                info: {
                    balanceChange: '1.000',
                    type: TransactionType.Income,
                    amount: new BigNumber(1),
                    text: MessageStatus.Received,
                },
                comment: {
                    text: 'Take it',
                    encrypted: true,
                },
                key: '',
            },
            {
                type: ChatMessageType.PlainText,
                status: MessageStatus.Aborted,
                time: Math.floor(Date.now() - 5 * 60 * 1000),
                sender: userId,
                text: "I'm aborted one!",
                key: '',
            },
        ];
    }, [base64Image, base64ImagePreview, base64Gif]);
};

const useInitialMessagesWithKeys = (initialMessages: ChatMessage[]) => {
    return React.useMemo(() => {
        return initialMessages.map((m: ChatMessage, i: number) => {
            // eslint-disable-next-line no-param-reassign
            m.key = m.type + i;
            return m;
        });
    }, [initialMessages]);
};

const stickers = new Array(10).fill(null).map((_a, i) => ({
    id: `test${i}`,
    date: Date.now(),
    description: '',
    name: 'test',
    stickers: new Array(4).fill(null).map((_b, j) => ({
        name: `crown${j}`,
        url: 'https://firebasestorage.googleapis.com/v0/b/ton-surf.appspot.com/o/chatResources%2Fstickers%2Fsurf%2F7%402x.png?alt=media&token=a34d3bda-f83a-411c-a586-fdb730903928',
    })),
}));

export function Chat() {
    const [isNoticeVisible, setNoticeVisible] = React.useState(false);
    const initialMessages = useInitialMessages();
    const initialMessagesWithKeys = useInitialMessagesWithKeys(initialMessages);
    const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessagesWithKeys);

    React.useEffect(() => {
        setMessages(initialMessagesWithKeys);
    }, [initialMessagesWithKeys]);

    const onLoadEarlierMessages = React.useCallback(() => undefined, []);
    const onPressUrl = React.useCallback(() => {
        console.log('url handled');
    }, []);

    const onLongPressText = React.useCallback((text: string) => {
        Clipboard.setString(text);
        console.log('long press handled', text);
        setNoticeVisible(true);
    }, []);

    const hideNotice = React.useCallback(() => {
        setNoticeVisible(false);
    }, []);

    const onSendMedia = React.useCallback(() => undefined, []);
    const onSendDocument = React.useCallback(() => undefined, []);
    const onItemSelected: OnPickSticker = React.useCallback(
        stk => {
            setMessages([
                {
                    key: `${Date.now()}stk`,
                    type: ChatMessageType.Sticker,
                    status: MessageStatus.Sent,
                    time: Date.now(),
                    sender: userId,
                    source: {
                        uri: stk.url,
                    },
                },
                ...messages,
            ]);

            return true;
        },
        [messages, setMessages],
    );
    const stickersKeyboard = useStickers(stickers, onItemSelected);

    const {
        shouldAutoHandleInsets,
        onInputAccessoryViewAvailable,
        onInputAccessoryViewUnavailable,
        contentInset,
        onHeightChange,
    } = useAutoHandleInsets(
        /**
         * `false` is kinda important until we have
         * two separate ways to handle insets in chat on iOS
         * (automaticallyAdjustContentInsets, UIInputAccessoryView)
         * since in this case they're conflict on initial render.
         *
         * As in chat for iOS we have an InputAccessoryView visible all the time
         * it's pretty safe to do.
         */
        Platform.select({ ios: false, default: true }),
        UIChatInputConstants.chatInputMinHeight,
    );

    return (
        <>
            <UIInputAccessoryViewAvailability
                onInputAccessoryViewAvailable={onInputAccessoryViewAvailable}
                onInputAccessoryViewUnavailable={onInputAccessoryViewUnavailable}
            >
                <UIChatList
                    nativeID="chatSectionList"
                    onLoadEarlierMessages={onLoadEarlierMessages}
                    onPressUrl={onPressUrl}
                    onLongPressText={onLongPressText}
                    canLoadMore
                    isLoadingMore={false}
                    messages={messages}
                    shouldAutoHandleInsets={shouldAutoHandleInsets}
                    contentInset={contentInset}
                />
                <UIChatInput
                    managedScrollViewNativeID="chatSectionList"
                    editable
                    onSendText={(text: string) => {
                        setMessages([
                            {
                                key: `${Date.now()}1`,
                                type: ChatMessageType.PlainText,
                                status: MessageStatus.Sent,
                                time: Date.now(),
                                sender: userId,
                                text,
                            },
                            ...messages,
                        ]);
                    }}
                    onSendMedia={onSendMedia}
                    onSendDocument={onSendDocument}
                    customKeyboard={stickersKeyboard}
                    onHeightChange={onHeightChange}
                />
            </UIInputAccessoryViewAvailability>
            <UIPopup.Notice
                visible={isNoticeVisible}
                title={uiLocalized.MessageCopiedToClipboard}
                type={UIPopup.Notice.Type.BottomToast}
                color={UIPopup.Notice.Color.Primary}
                onClose={hideNotice}
            />
        </>
    );
}
