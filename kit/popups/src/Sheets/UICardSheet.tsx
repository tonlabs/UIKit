import * as React from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { useTheme, Theme, makeStyles, ColorVariants } from '@tonlabs/uikit.themes';
import { UIDialogBar } from '@tonlabs/uicast.bars';

import { UISheet, UISheetProps } from './UISheet/UISheet';

export type UICardSheetProps = UISheetProps & { style?: StyleProp<ViewStyle> };

// @inline
const CARD_SHEET_DEFAULT_BOTTOM_INSET = 16; // UILayoutConstant.contentOffset

function getCardSheetBottomInset(bottomInset: number, keyboardHeight: number) {
    'worklet';

    if (keyboardHeight !== 0) {
        return CARD_SHEET_DEFAULT_BOTTOM_INSET;
    }

    return Math.max(CARD_SHEET_DEFAULT_BOTTOM_INSET, bottomInset);
}

export function UICardSheet({
    children,
    style,
    hasHeader = true,
    headerOptions,
    ...rest
}: UICardSheetProps) {
    const theme = useTheme();
    const { visible, forId } = rest;
    const styles = useStyles(theme);
    return (
        <UISheet.Container visible={visible} forId={forId}>
            <UISheet.KeyboardAware getBottomInset={getCardSheetBottomInset}>
                <UISheet.IntrinsicSize>
                    <UISheet.Content {...rest} style={styles.card}>
                        {hasHeader ? <UIDialogBar hasPuller {...headerOptions} /> : null}
                        <View style={[styles.cardContent, style]}>{children}</View>
                    </UISheet.Content>
                </UISheet.IntrinsicSize>
            </UISheet.KeyboardAware>
        </UISheet.Container>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        alignSelf: 'stretch',
        maxWidth: UILayoutConstant.elasticWidthCardSheet,
        marginHorizontal: UILayoutConstant.contentOffset,
        borderRadius: UILayoutConstant.alertBorderRadius,
        alignItems: 'stretch',
        overflow: 'hidden',
        backgroundColor: theme[ColorVariants.BackgroundPrimary],
    },
    cardContent: {
        paddingHorizontal: UILayoutConstant.contentOffset,
    },
}));
