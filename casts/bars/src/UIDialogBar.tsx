import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UIBackgroundView, ColorVariants } from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { UIHeaderItems, hitSlop } from './UIHeaderItems';
import type { HeaderItem } from './UIHeaderItems';
import { UIConstant as UINavConstant } from './constants';

export type UIDialogBarProps = {
    testID?: string;
    headerLeftItems?: HeaderItem[];
    headerRightItems?: HeaderItem[];
    hasPuller?: boolean;
    backgroundColor?: ColorVariants;
    pullerColor?: ColorVariants;
};

export function UIDialogBar({
    testID,
    headerLeftItems,
    headerRightItems,
    backgroundColor = ColorVariants.BackgroundPrimary,
    pullerColor = ColorVariants.BackgroundTertiary,
    hasPuller = true,
}: UIDialogBarProps) {
    return (
        <UIBackgroundView style={styles.container} testID={testID} color={backgroundColor}>
            <View style={styles.headerLeftItems}>
                <UIHeaderItems items={headerLeftItems} />
            </View>
            {hasPuller ? (
                <UIBackgroundView color={pullerColor} style={styles.puller} />
            ) : (
                <View style={styles.emptyDivider} />
            )}
            <View style={styles.headerRightItems}>
                <UIHeaderItems items={headerRightItems} />
            </View>
        </UIBackgroundView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: UILayoutConstant.headerHeight,
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    puller: {
        width: 32,
        height: 2,
        borderRadius: 2,
        marginHorizontal: UILayoutConstant.smallContentOffset,
        alignSelf: 'center',
    },
    emptyDivider: {
        marginHorizontal: UILayoutConstant.smallContentOffset,
    },
    headerLeftItems: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        // Since we don't use real hitSlop
        // but padding instead,
        // need to apply padding here to compensate
        // applied insets for UIHeaderItem
        // e.g. it's 13 for a button,
        // and since we have 16 by design here
        // it should be 16 - 13 = 3
        paddingLeft: UINavConstant.scrollContentInsetHorizontal - hitSlop.left,
    },
    headerRightItems: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        paddingRight: UINavConstant.scrollContentInsetHorizontal - hitSlop.right,
    },
});
