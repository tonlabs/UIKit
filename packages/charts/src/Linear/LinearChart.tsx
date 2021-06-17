import * as React from 'react';
import { View, StyleSheet, LayoutChangeEvent, ViewStyle } from 'react-native';
import Svg, { Path as SvgPath } from 'react-native-svg';
import Animated, { runOnUI } from 'react-native-reanimated';
import { Path, serialize } from 'react-native-redash';
import { UILabel, TypographyVariants } from '@tonlabs/uikit.hydrogen';
import { addNativeProps } from '../Utils';
import {
    convertDataToPath,
    interpolatePath,
    getScaledData,
    getControlPoints,
    ControlPoints,
} from './linearChartUtils';

Animated.addWhitelistedNativeProps({ text: true, value: true });

const STROKE_WIDTH: number = 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 40,
    },
    chartСontainer: {
        flex: 1,
        overflow: 'visible',
    },
    labelContainer: {
        position: 'absolute',
        top: -8,
        height: 16,
        width: 40,
        paddingHorizontal: 4,
    },
    leftLabelContainer: {
        left: 0,
    },
    rightLabelContainer: {
        right: 0,
    },
    maximumLabelArea: {
        position: 'absolute',
        top: -20,
        left: 40,
        right: 40,
        height: 20,
    },
    maximumLabelContainer: {
        position: 'absolute',
        top: 0,
        left: -25,
        height: 16,
        width: 50,
        paddingHorizontal: 4,
        alignItems: 'center',
        borderWidth: 1,
    },
    minimumLabelArea: {
        position: 'absolute',
        bottom: -20,
        left: 40,
        right: 40,
        height: 20,
    },
    minimumLabelContainer: {
        position: 'absolute',
        top: 0,
        left: -25,
        height: 16,
        width: 50,
        paddingHorizontal: 4,
        alignItems: 'center',
        borderWidth: 1,
    },
});

export type Dimensions = {
    width: number;
    height: number;
};
const initialDimensions: Dimensions = {
    width: 0,
    height: 0,
};

const withSpringConfig: Animated.WithSpringConfig = {
    damping: 100,
    stiffness: 200,
};

const getOppositeProgressTarget = (progressTarget: number): number => {
    'worklet';

    return progressTarget ? 0 : 1;
};

export type Point = {
    x: number;
    y: number;
};

type IProps = {
    data: Point[];
    testID?: string;
};

const AnimatedPath = Animated.createAnimatedComponent(addNativeProps(SvgPath));
const AnimatedSvg = Animated.createAnimatedComponent(addNativeProps(Svg));

