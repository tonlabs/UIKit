import * as React from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export type AccordionOverlayViewRef = {
    show(startY: number, endY: number): Promise<void>;
    append(startY: number, endY: number): Promise<void>;
    moveAndHide(shiftY: number, duration?: number): void;
};
type AccordionOverlayViewProps = React.PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;

function takeScreenshot(contentContainerElement: Element, startY: number, endY: number) {
    let y = 0;
    let firstInSnapIndex = 0;
    let firstInSnapElementCorrection = 0;
    let lastInSnapIndex = -1;
    const { children: containerChildren } = contentContainerElement;
    for (let i = 0; i < containerChildren.length; i += 1) {
        const child = containerChildren[i];
        const prevY = y;
        y += child.clientHeight;

        if (y > endY) {
            lastInSnapIndex = i;
            // To not traverse through all children
            // as after that point they're doesn't matter
            break;
        }

        if (y > startY) {
            lastInSnapIndex = i;
        }

        if (prevY <= startY && y > startY) {
            firstInSnapIndex = i;
            firstInSnapElementCorrection = prevY - startY;
            continue;
        }
    }

    const croppedHeight = endY - startY;
    let height = firstInSnapElementCorrection;
    const result = [];
    for (let i = firstInSnapIndex; i <= lastInSnapIndex; i += 1) {
        const copiedNode = containerChildren[i].cloneNode(true);
        const nextHeight = height + containerChildren[i].clientHeight;

        if (nextHeight > croppedHeight) {
            copiedNode.style.height = `${croppedHeight - height}px`;
            copiedNode.style.overflow = 'hidden';
            height = croppedHeight;
            result.push(copiedNode);
            break;
        }

        height = nextHeight;
        result.push(copiedNode);
    }

    /**
     * If overall height of the snap is less than what was requested
     * need to fill it with an empty div
     */
    if (height < croppedHeight) {
        const filler = document.createElement('div');
        filler.style.height = `${croppedHeight - height}px`;
        result.push(filler);
    }

    return {
        screenshot: result,
        correction: firstInSnapElementCorrection,
    };
}

export const AccordionOverlayView = React.forwardRef<
    AccordionOverlayViewRef,
    AccordionOverlayViewProps
>(function AccordionOverlayView({ children, style }: AccordionOverlayViewProps, ref) {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const overlayRef = React.useRef<HTMLDivElement>(null);
    const overlayInnerTranslationY = useSharedValue(0);
    const overlayInnerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: overlayInnerTranslationY.value,
                },
            ],
        };
    });

    const hideOverlay = React.useCallback(() => {
        console.log('hide');
        if (overlayRef.current == null) {
            return Promise.reject(new Error('Overlay not ready yet'));
        }
        const overlayInner = overlayRef.current.firstElementChild;
        if (overlayInner == null) {
            return Promise.reject(new Error('Unexpected overlay structure'));
        }

        overlayRef.current.style.removeProperty('top');
        overlayInner.innerHTML = '';
    }, []);

    React.useImperativeHandle(ref, () => ({
        show(startY: number, endY: number) {
            console.log(startY, endY, endY - startY);
            if (wrapperRef.current == null) {
                return Promise.reject(new Error('Overlay not ready yet'));
            }
            if (overlayRef.current == null) {
                return Promise.reject(new Error('Overlay not ready yet'));
            }
            const containerElement = wrapperRef.current.firstElementChild;
            if (containerElement == null) {
                return Promise.reject(new Error('Unexpected ScrollView structure'));
            }
            const contentContainerElement = containerElement.firstElementChild;
            if (contentContainerElement == null) {
                return Promise.reject(new Error('Unexpected ScrollView structure'));
            }
            const overlayInner = overlayRef.current.firstElementChild;
            if (overlayInner == null) {
                return Promise.reject(new Error('Unexpected overlay structure'));
            }

            // Reset tranlsation if any
            overlayInnerTranslationY.value = 0;

            const { screenshot, correction } = takeScreenshot(
                contentContainerElement,
                startY,
                endY,
            );

            const { paddingLeft, paddingRight } = getComputedStyle(contentContainerElement);
            overlayInner.style.top = `${correction}px`;
            overlayInner.style.paddingLeft = paddingLeft;
            overlayInner.style.paddingRight = paddingRight;
            // TODO
            overlayInner.style.backgroundColor = `white`;

            screenshot.forEach(node => overlayInner.append(node));

            const { scrollTop } = containerElement;

            overlayRef.current.style.top = `${startY - scrollTop}px`;

            return Promise.resolve();
        },
        async append(startY: number, endY: number) {
            if (wrapperRef.current == null) {
                return Promise.reject(new Error('Overlay not ready yet'));
            }
            if (overlayRef.current == null) {
                return Promise.reject(new Error('Overlay not ready yet'));
            }
            const containerElement = wrapperRef.current.firstElementChild;
            if (containerElement == null) {
                return Promise.reject(new Error('Unexpected ScrollView structure'));
            }
            const contentContainerElement = containerElement.firstElementChild;
            if (contentContainerElement == null) {
                return Promise.reject(new Error('Unexpected ScrollView structure'));
            }
            const overlayInner = overlayRef.current.firstElementChild;
            if (overlayInner == null) {
                return Promise.reject(new Error('Unexpected overlay structure'));
            }

            const { screenshot } = takeScreenshot(contentContainerElement, startY, endY);

            screenshot.forEach(node => overlayInner.append(node));

            return Promise.resolve();
        },
        moveAndHide(shiftY: number, duration: number = 100) {
            overlayInnerTranslationY.value = withTiming(shiftY, { duration }, hideOverlay);
        },
    }));

    return (
        <View ref={wrapperRef} style={[style, { position: 'relative' }]}>
            {children}
            <View
                ref={overlayRef}
                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, overflow: 'hidden' }}
            >
                <Animated.View
                    style={[{ position: 'absolute', left: 0, right: 0 }, overlayInnerStyle]}
                />
            </View>
        </View>
    );
});
