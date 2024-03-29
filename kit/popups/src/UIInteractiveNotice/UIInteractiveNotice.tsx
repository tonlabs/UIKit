import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Portal } from '@tonlabs/uikit.layout';

import { ToastNoticeContainer } from '../Notice/ToastNoticeContainer';
import { useNoticeVisibility } from '../Notice/hooks/useNoticeVisibility';
import { UIInteractiveNoticeContent } from './UIInteractiveNoticeContent';
import type { UIInteractiveNoticeProps } from './types';
import { UINoticeType } from '../Notice';

export function UIInteractiveNotice(props: UIInteractiveNoticeProps) {
    const { type = UINoticeType.BottomToast, visible, duration, onClose, onTap } = props;
    const {
        noticeVisible,
        countdownProgress,
        startClosingTimer,
        clearClosingTimer,
        onNoticeCloseAnimationFinished,
    } = useNoticeVisibility(onClose, visible, duration);

    if (!noticeVisible) {
        return null;
    }

    return (
        <Portal absoluteFill>
            <View style={styles.container} pointerEvents="box-none">
                <ToastNoticeContainer
                    type={type}
                    visible={visible}
                    onTap={onTap}
                    onCloseAnimationEnd={onNoticeCloseAnimationFinished}
                    suspendClosingTimer={clearClosingTimer}
                    continueClosingTimer={startClosingTimer}
                >
                    {({ onPress, onLongPress, onPressOut }) => (
                        <UIInteractiveNoticeContent
                            {...props}
                            countdownProgress={countdownProgress}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            onPressOut={onPressOut}
                        />
                    )}
                </ToastNoticeContainer>
            </View>
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
});