type LabelData = {
    leftLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    leftLabelStyle: Animated.AnimatedStyleProp<ViewStyle>;
    rightLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    rightLabelStyle: Animated.AnimatedStyleProp<ViewStyle>;
    maximumLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    maximumLabelStyle: Animated.AnimatedStyleProp<ViewStyle>;
    minimumLabelContainerStyle: Animated.AnimatedStyleProp<ViewStyle>;
    minimumLabelStyle: Animated.AnimatedStyleProp<ViewStyle>;
    maximumValue: string;
    minimumValue: string;
};
const useLabelData = (
    dimensions: Animated.SharedValue<Dimensions>,
    data: Point[],
): LabelData => {
    const scaledData = Animated.useDerivedValue<Point[] | null>(() => {
        return getScaledData(data, dimensions.value);
    }, [data]);

    const controlPoints = Animated.useDerivedValue<ControlPoints | null>(() => {
        return getControlPoints(data, scaledData.value, STROKE_WIDTH);
    }, [data]);

    const maximum = Animated.useDerivedValue<number | null>(() => {
        if (controlPoints.value === null) {
            return null;
        }
        return controlPoints.value.maximum.value;
    });
    const minimum = Animated.useDerivedValue<number | null>(() => {
        if (controlPoints.value === null) {
            return null;
        }
        return controlPoints.value.minimum.value;
    });

    const minimumLabelXCoordinate = Animated.useSharedValue<number>(0);
    const maximumLabelXCoordinate = Animated.useSharedValue<number>(0);
    const startLabelYCoordinate = Animated.useSharedValue<number>(0);
    const endLabelYCoordinate = Animated.useSharedValue<number>(0);

    type Reaction = {
        dimensions: Dimensions;
        controlPoints: ControlPoints | null;
    };
    Animated.useAnimatedReaction(
        () => {
            return {
                dimensions: dimensions.value,
                controlPoints: controlPoints.value,
            };
        },
        (current: Reaction, previous: Reaction | null) => {
            if (current.controlPoints === null) {
                return;
            }
            if (
                !previous ||
                current.dimensions.width !== previous.dimensions.width ||
                current.dimensions.height !== previous.dimensions.height ||
                !previous.controlPoints
            ) {
                minimumLabelXCoordinate.value = current.controlPoints.minimum.x;
                maximumLabelXCoordinate.value = current.controlPoints.maximum.x;
                startLabelYCoordinate.value = current.controlPoints.start.y;
                endLabelYCoordinate.value = current.controlPoints.end.y;
            } else {
                minimumLabelXCoordinate.value = Animated.withSpring(
                    current.controlPoints.minimum.x,
                    withSpringConfig,
                );
                maximumLabelXCoordinate.value = Animated.withSpring(
                    current.controlPoints.maximum.x,
                    withSpringConfig,
                );
                startLabelYCoordinate.value = Animated.withSpring(
                    current.controlPoints.start.y,
                    withSpringConfig,
                );
                endLabelYCoordinate.value = Animated.withSpring(
                    current.controlPoints.end.y,
                    withSpringConfig,
                );
            }
        },
        [controlPoints.value, dimensions.value],
    );

    const leftLabelContainerStyle = Animated.useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY:
                        startLabelYCoordinate.value === null
                            ? 0
                            : startLabelYCoordinate.value,
                },
            ],
        };
    });
    const leftLabelStyle = Animated.useAnimatedStyle(() => {
        return {
            opacity: startLabelYCoordinate.value === null ? 0 : 1,
        };
    });

    const rightLabelContainerStyle = Animated.useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY:
                        endLabelYCoordinate.value === null
                            ? 0
                            : endLabelYCoordinate.value,
                },
            ],
        };
    });
    const rightLabelStyle = Animated.useAnimatedStyle(() => {
        return {
            opacity: endLabelYCoordinate.value === null ? 0 : 1,
        };
    });

    const maximumLabelContainerStyle = Animated.useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX:
                        maximumLabelXCoordinate.value === null
                            ? 0
                            : maximumLabelXCoordinate.value,
                },
            ],
        };
    });
    const maximumLabelStyle = Animated.useAnimatedStyle(() => {
        return {
            opacity: maximumLabelXCoordinate.value === null ? 0 : 1,
        };
    });

    const minimumLabelContainerStyle = Animated.useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX:
                        minimumLabelXCoordinate.value === null
                            ? 0
                            : minimumLabelXCoordinate.value,
                },
            ],
        };
    });
    const minimumLabelStyle = Animated.useAnimatedStyle(() => {
        return {
            opacity: minimumLabelXCoordinate.value === null ? 0 : 1,
        };
    });

    const maximumText = Animated.useDerivedValue(() => {
        'worklet';

        return maximum.value ? maximum.value.toFixed(1) : '';
    }, []);
    const minimumText = Animated.useDerivedValue(() => {
        'worklet';

        return minimum.value ? minimum.value.toFixed(1) : 'Empty';
    }, []);

    const [minimumValue, setMinimumValue] = React.useState<string>('');
    const [maximumValue, setMaximumValue] = React.useState<string>('');

    Animated.useAnimatedReaction(
        () => minimumText.value,
        (text: string) => {
            Animated.runOnJS(setMinimumValue)(text);
        },
    );

    Animated.useAnimatedReaction(
        () => maximumText.value,
        (text: string) => {
            Animated.runOnJS(setMaximumValue)(text);
        },
    );

    return {
        leftLabelStyle,
        leftLabelContainerStyle,
        rightLabelStyle,
        rightLabelContainerStyle,
        maximumLabelContainerStyle,
        maximumLabelStyle,
        minimumLabelContainerStyle,
        minimumLabelStyle,
        maximumValue,
        minimumValue,
    };
};

