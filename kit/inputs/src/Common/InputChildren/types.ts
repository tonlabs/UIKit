import type { StyleProp, ViewStyle } from 'react-native';
import type { UIImageProps } from '@tonlabs/uikit.media';
import type { InputColorScheme, InputFont } from '../constants';

export type InputIconProps = UIImageProps & {
    /**
     * Callback called by clicking/tapping on the icon
     */
    onPress?: () => void;
    /**
     * Style of icon container view
     * Overwrites the predefined container style.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * ColorScheme of the icon.
     * This prop is not required. If not passed, the colorScheme of the parent component will be used.
     */
    colorScheme?: InputColorScheme;
};

export type InputActionProps = InputTextProps & {
    /**
     * Flag whether input action is disabled or not
     */
    disabled?: boolean;
    /**
     * Callback called by clicking/tapping on the action
     */
    onPress?: () => void;
};

export type InputTextProps = {
    /**
     * You can pass a `string` or `UIImage`.
     *
     * If it is a `string`, it will be placed in a `UILabel` with suitable styles.
     *
     * If it is the `UIImage`, a suitable color and size styles will be passed to it.
     */
    children:
        | string
        | React.ReactElement<UIImageProps>
        | (string | React.ReactElement<UIImageProps> | null | undefined)[];
    /**
     * ColorScheme of the text or image.
     * This prop is not required. If not passed, the colorScheme of the parent component will be used.
     */
    colorScheme?: InputColorScheme;
    /**
     * Font of the text.
     * This prop is not required. If not passed, the font of the parent component will be used.
     */
    font?: InputFont;
};

export type InputClearButtonProps = {
    /**
     * The callback that calls when the CleraButton was pressed
     */
    clear?: (() => void) | undefined;
    /**
     * Should the button to be just empty container with size of the visible button
     * to reserve space for the button.
     */
    hiddenButton?: boolean;
    /**
     * ColorScheme of the clear button.
     * This prop is not required. If not passed, the colorScheme of the parent component will be used.
     */
    colorScheme?: InputColorScheme;
};

export type InputIconChild = React.ReactElement<InputIconProps>;
export type InputActionChild = React.ReactElement<InputActionProps>;
export type InputTextChild = React.ReactElement<InputTextProps>;
export type InputChild = InputIconChild | InputActionChild | InputTextChild;

export type InputChildren = InputChild | InputChild[] | undefined;

export type InputChildrenContextType = {
    /**
     * Color scheme of the TextView.
     * @default InputColorScheme.Default
     */
    colorScheme: InputColorScheme;
};
