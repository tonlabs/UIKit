import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { PartStatusProvider } from '../Container';
import type { PrimaryPartProps, PartStatus } from '../types';

export function PrimaryPart({ children, onPress, disabled, negative }: PrimaryPartProps) {
    const partStatus: PartStatus = React.useMemo((): PartStatus => {
        return { disabled, negative, partType: 'Primary' };
    }, [disabled, negative]);

    return (
        <TouchableOpacity style={styles.primaryPart} disabled={disabled} onPress={onPress}>
            <PartStatusProvider value={partStatus}>{children}</PartStatusProvider>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    primaryPart: {
        flexGrow: 1,
        minWidth: '50%',
        flexDirection: 'row',
        alignItems: 'center',
    },
});
