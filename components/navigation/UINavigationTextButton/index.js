// @flow
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIColor from '../../../helpers/UIColor';
import UIFont from '../../../helpers/UIFont';
import UIConstant from '../../../helpers/UIConstant';

import UIComponent from '../../UIComponent';

const styles = StyleSheet.create({
    navButton: {
        marginHorizontal: UIConstant.contentOffset(),
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    textButton: {
        ...UIFont.smallMedium(),
        color: UIColor.primary(),
        // alignItems: 'center',
        // justifyContent: 'center',
    },
});

type Props = {
    containerStyle: ViewStyleProp,
    onPress: () => void,
    title: string,
    testID?: string,
};

type State = {};

export default class UINavigationTextButton extends UIComponent<Props, State> {
    static defaultProps = {
        containerStyle: {},
        onPress: () => {},
        title: null,
    };

    // Render
    render() {
        const {
            testID, containerStyle, onPress, title,
        } = this.props;
        const testIDProp = testID ? { testID } : null;
        return (
            <TouchableOpacity
                {...testIDProp}
                style={[styles.navButton, containerStyle]}
                onPress={onPress}
            >
                <Text style={styles.textButton}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    }
}
