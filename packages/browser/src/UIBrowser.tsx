import * as React from 'react';

import type { ChatMessage } from '@tonlabs/uikit.chats';
import type { OnHeightChange } from '@tonlabs/uikit.keyboard';

import { Input, InteractiveMessageType } from './types';
import {
    TerminalMessage,
    TerminalState,
    terminalReducer,
    getTerminalInput,
} from './Inputs/terminal';
import {
    AddressInputMessage,
    AddressInputState,
    AddressInputAction,
    addressInputReducer,
    getAddressInput,
    getAddressInputShared,
} from './Inputs/addressInput';
import { UIBrowserList } from './UIBrowserList';

type InteractiveMessage = TerminalMessage | AddressInputMessage;

export type BrowserMessage = ChatMessage | InteractiveMessage;

type InteractiveMessagesState = {
    [InteractiveMessageType.Terminal]: TerminalState;
    [InteractiveMessageType.AddressInput]: AddressInputState;
};

type InteractiveMessageAction = {
    messageType: InteractiveMessageType;
    payload: AddressInputAction;
};

function interactiveMessagesReducer(
    state: InteractiveMessagesState,
    action: InteractiveMessageAction,
) {
    return {
        [InteractiveMessageType.Terminal]: terminalReducer(),
        [InteractiveMessageType.AddressInput]: addressInputReducer(
            state[InteractiveMessageType.AddressInput],
            action.payload,
        ),
    };
}

type GetInteractiveInput = (
    interactiveMessage: BrowserMessage,
    state: InteractiveMessagesState[InteractiveMessageType],
    dispatch: (action: InteractiveMessageAction['payload']) => void,
    onHeightChange: OnHeightChange,
) => Input;

type GetInteractiveInputShared = (
    interactiveMessage: BrowserMessage,
    state: InteractiveMessagesState[InteractiveMessageType],
    dispatch: (action: InteractiveMessageAction['payload']) => void,
) => React.ReactNode;

type InputFabric = {
    type: InteractiveMessageType;
    getInput: GetInteractiveInput;
    getInputShared?: GetInteractiveInputShared;
};

function useInteractiveMessages(
    allMessages: BrowserMessage[],
    onHeightChange: OnHeightChange,
    inputs: InputFabric[],
): {
    messages: ChatMessage[];
    input: React.ReactNode;
} {
    const [interactiveMessage, ...rest] = allMessages;

    const [state, dispatch] = React.useReducer(interactiveMessagesReducer, {
        [InteractiveMessageType.Terminal]: {
            visible: false,
        },
        [InteractiveMessageType.AddressInput]: {
            inputVisible: false,
            qrCodeVisible: false,
            addressSelectionVisible: false,
        },
    });

    // It's not an interactive message :)
    if (
        Object.keys(InteractiveMessageType).indexOf(interactiveMessage.type) ===
        -1
    ) {
        return {
            messages: allMessages as ChatMessage[],
            input: null,
        };
    }

    const inputsPrepared = inputs.reduce<{
        messages: ChatMessage[];
        input: React.ReactNode;
        shared: React.ReactNode[];
    }>(
        (acc, { type, getInput, getInputShared }) => {
            if (type === interactiveMessage.type) {
                const { messages, input } = getInput(
                    interactiveMessage,
                    state[type],
                    (action) => {
                        dispatch({
                            messageType: type,
                            payload: action,
                        });
                    },
                    onHeightChange,
                );

                acc.messages = acc.messages.concat(messages);
                acc.input = input;
            }

            if (getInputShared != null) {
                const shared = getInputShared(
                    interactiveMessage,
                    state[type],
                    (action) => {
                        dispatch({
                            messageType: type,
                            payload: action,
                        });
                    },
                );

                acc.shared.push(shared);
            }

            return acc;
        },
        {
            messages: [],
            input: null,
            shared: [],
        },
    );

    return {
        messages: [...inputsPrepared.messages, ...(rest as ChatMessage[])],
        input: (
            <>
                {inputsPrepared.input}
                {inputsPrepared.shared}
            </>
        ),
    };
}

type UIBrowserProps = {
    messages: BrowserMessage[];
};

export function UIBrowser({ messages: passedMessages }: UIBrowserProps) {
    const [bottomInset, setBottomInset] = React.useState<number>(0);

    const inputs = React.useMemo(
        () => [
            {
                type: InteractiveMessageType.Terminal,
                getInput: getTerminalInput,
            },
            {
                type: InteractiveMessageType.AddressInput,
                getInput: getAddressInput,
                getInputShared: getAddressInputShared,
            },
        ],
        [],
    );

    const { messages, input } = useInteractiveMessages(
        passedMessages,
        setBottomInset,
        // @ts-ignore
        inputs,
    );

    return (
        <>
            <UIBrowserList messages={messages} bottomInset={bottomInset} />
            {input}
        </>
    );
}
