import * as React from 'react';
import { nanoid } from 'nanoid';

import {
    ColorValue,
    Image as RNImage,
    ImageStyle,
    ImageURISource,
    LayoutChangeEvent,
    LayoutRectangle,
    StyleProp,
    StyleSheet,
    View,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { useTheme } from '@tonlabs/uikit.themes';

import type { UIImageProps, UIImageSimpleProps } from './types';
import { useFlippedImageIfRtl } from './hooks';

export function prefetch(content: ImageURISource[] | ImageURISource): void {
    if (!content || (Array.isArray(content) && content.length === 0)) {
        /**
         * Nothing to prefetch
         */
        return;
    }

    if (Array.isArray(content)) {
        content.forEach((contentItem: ImageURISource): void => {
            if (contentItem.uri) {
                RNImage.prefetch(contentItem.uri);
            }
        });
    } else if (content.uri) {
        RNImage.prefetch(content.uri);
    }
}

const useImageDimensions = (style: StyleProp<ImageStyle>, source: any) => {
    return React.useMemo(() => {
        let width: number | string | undefined;
        let height: number | string | undefined;
        const flatStyle = StyleSheet.flatten(style);
        if (flatStyle) {
            if (flatStyle.width) {
                width = flatStyle.width;
            }
            if (flatStyle.height) {
                height = flatStyle.height;
            }
        }
        if (!width && source && source.width) {
            width = source.width;
        }
        if (!height && source && source.height) {
            height = source.height;
        }
        return {
            width,
            height,
        };
    }, [source, style]);
};

const TintUIImage = React.forwardRef<View, UIImageSimpleProps>(function TintUIImage(
    { tintColor, style, onLoadEnd, ...rest }: UIImageSimpleProps,
    ref,
) {
    const isMounted = React.useRef<boolean>(false);
    const idRef = React.useRef(nanoid());
    const [hasError, setHasError] = React.useState<boolean>(false);
    const [dimensions, setDimensions] = React.useState<LayoutRectangle | null>(null);

    const localRef = React.useRef<View>(null);
    const canvasCtxHolder = React.useRef<CanvasRenderingContext2D>();

    const imgRef = React.useRef<HTMLImageElement>(new Image());

    React.useImperativeHandle(ref, () => ({
        setNativeProps(nativeProps: { style?: { tintColor?: ColorValue } }) {
            if (
                nativeProps.style != null &&
                nativeProps.style.tintColor != null &&
                canvasCtxHolder.current != null &&
                dimensions != null
            ) {
                /**
                 * We redraw the image because if we re-apply the fill
                 * with a color with transparency,it leads to an increase
                 * in the transparency of the image
                 * (it seems that the transparency values are multiplied)
                 */
                canvasCtxHolder.current.clearRect(0, 0, dimensions.width, dimensions.height);
                canvasCtxHolder.current.globalCompositeOperation = 'copy';
                canvasCtxHolder.current.drawImage(
                    imgRef.current,
                    0,
                    0,
                    dimensions.width,
                    dimensions.height,
                );
                canvasCtxHolder.current.globalCompositeOperation = 'source-in';
                canvasCtxHolder.current.fillStyle = nativeProps.style.tintColor as string;
                canvasCtxHolder.current.fillRect(0, 0, dimensions.width, dimensions.height);
            }
            return localRef.current?.setNativeProps(nativeProps);
        },
        measure(...args) {
            return localRef.current?.measure(...args);
        },
        measureInWindow(...args) {
            return localRef.current?.measureInWindow(...args);
        },
        measureLayout(...args) {
            return localRef.current?.measureLayout(...args);
        },
        focus(...args) {
            return localRef.current?.focus(...args);
        },
        blur(...args) {
            return localRef.current?.blur(...args);
        },
        // @ts-ignore
        get refs() {
            return localRef.current?.refs;
        },
    }));

    React.useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    const source = rest.source as any;

    const { uri } = source;
    const { width, height } = useImageDimensions(style, source);

    const onLayout = (event: LayoutChangeEvent) => {
        if (rest.onLayout) {
            rest.onLayout(event);
        }
        if (isMounted.current) {
            setDimensions(event.nativeEvent.layout);
        }
    };

    React.useEffect(() => {
        if (!tintColor || !width || !height || !uri) {
            if (isMounted.current) {
                setHasError(true);
            }
            return;
        }

        const currentCanvas = document.getElementById(`${idRef.current}`) as HTMLCanvasElement;
        if (!currentCanvas || !currentCanvas.getContext) {
            if (isMounted.current) {
                setHasError(true);
            }
            return;
        }

        const ctx: CanvasRenderingContext2D | null = currentCanvas.getContext('2d');
        if (!ctx) {
            if (isMounted.current) {
                setHasError(true);
            }
            return;
        }

        imgRef.current.onload = () => {
            if (!ctx || !dimensions) {
                return;
            }

            currentCanvas.style.width = `${dimensions.width}px`;
            currentCanvas.style.height = `${dimensions.height}px`;

            // https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#correcting_resolution_in_a_canvas
            const scale = window.devicePixelRatio;

            currentCanvas.width = Math.floor(dimensions.width * scale);
            currentCanvas.height = Math.floor(dimensions.height * scale);

            ctx.scale(scale, scale);

            // draw image
            ctx.drawImage(imgRef.current, 0, 0, dimensions.width, dimensions.height);
            // set composite mode
            ctx.globalCompositeOperation = 'source-in';
            // draw color
            ctx.fillStyle = tintColor as string;
            ctx.fillRect(0, 0, dimensions.width, dimensions.height);

            if (onLoadEnd) {
                onLoadEnd();
            }

            // It's in the very end, to not apply animated tint color
            // until image isn't loaded
            canvasCtxHolder.current = ctx;
        };
        imgRef.current.src = uri;
    }, [uri, dimensions, tintColor, width, height, onLoadEnd]);

    if (hasError || !tintColor || !width || !height || !uri) {
        if (__DEV__) {
            console.error(
                `UIImage.web.tsx: there was tintColor provided for image, ` +
                    `but no width and height specified, please ensure that they're passed ` +
                    `in the styles or in the source correctly.` +
                    `${rest.testID ? `TestID: ${rest.testID}` : ''}`,
            );
        }
        return React.createElement(RNImage, rest);
    }

    return (
        <View
            ref={localRef}
            testID={rest.testID}
            onLayout={onLayout}
            style={[
                style,
                {
                    width,
                    height,
                },
            ]}
        >
            <canvas id={`${idRef.current}`} width={dimensions?.width} height={dimensions?.height} />
        </View>
    );
});

const UIImageSimple = React.forwardRef<RNImage, UIImageSimpleProps>(function UIImageSimple(
    props,
    ref,
) {
    const { tintColor, style, ...rest } = props;

    const maybeFlippedImageStyle = useFlippedImageIfRtl(style);

    /**
     * Delete TintUIImage and "if" block below when the issue is fixed:
     * https://github.com/necolas/react-native-web/issues/1914
     */
    if (tintColor) {
        return <TintUIImage ref={ref} {...props} style={maybeFlippedImageStyle} />;
    }

    return <RNImage ref={ref} {...rest} style={maybeFlippedImageStyle} />;
});

export const UIImage = React.memo(
    React.forwardRef<RNImage, UIImageProps>(function UIImageForwarded(props, ref) {
        const theme = useTheme();

        return React.createElement(UIImageSimple, {
            ...props,
            ref,
            tintColor: props.tintColor != null ? theme[props.tintColor] : null,
        });
    }),
);

export const UIAnimatedImage = Animated.createAnimatedComponent(UIImageSimple);
