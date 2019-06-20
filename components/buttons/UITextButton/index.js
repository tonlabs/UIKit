// @flow
import React from 'react';
import StylePropType from 'react-style-proptype';
import { StyleSheet, Text, Image, View, Platform } from 'react-native';

import UITextStyle from '../../../helpers/UITextStyle';
import UIConstant from '../../../helpers/UIConstant';
import UIActionComponent from '../../UIActionComponent';
import UIStyle from '../../../helpers/UIStyle';
import UIFont from '../../../helpers/UIFont';
import UIColor from '../../../helpers/UIColor';
import UITooltip from '../../notifications/UITooltip';

import type { ActionProps, ActionState } from '../../UIActionComponent';

const TOOLTIP_WIDTH = 'auto';

const styles = StyleSheet.create({
    textButton: {
        height: UIConstant.buttonHeight(),
        backgroundColor: 'transparent',
        alignItems: 'center',
        flexDirection: 'row',
    },
    alignLeft: {
        justifyContent: 'flex-start',
    },
    alignCenter: {
        justifyContent: 'center',
    },
    detailsText: {
        marginRight: UIConstant.contentOffset(),
    },
    flexGrow1: {
        flexGrow: 1,
    },
    flexGrow0: {
        flexGrow: 0,
    },
    // web-only style
    tooltipContainerStyle: {
        padding: UIConstant.mediumContentOffset(),
        width: TOOLTIP_WIDTH,
    },
});

type Props = ActionProps & {
    align: StylePropType,
    buttonStyle?: StylePropType,
    details: string,
    detailsStyle?: StylePropType,
    icon: ?string,
    backIcon: ?string,
    iconColor?: string,
    iconHoverColor?: string,
    textStyle?: StylePropType,
    textHoverStyle?: StylePropType,
    textTappedStyle?: StylePropType,
    theme: string,
    title: string,
    tooltip?: string,
};

type State = ActionState;

class UITextButton extends UIActionComponent<Props, State> {
    static Align = {
        Left: styles.alignLeft,
        Center: styles.alignCenter,
    };

    // Virtual
    onEnter = () => {
        const webStyle = (
            Platform.OS === 'web' ?
                styles.tooltipContainerStyle :
                null
        );
        if (this.props.tooltip) {
            UITooltip.showOnMouseForWeb(this.props.tooltip, webStyle);
        }
    }

    onLeave = () => {
        if (this.props.tooltip) {
            UITooltip.hideOnMouseForWeb();
        }
    }

    getStateCustomColorStyle() {
        if (this.isTapped()) {
            return this.props.textTappedStyle;
        }
        if (this.isHover()) {
            return this.props.textHoverStyle;
        }
        return null;
    }

    // Render
    renderIcon(icon: string, isBack: boolean) {
        if (!icon) {
            return null;
        }

        const {
            theme, disabled,
        } = this.props;
        const tapped = this.isTapped();
        const hover = this.isHover();

        const defaultColor = UIColor.actionTextPrimary(theme);
        const stateColorStyle = disabled || tapped || hover
            ? this.props.iconHoverColor || UIColor.stateTextPrimary(theme, disabled, tapped, hover)
            : null;
        const iconColor = stateColorStyle || this.props.iconColor || defaultColor;
        const styleColor = iconColor ? UIColor.getTintColorStyle(iconColor) : null;

        const iconStyle = [styleColor];
        if (this.props.title) {
            iconStyle.push(isBack ?
                UIStyle.marginLeftDefault :
                UIStyle.marginRightDefault);
        }

        return (<Image
            source={icon}
            style={iconStyle}
        />);
    }

    renderTitle() {
        const {
            title, textStyle, details, theme, disabled,
        } = this.props;
        if (!title) return null;
        const defaultFontStyle = UIFont.smallMedium();
        const tapped = this.isTapped();
        const hover = this.isHover();
        const defaultColorStyle = UIColor.actionTextPrimaryStyle(theme);
        const stateColorStyle = disabled || tapped || hover
            ? UIColor.stateTextPrimaryStyle(theme, disabled, tapped, hover)
            : null;
        const stateCustomColorStyle = this.getStateCustomColorStyle();
        const flexGrow = details ? styles.flexGrow1 : styles.flexGrow0;

        return (
            <Text
                style={[
                    defaultFontStyle,
                    defaultColorStyle,
                    textStyle,
                    stateColorStyle,
                    stateCustomColorStyle,
                    flexGrow,
                ]}
            >
                {title}
            </Text>
        );
    }

    renderDetails() {
        const { details, detailsStyle } = this.props;
        if (!details || !details.length) {
            return null;
        }
        return (
            <Text style={[UITextStyle.secondarySmallRegular, detailsStyle]}>
                {details}
            </Text>
        );
    }

    renderContent(): React$Node {
        const {
            buttonStyle, align, icon, backIcon,
        } = this.props;

        return (
            <View
                style={[
                    styles.textButton,
                    align,
                    buttonStyle,
                ]}
            >
                {this.renderIcon(icon, false)}
                {this.renderTitle()}
                {this.renderIcon(backIcon, true)}
                {this.renderDetails()}
            </View>
        );
    }

    static defaultProps: Props;
}

export default UITextButton;

UITextButton.defaultProps = {
    ...UIActionComponent.defaultProps,
    align: UITextButton.Align.Left,
    details: '',
    icon: null,
    backIcon: null,
    theme: UIColor.Theme.Light,
    title: '',
    tooltip: null,
};
