import * as React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { UIMaterialTextView } from '@tonlabs/uikit.inputs';
import { UIBackgroundView, UILabel, UILabelColors, ColorVariants } from '@tonlabs/uikit.themes';
import { createStackNavigator } from '@tonlabs/uicast.stack-navigator';
import { ScrollView, FlatList } from '@tonlabs/uikit.scrolls';

const CHECK_TITLE = false;

function LargeHeaderExample() {
    const navigation = useNavigation();
    return (
        <ScrollView>
            {/* To check titles */}
            {CHECK_TITLE && (
                <UIMaterialTextView
                    label="Title"
                    defaultValue="Very long title"
                    onChangeText={title => {
                        if (typeof title === 'string' && title) {
                            navigation.setOptions({
                                title,
                            });
                        }
                    }}
                />
            )}
            {new Array(9)
                .fill(null)
                .map((_el, i) => (i + 1) / 10)
                .map(opacity => (
                    <View
                        key={opacity}
                        style={{
                            height: 100,
                            backgroundColor: `rgba(255,0,0,${opacity})`,
                        }}
                    />
                ))}
        </ScrollView>
    );
}

function LargeHeaderExampleFlatList() {
    return (
        <FlatList
            style={{ backgroundColor: 'blue' }}
            renderItem={({ item: opacity }) => (
                <View
                    key={opacity}
                    style={{
                        height: 100,
                        backgroundColor: `rgba(255,0,0,${opacity})`,
                    }}
                />
            )}
            data={new Array(100).fill(null).map((_el, i) => (i + 1) / 100)}
        />
    );
}

const LargeHeaderStack = createStackNavigator();

function refresh() {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve(undefined);
        }, 1000);
    });
}

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderBelowContent = () => {
    return (
        <UIBackgroundView
            color={ColorVariants.BackgroundNegative}
            style={{
                padding: 10,
                borderRadius: 10,
                marginVertical: 8,
            }}
        >
            <UILabel color={UILabelColors.TextPrimaryInverted}>
                A thing happened and it takes three whole lines to explain that it happened. This
                isn’t likely in English but maybe in German. A thing happened and it takes three
                whole lines to explain that it happened. This isn’t likely in English but maybe in
                German. A thing happened and it takes three whole lines to explain that it happened.
                This isn’t likely in English but maybe in German.
            </UILabel>
        </UIBackgroundView>
    );
};

export function LargeHeaderScreen() {
    return (
        <LargeHeaderStack.Navigator initialRouteName="scroll-view">
            <LargeHeaderStack.Screen
                name="scroll-view"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'Very long title',
                    // onTitlePress: () => {
                    //     console.log('sdfsdf');
                    // },
                    // caption: 'caption',
                    // headerRightItems: [
                    //     {
                    //         label: 'Action1',
                    //         onPress: () => {},
                    //     },
                    //     {
                    //         label: 'Action2',
                    //         onPress: () => {},
                    //     },
                    // ],
                    onRefresh: refresh,
                    // renderBelowContent,
                }}
                component={LargeHeaderExample}
            />
            <LargeHeaderStack.Screen
                name="flat-list"
                options={{
                    useHeaderLargeTitle: true,
                    title: 'Very long title',
                    // onTitlePress: () => {
                    //     console.log('sdfsdf');
                    // },
                    // caption: 'caption',
                    // headerRightItems: [
                    //     {
                    //         label: 'Action1',
                    //         onPress: () => {},
                    //     },
                    //     {
                    //         label: 'Action2',
                    //         onPress: () => {},
                    //     },
                    // ],
                }}
                component={LargeHeaderExampleFlatList}
            />
        </LargeHeaderStack.Navigator>
    );
}
