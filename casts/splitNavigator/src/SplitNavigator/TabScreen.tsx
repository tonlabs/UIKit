import * as React from 'react';
import { StyleSheet } from 'react-native';
import ReAnimated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { MaybeScreen } from './ScreenFallback';

type TabScreenProps = {
    isVisible: boolean;
    children: React.ReactNode;
};

export function TabScreen({ isVisible, children }: TabScreenProps) {
    const opacity = useSharedValue(0);
    /**
     * The state is needed to pass it to MaybeScreen,
     * that has Freeze (from react-freeze) under the hood
     * to set it only when animation is finished
     */
    const [visible, setVisible] = React.useState(false);

    const hide = React.useCallback(() => {
        setVisible(false);
    }, []);

    React.useEffect(() => {
        if (visible === isVisible) {
            return;
        }
        if (visible === false && isVisible === true) {
            opacity.value = withSpring(1, { overshootClamping: true });
            setVisible(true);
        } else {
            opacity.value = withSpring(0, { overshootClamping: true }, finished => {
                if (finished) {
                    runOnJS(hide)();
                }
            });
        }
    }, [isVisible, opacity, hide, visible]);

    const fadeOpacityStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    }, []);
    const fadeStyle = React.useMemo(() => [styles.container, fadeOpacityStyle], [fadeOpacityStyle]);

    return (
        <MaybeScreen enabled visible={visible} style={StyleSheet.absoluteFill}>
            <ReAnimated.View
                accessibilityElementsHidden={!visible}
                importantForAccessibility={visible ? 'auto' : 'no-hide-descendants'}
                style={fadeStyle}
            >
                {children}
            </ReAnimated.View>
        </MaybeScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
