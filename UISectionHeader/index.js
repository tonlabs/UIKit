import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { View, StyleSheet, Text } from 'react-native';

import UIStyle from '../UIStyle';
import UIColor from '../UIColor';
import UIConstant from '../UIConstant';

const styles = StyleSheet.create({
    sectionHeader: {
        backgroundColor: UIColor.backgroundPrimary(),
        height: UIConstant.floatingLabelHeight(), // UIConstant.smallButtonHeight(),
    },
    sectionDivider: {
        backgroundColor: UIColor.backgroundPrimary(),
        height: 16, // TODO: why so?
    },
});

class UISectionHeader extends Component {
    // Getters
    getTitle() {
        return this.props.title;
    }

    // Render
    renderSeparator() {
        const separator = (
            <View style={[styles.sectionDivider, UIStyle.borderBottom]} />
        );
        return this.props.needBorder ? separator : null;
    }

    render() {
        return (
            <View>
                {this.renderSeparator()}
                <View
                    style={[
                        UIStyle.centerLeftContainer,
                        styles.sectionHeader,
                        this.props.containerStyle,
                    ]}
                >
                    <Text style={UIStyle.textTertiaryTinyBold}>
                        {this.getTitle()}
                    </Text>
                </View>
            </View>
        );
    }
}

export default UISectionHeader;

UISectionHeader.defaultProps = {
    title: '',
    needBorder: false,
    containerStyle: null,
};

UISectionHeader.propTypes = {
    title: PropTypes.string,
    needBorder: PropTypes.bool,
    containerStyle: StylePropType,
};
