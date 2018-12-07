import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';
import { StyleSheet, View, Text } from 'react-native';

import UIFont from '../UIFont';
import UIColor from '../UIColor';
import UIConstant from '../UIConstant';

const bubbleSize = 20;

const styles = StyleSheet.create({
    container: {
        minWidth: bubbleSize,
        height: bubbleSize,
        borderRadius: bubbleSize / 2.0,
        paddingHorizontal: UIConstant.tinyContentOffset(),
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        ...UIFont.tinyMedium(),
        textAlign: 'center',
        letterSpacing: 0,
    },
});

export default class UIBadge extends Component {
    // constructor
    constructor(props) {
        super(props);

        this.state = {
            //
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    // Events

    // Setters

    // Getters
    getBackgroundColor() {
        return {
            backgroundColor: this.props.inverted ? UIColor.backgroundPrimary() : UIColor.primary(),
        };
    }

    getColor() {
        return {
            color: this.props.inverted ? UIColor.primary() : UIColor.backgroundPrimary(),
        };
    }

    // Actions

    // render
    render() {
        const { badge, style } = this.props;
        if (badge === 0) return null;

        const { container, badgeText } = styles;
        return (
            <View style={[container, style, this.getBackgroundColor()]}>
                <Text style={[badgeText, this.getColor()]}>
                    {badge}
                </Text>
            </View>
        );
    }
}

UIBadge.defaultProps = {
    style: {},
    badge: 0,
    inverted: false,
};

UIBadge.propTypes = {
    style: StylePropType,
    badge: PropTypes.number,
    inverted: PropTypes.bool,
};
