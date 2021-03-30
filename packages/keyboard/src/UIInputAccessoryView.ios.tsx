import * as React from 'react';
import {
    requireNativeComponent,
    StyleProp,
    StyleSheet,
    ViewStyle,
    ColorValue,
    processColor,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    // eslint-disable-next-line react/no-unused-prop-types
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    managedScrollViewNativeID?: string;
    customKeyboardView?: {
        moduleName: string;
        initialProps?: Record<string, unknown>;
        backgroundColor?: ColorValue;
    };
};

const NativeUIInputAccessoryView = requireNativeComponent<Props>(
    'UIInputAccessoryView',
);

export function UIInputAccessoryView({
    children,
    managedScrollViewNativeID,
    customKeyboardView,
}: Props) {
    const insets = useSafeAreaInsets();

    const processedCustomKeyboardView = React.useMemo(() => {
        if (customKeyboardView == null) {
            return undefined;
        }

        return {
            ...customKeyboardView,
            ...(customKeyboardView.backgroundColor != null
                ? {
                      backgroundColor: processColor(
                          customKeyboardView.backgroundColor,
                      ) as ColorValue,
                  }
                : null),
        };
    }, [customKeyboardView]);

    return (
        <NativeUIInputAccessoryView
            style={styles.container}
            managedScrollViewNativeID={managedScrollViewNativeID}
            customKeyboardView={processedCustomKeyboardView}
        >
            {children}
            <View // A dummy view to make SafeArea translates look nicer
                style={[
                    { height: insets?.bottom ?? 0 },
                    styles.safeAreaFiller,
                    customKeyboardView?.backgroundColor != null
                        ? {
                              backgroundColor:
                                  customKeyboardView.backgroundColor,
                          }
                        : null,
                ]}
            />
        </NativeUIInputAccessoryView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    safeAreaFiller: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '100%',
    },
});
