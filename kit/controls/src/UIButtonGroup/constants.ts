import { ColorVariants } from '@tonlabs/uikit.themes';
import type { PressableColors } from '../Pressable';

// eslint-disable-next-line no-shadow
export enum UIButtonGroupActionIconPosition {
    Left = 'Left',
    Right = 'Right',
}

export const ContentColors: Record<'content' | 'background', PressableColors> = {
    content: {
        initialColor: ColorVariants.TextPrimary,
        pressedColor: ColorVariants.SpecialAccentDark,
        hoveredColor: ColorVariants.TextPrimary,
        disabledColor: ColorVariants.TextSecondary,
        loadingColor: ColorVariants.TextPrimary,
    },
    background: {
        initialColor: ColorVariants.BackgroundBW,
        pressedColor: ColorVariants.BackgroundSecondary,
        hoveredColor: ColorVariants.BackgroundSecondary,
        disabledColor: ColorVariants.BackgroundBW,
        loadingColor: ColorVariants.BackgroundBW,
    },
};

export const UIButtonGroupConstants = {
    skeletonBorderRadius: 5,
};
