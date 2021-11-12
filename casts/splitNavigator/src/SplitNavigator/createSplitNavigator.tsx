import * as React from 'react';
import {
    useWindowDimensions,
    StyleSheet,
    View,
    ViewStyle,
    Platform,
    StyleProp,
    Animated,
    ImageSourcePropType,
    ImageRequireSource,
} from 'react-native';
import type { EventMapBase, NavigationState } from '@react-navigation/core';
import {
    NavigationHelpersContext,
    useNavigationBuilder,
    createNavigatorFactory,
    useTheme,
} from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { screensEnabled, ScreenContainer } from 'react-native-screens';
import { StackView } from '@react-navigation/stack';
import { NativeStackView } from 'react-native-screens/native-stack';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UIImage } from '@tonlabs/uikit.media';
import { ResourceSavingScene } from './ResourceSavingScene';
import { SafeAreaProviderCompat } from './SafeAreaProviderCompat';
import { SplitRouter, SplitActions, MAIN_SCREEN_NAME, SplitActionHelpers } from './SplitRouter';
import type { SplitNavigationState, SplitRouterOptions } from './SplitRouter';

export const NestedInSplitContext = React.createContext<{
    isSplitted: boolean;
}>({ isSplitted: false });

const getIsSplitted = ({ width }: { width: number }, mainWidth: number) => width > mainWidth;

function SceneContent({ isFocused, children }: { isFocused: boolean; children: React.ReactNode }) {
    const { colors } = useTheme();

    return (
        <View
            accessibilityElementsHidden={!isFocused}
            importantForAccessibility={isFocused ? 'auto' : 'no-hide-descendants'}
            style={[styles.content, { backgroundColor: colors.background }]}
        >
            {children}
        </View>
    );
}

const SplitTabBarHeightContext = React.createContext(0);

type SplitNavigatorProps = {
    children?: React.ReactNode;
    initialRouteName: string;
    mainWidth: number;
    screenOptions: {
        splitStyles?: {
            body?: StyleProp<ViewStyle>;
            main?: StyleProp<ViewStyle>;
            detail?: StyleProp<ViewStyle>;
        };
    } & SplitRouterOptions;
};

type SplitScreenTabBarIconOptions =
    | {
          tabBarActiveIcon: ImageSourcePropType;
          tabBarDisabledIcon: ImageSourcePropType;
      }
    | {
          tabBarIconLottieSource: ImageRequireSource;
      };
type SplitScreenOptions = SplitScreenTabBarIconOptions | Record<string, never>;

/**
 * TODO
 */
function LottieView(_props: {
    source: ImageSourcePropType;
    progress: Animated.Value;
    style: StyleProp<ViewStyle>;
}) {
    return null;
}

type SplitTabBarIconRef = {
    activate(): void;
    disable(): void;
};

type LottieIconViewProps = {
    defaultActiveState: boolean;
    source: ImageRequireSource;
};
const LottieIconView = React.forwardRef<SplitTabBarIconRef, LottieIconViewProps>(
    function LottieIconWrapper({ defaultActiveState, source }: LottieIconViewProps, ref) {
        const progress = React.useRef(new Animated.Value(defaultActiveState ? 1 : 0)).current;
        React.useImperativeHandle(ref, () => ({
            activate() {
                /**
                 * TODO: maybe linear is better to keep it in sync with the dot?
                 */
                Animated.spring(progress, {
                    toValue: 1,
                    useNativeDriver: true,
                });
            },
            disable() {
                Animated.spring(progress, {
                    toValue: 0,
                    useNativeDriver: true,
                });
            },
        }));

        return (
            <LottieView
                source={source}
                progress={progress}
                // TODO
                style={{ width: 22, height: 22 }}
            />
        );
    },
);

type ImageIconViewProps = {
    defaultActiveState: boolean;
    activeSource: ImageSourcePropType;
    disabledSource: ImageSourcePropType;
};
const ImageIconView = React.forwardRef<SplitTabBarIconRef, ImageIconViewProps>(
    function ImageIconView(
        { defaultActiveState, activeSource, disabledSource }: ImageIconViewProps,
        ref,
    ) {
        const [active, setActive] = React.useState(defaultActiveState);
        React.useImperativeHandle(ref, () => ({
            activate() {
                setActive(true);
            },
            disable() {
                setActive(false);
            },
        }));

        return (
            <UIImage
                source={active ? activeSource : disabledSource}
                // TODO
                style={{ width: 22, height: 22 }}
            />
        );
    },
);