const useAnimatedPathProps = (
    dimensions: Animated.SharedValue<Dimensions>,
    data: Point[],
): Partial<{
    d: string;
}> => {
    const progress = Animated.useSharedValue<number>(0);
    const progressTarget = Animated.useSharedValue<number>(0);

    const intermediatePath = Animated.useSharedValue<Path | null>(null);

    const targetPath = Animated.useDerivedValue(() => {
        'worklet';

        return convertDataToPath(data, dimensions.value, STROKE_WIDTH);
    }, [data, dimensions]);

    const currentPath = Animated.useDerivedValue<Path | null>(() => {
        'worklet';

        if (targetPath.value === null) {
            return null;
        }

        return interpolatePath(
            progress.value,
            [
                getOppositeProgressTarget(progressTarget.value),
                progressTarget.value,
            ],
            [
                intermediatePath.value
                    ? intermediatePath.value
                    : targetPath.value,
                targetPath.value,
            ],
            Animated.Extrapolate.CLAMP,
        );
    });

    React.useEffect(() => {
        runOnUI(() => {
            'worklet';

            progress.value = progressTarget.value;
            progressTarget.value = getOppositeProgressTarget(
                progressTarget.value,
            );
            intermediatePath.value = currentPath.value;

            if (!dimensions.value.width || !dimensions.value.height) {
                progress.value = progressTarget.value;
            } else {
                progress.value = Animated.withSpring(
                    progressTarget.value,
                    withSpringConfig,
                );
            }
        })();
    }, [
        data,
        progressTarget,
        intermediatePath,
        currentPath,
        progress,
        dimensions,
    ]);

    const animatedPathProps = Animated.useAnimatedProps(() => {
        'worklet';

        if (currentPath.value === null) {
            return {
                d: '',
            };
        }
        return {
            d: serialize(currentPath.value),
        };
    }, [currentPath]);

    return animatedPathProps;
};

export const LinearChart: React.FC<IProps> = (props: IProps) => {
    const { data } = props;
    const dimensions = Animated.useSharedValue<Dimensions>({
        ...initialDimensions,
    });

    const onLayout = React.useCallback(
        (event: LayoutChangeEvent): void => {
            if (
                event.nativeEvent.layout.height !== dimensions.value.height ||
                event.nativeEvent.layout.width !== dimensions.value.width
            ) {
                dimensions.value = {
                    height: event.nativeEvent.layout.height - STROKE_WIDTH,
                    width: event.nativeEvent.layout.width - STROKE_WIDTH,
                };
            }
        },
        [dimensions],
    );

    const animatedPathProps: Partial<{
        d: string;
    }> = useAnimatedPathProps(dimensions, data);

    const labelData: LabelData = useLabelData(dimensions, data);

    const animatedSvgProps = Animated.useAnimatedProps(() => {
        'worklet';

        return {
            width: dimensions.value.width + STROKE_WIDTH,
            height: dimensions.value.height + STROKE_WIDTH,
        };
    });

    return (
        <View testID={props.testID} style={styles.container}>
            <View onLayout={onLayout} style={styles.chartСontainer}>
                <AnimatedSvg
                    animatedProps={animatedSvgProps}
                    style={{
                        overflow: 'visible',
                    }}
                >
                    <AnimatedPath
                        animatedProps={animatedPathProps}
                        fill="transparent"
                        stroke="#367be2"
                        strokeWidth={STROKE_WIDTH}
                    />
                </AnimatedSvg>
            </View>
            <Animated.View
                style={[
                    styles.labelContainer,
                    styles.leftLabelContainer,
                    labelData.leftLabelContainerStyle,
                ]}
            >
                <Animated.View style={[labelData.leftLabelStyle]}>
                    <UILabel role={TypographyVariants.ParagraphLabel}>
                        {data[0].y.toFixed(1)}
                    </UILabel>
                </Animated.View>
            </Animated.View>
            <Animated.View
                style={[
                    styles.labelContainer,
                    styles.rightLabelContainer,
                    labelData.rightLabelContainerStyle,
                ]}
            >
                <Animated.View style={[labelData.rightLabelStyle]}>
                    <UILabel
                        role={TypographyVariants.ParagraphLabel}
                        numberOfLines={1}
                    >
                        {data[data.length - 1].y.toFixed(1)}
                    </UILabel>
                </Animated.View>
            </Animated.View>
            <View style={styles.maximumLabelArea}>
                <Animated.View
                    style={[
                        styles.maximumLabelContainer,
                        labelData.maximumLabelContainerStyle,
                    ]}
                >
                    <Animated.View style={labelData.maximumLabelStyle}>
                        <UILabel
                            role={TypographyVariants.ParagraphLabel}
                            numberOfLines={1}
                        >
                            {labelData.maximumValue}
                        </UILabel>
                    </Animated.View>
                </Animated.View>
            </View>
            <View style={styles.minimumLabelArea}>
                <Animated.View
                    style={[
                        styles.minimumLabelContainer,
                        labelData.minimumLabelContainerStyle,
                    ]}
                >
                    <Animated.View style={labelData.minimumLabelStyle}>
                        <UILabel
                            role={TypographyVariants.ParagraphLabel}
                            numberOfLines={1}
                        >
                            {labelData.minimumValue}
                        </UILabel>
                    </Animated.View>
                </Animated.View>
            </View>
        </View>
    );
};
