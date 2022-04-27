import * as React from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import { UILabel, TypographyVariants, Typography } from '@tonlabs/uikit.themes';
import type { UIExpandableTextProps } from './types';

export function MeasureLabel(
    props: UIExpandableTextProps & {
        setIsFit: (isFit: boolean) => void;
    },
) {
    const { numberOfLines, setIsFit, role } = props;

    const lineHeight = React.useMemo(
        () => StyleSheet.flatten(Typography[role || TypographyVariants.ParagraphText]).lineHeight,
        [role],
    );

    const onLayout = React.useCallback(
        (event: LayoutChangeEvent) => {
            const {
                nativeEvent: {
                    layout: { height },
                },
            } = event;

            if (
                numberOfLines == null ||
                lineHeight == null ||
                Math.round(height / lineHeight) <= numberOfLines
            ) {
                setIsFit(true);
            } else {
                setIsFit(false);
            }
        },
        [lineHeight, numberOfLines, setIsFit],
    );

    return (
        <UILabel {...props} onLayout={onLayout} style={styles.measure} numberOfLines={undefined} />
    );
}
const styles = StyleSheet.create({
    measure: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        opacity: 0,
        flexShrink: 0,
    },
});