function SplitBottomTabBar({
    icons,
    setTabBarHeight,
    activeKey,
}: {
    icons: Record<string, SplitScreenTabBarIconOptions>;
    setTabBarHeight: (height: number) => void;
    activeKey: string;
}) {
    const insets = useSafeAreaInsets();

    React.useEffect(() => {
        setTabBarHeight(Math.max(insets?.bottom, 32 /* TODO */) + 64 /* TODO */);
    }, [insets?.bottom, setTabBarHeight]);

    const iconsRefs = React.useRef<Record<string, React.RefObject<SplitTabBarIconRef>>>({});

    const prevActiveKey = React.useRef(activeKey);
    React.useEffect(() => {
        if (activeKey === prevActiveKey.current) {
            return;
        }

        prevActiveKey.current = activeKey;
        iconsRefs.current[prevActiveKey.current]?.current?.disable();
        iconsRefs.current[activeKey]?.current?.activate();
        // TODO: move the dot
    }, [activeKey]);

    /**
     * Do not show tab bar when there're only
     * 0 or 1 icon available, as it won't do anything useful anyway
     */
    if (Object.keys(icons).length < 2) {
        return null;
    }

    return (
        <View
            // TODO
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                paddingBottom: Math.max(insets?.bottom, 32 /* TODO */),
                flexDirection: 'row',
                justifyContent: 'center',
            }}
            pointerEvents="box-none"
            // TODO
            onLayout={({
                nativeEvent: {
                    layout: { height },
                },
            }) => {
                setTabBarHeight(height);
            }}
        >
            <View>
                {Object.keys(icons).map(key => {
                    const icon = icons[key];
                    if (iconsRefs.current[key] == null) {
                        iconsRefs.current[key] = React.createRef<SplitTabBarIconRef>();
                    }
                    if ('tabBarIconLottieSource' in icon) {
                        return (
                            <View
                                // TODO
                                style={{
                                    height: 64,
                                    width: 64,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <LottieIconView
                                    ref={iconsRefs.current[key]}
                                    source={icon.tabBarIconLottieSource}
                                    defaultActiveState={key === activeKey}
                                />
                            </View>
                        );
                    }
                    return (
                        <View
                            // TODO
                            style={{
                                height: 64,
                                width: 64,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <ImageIconView
                                ref={iconsRefs.current[key]}
                                activeSource={icon.tabBarActiveIcon}
                                disabledSource={icon.tabBarDisabledIcon}
                                defaultActiveState={key === activeKey}
                            />
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

export function SplitNavigator({
    children,
    initialRouteName,
    mainWidth,
    screenOptions,
}: SplitNavigatorProps) {
    const dimensions = useWindowDimensions();
    const isSplitted = getIsSplitted(dimensions, mainWidth);
    const doesSupportNative = Platform.OS !== 'web' && screensEnabled?.();

    const { splitStyles: splitStylesFromOptions, ...restScreenOptions } = screenOptions || {};
    const splitStyles = splitStylesFromOptions || {
        body: styles.body,
        main: styles.main,
        detail: styles.detail,
    };
    // TODO: optimise me!
    const { tabRouteNames, stackRouteNames } = React.Children.toArray(children).reduce<{
        tabRouteNames: string[];
        stackRouteNames: string[];
    }>(
        (acc, child) => {
            if (React.isValidElement(child)) {
                if (
                    'tabBarActiveIcon' in child.props ||
                    'tabBarIconLottieSource' in child.props ||
                    child.props.name === MAIN_SCREEN_NAME
                ) {
                    acc.tabRouteNames.push(child.props.name);
                } else {
                    acc.stackRouteNames.push(child.props.name);
                }
            }
            return acc;
        },
        {
            tabRouteNames: [],
            stackRouteNames: [],
        },
    );
    const { state, navigation, descriptors } = useNavigationBuilder<
        SplitNavigationState,
        SplitRouterOptions,
        SplitActionHelpers,
        SplitScreenOptions,
        NavigationProp<ParamListBase>
    >(SplitRouter, {
        children,
        initialRouteName,
        screenOptions: {
            ...restScreenOptions,
            // @ts-ignore it's doesn't exist in our options
            // but it's needed to turn of header in react-native-screens
            headerShown: false,
        },
        tabRouteNames,
        stackRouteNames,
        isSplitted,
    });
    console.log(state);
    console.log(descriptors);

    React.useEffect(() => {
        navigation.dispatch(
            SplitActions.setSplitted(isSplitted, isSplitted ? initialRouteName : MAIN_SCREEN_NAME),
        );
    }, [isSplitted, initialRouteName, navigation]);

    const [loaded, setLoaded] = React.useState<Array<number>>([]);

    React.useEffect(() => {
        if (!loaded.includes(state.index)) {
            setLoaded([...loaded, state.index]);
        }
    }, [state, loaded]);

    const [tabBarHeight, setTabBarHeight] = React.useState(0);

    // Access it from the state to re-render a container
    // only when router has processed SET_SPLITTED action

    if (state.isSplitted) {
        const mainRoute = state.routes.find(
            ({ name }: { name: string }) => name === MAIN_SCREEN_NAME,
        );
        if (mainRoute == null) {
            throw new Error(`You should provide ${MAIN_SCREEN_NAME} screen!`);
        }
        const tabBarIcons = Object.keys(descriptors).reduce<
            Record<string, SplitScreenTabBarIconOptions>
        >((acc, key) => {
            if (key === mainRoute.key) {
                return acc;
            }

            const descriptor = descriptors[key];
            if (descriptor.options == null) {
                return acc;
            }
            if ('tabBarActiveIcon' in descriptor.options) {
                acc[key] = {
                    tabBarActiveIcon: descriptor.options.tabBarActiveIcon,
                    tabBarDisabledIcon: descriptor.options.tabBarDisabledIcon,
                };
            }
            if ('tabBarIconLottieSource' in descriptor.options) {
                acc[key] = {
                    tabBarIconLottieSource: descriptor.options.tabBarIconLottieSource,
                };
            }

            return acc;
        }, {});

        return (
            <NavigationHelpersContext.Provider value={navigation}>
                <NestedInSplitContext.Provider value={{ isSplitted }}>
                    <SafeAreaProviderCompat>
                        <View style={splitStyles.body}>
                            <View style={splitStyles.main}>
                                <SplitTabBarHeightContext.Provider value={tabBarHeight}>
                                    {descriptors[mainRoute.key].render()}
                                </SplitTabBarHeightContext.Provider>
                                <SplitBottomTabBar
                                    icons={tabBarIcons}
                                    setTabBarHeight={setTabBarHeight}
                                    activeKey={state.routes[state.tabIndex].key}
                                />
                            </View>
                            <View style={splitStyles.detail}>
                                <ScreenContainer
                                    // If not disabling the container for native, it will crash on iOS.
                                    // It happens due to an error in `react-native-reanimated`:
                                    // https://github.com/software-mansion/react-native-reanimated/issues/216
                                    enabled={!doesSupportNative}
                                    style={styles.pages}
                                >
                                    {state.routes.map((route, index) => {
                                        const descriptor = descriptors[route.key];
                                        const isFocused = state.tabIndex === index;

                                        // Do not render main route
                                        if (route.key === mainRoute.key) {
                                            return null;
                                        }

                                        // isFocused check is important here
                                        // as we can try to render a screen before it was put
                                        // to `loaded` screens
                                        if (!loaded.includes(index) && !isFocused) {
                                            // Don't render a screen if we've never navigated to it
                                            return null;
                                        }

                                        return (
                                            <ResourceSavingScene
                                                key={route.key}
                                                style={StyleSheet.absoluteFill}
                                                isVisible={isFocused}
                                            >
                                                <SceneContent isFocused={isFocused}>
                                                    {descriptor.render()}
                                                </SceneContent>
                                            </ResourceSavingScene>
                                        );
                                    })}
                                </ScreenContainer>
                            </View>
                        </View>
                    </SafeAreaProviderCompat>
                </NestedInSplitContext.Provider>
            </NavigationHelpersContext.Provider>
        );
    }

    const tabBarIcons = Object.keys(descriptors).reduce<
        Record<string, SplitScreenTabBarIconOptions>
    >((acc, key) => {
        const descriptor = descriptors[key];
        if (descriptor.options == null) {
            return acc;
        }
        if ('tabBarActiveIcon' in descriptor.options) {
            acc[key] = {
                tabBarActiveIcon: descriptor.options.tabBarActiveIcon,
                tabBarDisabledIcon: descriptor.options.tabBarDisabledIcon,
            };
        }
        if ('tabBarIconLottieSource' in descriptor.options) {
            acc[key] = {
                tabBarIconLottieSource: descriptor.options.tabBarIconLottieSource,
            };
        }

        return acc;
    }, {});
    const stackDescriptors = state.routes.reduce<typeof descriptors>((acc, route, index) => {
        const descriptor = descriptors[route.key];
        if (state.nestedStack && state.nestedStack.includes(index)) {
            acc[route.key] = descriptor;
        }
        return acc;
    }, {});
    return (
        <NavigationHelpersContext.Provider value={navigation}>
            <NestedInSplitContext.Provider value={{ isSplitted }}>
                <SafeAreaProviderCompat>
                    <ScreenContainer
                        // If not disabling the container for native, it will crash on iOS.
                        // It happens due to an error in `react-native-reanimated`:
                        // https://github.com/software-mansion/react-native-reanimated/issues/216
                        enabled={!doesSupportNative}
                        style={styles.pages}
                    >
                        {state.routes.map((route, index) => {
                            const descriptor = descriptors[route.key];
                            const isFocused = state.tabIndex === index;

                            // isFocused check is important here
                            // as we can try to render a screen before it was put
                            // to `loaded` screens
                            if (!loaded.includes(index) && !isFocused) {
                                // Don't render a screen if we've never navigated to it
                                return null;
                            }

                            if (route.name === MAIN_SCREEN_NAME) {
                                if (state.nestedStack == null) {
                                    return null;
                                }
                                if (doesSupportNative) {
                                    return (
                                        <ResourceSavingScene
                                            key={route.key}
                                            style={StyleSheet.absoluteFill}
                                            isVisible={isFocused}
                                        >
                                            <SceneContent isFocused={isFocused}>
                                                <NestedInSplitContext.Provider
                                                    value={{ isSplitted }}
                                                >
                                                    <SplitTabBarHeightContext.Provider
                                                        value={tabBarHeight}
                                                    >
                                                        <NativeStackView
                                                            state={{
                                                                stale: false,
                                                                type: 'stack',
                                                                key: state.key.replace(
                                                                    'split',
                                                                    'stack',
                                                                ),
                                                                index: state.nestedStack.length - 1,
                                                                routeNames: stackRouteNames,
                                                                routes: state.nestedStack.map(
                                                                    routeIndex => {
                                                                        return state.routes[
                                                                            routeIndex
                                                                        ];
                                                                    },
                                                                ),
                                                            }}
                                                            navigation={navigation}
                                                            // @ts-ignore
                                                            descriptors={stackDescriptors}
                                                        />
                                                    </SplitTabBarHeightContext.Provider>
                                                </NestedInSplitContext.Provider>
                                            </SceneContent>
                                        </ResourceSavingScene>
                                    );
                                }

                                return (
                                    <ResourceSavingScene
                                        key={route.key}
                                        style={StyleSheet.absoluteFill}
                                        isVisible={isFocused}
                                    >
                                        <SceneContent isFocused={isFocused}>
                                            <NestedInSplitContext.Provider value={{ isSplitted }}>
                                                <SplitTabBarHeightContext.Provider
                                                    value={tabBarHeight}
                                                >
                                                    {/* @ts-ignore */}
                                                    <StackView
                                                        headerMode="none"
                                                        state={{
                                                            stale: false,
                                                            type: 'stack',
                                                            key: state.key.replace(
                                                                'split',
                                                                'stack',
                                                            ),
                                                            index: state.nestedStack.length - 1,
                                                            routeNames: stackRouteNames,
                                                            routes: state.nestedStack.map(
                                                                routeIndex => {
                                                                    return state.routes[routeIndex];
                                                                },
                                                            ),
                                                        }}
                                                        navigation={navigation}
                                                        // @ts-ignore
                                                        descriptors={stackDescriptors}
                                                    />
                                                </SplitTabBarHeightContext.Provider>
                                            </NestedInSplitContext.Provider>
                                        </SceneContent>
                                    </ResourceSavingScene>
                                );
                            }

                            if (stackDescriptors[route.key] != null) {
                                return null;
                            }

                            return (
                                <ResourceSavingScene
                                    key={route.key}
                                    style={StyleSheet.absoluteFill}
                                    isVisible={isFocused}
                                >
                                    <SceneContent isFocused={isFocused}>
                                        <SplitTabBarHeightContext.Provider value={tabBarHeight}>
                                            {descriptor.render()}
                                        </SplitTabBarHeightContext.Provider>
                                    </SceneContent>
                                </ResourceSavingScene>
                            );
                        })}
                    </ScreenContainer>
                    <SplitBottomTabBar
                        icons={tabBarIcons}
                        setTabBarHeight={setTabBarHeight}
                        activeKey={state.routes[state.tabIndex].key}
                    />
                </SafeAreaProviderCompat>
            </NestedInSplitContext.Provider>
        </NavigationHelpersContext.Provider>
    );
}

export const createSplitNavigator = createNavigatorFactory<
    NavigationState,
    SplitScreenOptions,
    EventMapBase,
    React.ComponentType<any>
>(SplitNavigator);

const styles = StyleSheet.create({
    body: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
    },
    main: {
        backgroundColor: 'white',
        minWidth: 300,
        marginRight: 10,
        borderRadius: 5,
    },
    detail: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
    },
    pages: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});
