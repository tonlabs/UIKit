// @flow
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { UIComponent } from '@tonlabs/uikit.components';
import { UIStyle } from '@tonlabs/uikit.core';
import { UILabel, UILabelColors, UILabelRoles } from '@tonlabs/uikit.hydrogen';

import type { UIAccountData } from '../types/UIAccountData';

type Props = {
    containerStyle: ViewStyleProp,
    account: ?UIAccountData,
    onPress?: () => void,
    displayNameOnly?: boolean,
    hideBalance?: boolean,
    notActive?: boolean,
    balancePart: string | React$Element<any>, // string added for flow, u can not use strings here
};

type State = {
    selected: number,
};

export default class UIAccountPickerCell extends UIComponent<Props, State> {
    static defaultProps = {
        containerStyle: {},
        account: null,
        onPress: () => {},
        displayNameOnly: false,
        notActive: false,
        balancePart: '',
        hideBalance: false,
    };

    // constructor
    constructor(props: Props) {
        super(props);

        this.state = {
            selected: -1,
        };
    }

    // Getters
    getAccount(): ?UIAccountData {
        return this.props.account;
    }

    getAccountName(): string {
        const { displayNameOnly } = this.props;
        const account = this.getAccount() || {};

        if (displayNameOnly) {
            return account.name || account.address || '';
        }

        return account.address || '';
    }

    getBalancePart(): React$Element<any> | string {
        return this.props.balancePart || '';
    }

    // Render
    renderAccount() {
        const { notActive, hideBalance } = this.props;
        const account = this.getAccount();

        if (!account) {
            return null;
        }

        const name = this.getAccountName();

        return (
            <View style={UIStyle.common.flexRow()}>
                <UILabel
                    color={notActive
                        ? UILabelColors.TextPrimary
                        : UILabelColors.TextAccent}
                    ellipsizeMode="middle"
                    numberOfLines={1}
                    role={notActive
                        ? UILabelRoles.ParagraphText
                        : UILabelRoles.Action}
                    style={[
                        UIStyle.common.flex(),
                        UIStyle.margin.rightDefault(),
                    ]}
                >
                    {name}
                </UILabel>
                {!hideBalance && this.getBalancePart()}
            </View>
        );
    }

    renderFooter() {
        const account = this.getAccount();

        if (!account) {
            return null;
        }

        return (
            <UILabel
                color={UILabelColors.TextTertiary}
                role={UILabelRoles.ParagraphFootnote}
                style={UIStyle.margin.topTiny()}
            >
                {account.name}
            </UILabel>
        );
    }

    render() {
        const {
            containerStyle,
            onPress,
            displayNameOnly,
            notActive,
        } = this.props;

        return (
            notActive ? (
                <View style={containerStyle}>
                    {this.renderAccount()}
                    {displayNameOnly ? null : this.renderFooter()}
                </View>
            ) : (
                <TouchableOpacity
                    style={containerStyle}
                    onPress={onPress}
                >
                    {this.renderAccount()}
                    {displayNameOnly ? null : this.renderFooter()}
                </TouchableOpacity>
            )
        );
    }
}
