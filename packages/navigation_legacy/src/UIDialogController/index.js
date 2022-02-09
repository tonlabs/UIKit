/* eslint-disable class-methods-use-this */
import React from 'react';
import { View, StyleSheet, Animated, LayoutAnimation } from 'react-native';

import { UIConstant, UIStyle } from '@tonlabs/uikit.core';
import { Portal } from '@tonlabs/uikit.layout';
import {
    UIBackgroundView,
    UIBackgroundViewColors,
    UILabel,
    UILabelColors,
    UILabelRoles,
} from '@tonlabs/uikit.themes';
import { ScrollView } from '@tonlabs/uikit.scrolls';

import UIController from '../UIController';

const AnimatedUIBackgroundView = Animated.createAnimatedComponent(UIBackgroundView);

const styles = StyleSheet.create({
    scrollContainer: {
        justifyContent: 'center',
        paddingTop: UIConstant.normalContentOffset(),
    },
    titleView: {
        minHeight: 72,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    titleText: {
        textAlign: 'center',
        // width: '100%', // Fix for Firefox (UPD: breaks layout on the phone)
    },
    subtitleContainer: {
        marginTop: UIConstant.mediumContentOffset(),
        minHeight: 72,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'stretch',
    },
    bottomContainer: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: UIConstant.elasticWidthMax(),
    },
});

/**
 * Configuration Options
 * ---------------------
 * this.title = null
 * this.testID = undefined
 *
 * Overridable
 * -----------
 * renderContent()
 * renderBottom()
 */
class UIDialogController extends UIController {
    static styles() {
        return styles;
    }

    // constructor
    constructor(props) {
        super(props);

        this.wrapContentInScrollView = true;
        this.androidKeyboardAdjust = UIController.AndroidKeyboardAdjust.Pan;
        this.title = undefined;
        this.testID = undefined;
        this.trackKeyboard = true;

        this.marginBottom = new Animated.Value(0);
        this.state = {
            bottomPanelHeight: 0,
        };
    }

    // Setters
    setContentInset(contentInset, animation) {
        super.setContentInset(contentInset, animation);
        const bottomInset = Math.max(0, contentInset.bottom);
        const { duration, easing } = animation || {
            duration: UIConstant.animationDuration(),
            easing: LayoutAnimation.Types.keyboard,
        };
        // TODO: think how to use `useNativeDriver` here
        Animated.timing(this.marginBottom, {
            toValue: bottomInset,
            duration,
            easing: UIController.getEasingFunction(easing),
            useNativeDriver: false,
        }).start();
    }

    // Getters
    getMarginBottom() {
        return this.marginBottom;
    }

    getContentContainerStyle() {
        return null;
    }

    getBottomPanelHeight() {
        return this.state.bottomPanelHeight || 0;
    }

    // Render
    renderTitle() {
        if (!this.title) {
            return null;
        }
        return (
            <View style={styles.titleView}>
                <UILabel
                    color={UILabelColors.TextPrimary}
                    numberOfLines={3}
                    role={UILabelRoles.ParagraphText}
                    style={styles.titleText}
                >
                    {this.title}
                </UILabel>
            </View>
        );
    }

    renderBottom() {
        return null;
    }

    renderBottomContainer() {
        let bottom = this.renderBottom();

        if (Array.isArray(bottom)) {
            bottom = (
                <Portal forId="scene">
                    <>{bottom}</>
                </Portal>
            );
        }

        return (
            <Portal forId="scene">
                <AnimatedUIBackgroundView
                    style={[
                        styles.bottomContainer,
                        {
                            marginBottom: this.getMarginBottom(),
                        },
                    ]}
                    onLayout={this.onLayoutBottomContainer}
                >
                    {bottom}
                </AnimatedUIBackgroundView>
            </Portal>
        );
    }

    renderContent() {
        return null;
    }

    onLayoutBottomContainer = e => {
        const { height } = e.nativeEvent.layout;

        if (!height) {
            return;
        }

        const bottomPanelHeight = Math.round(height);

        if (bottomPanelHeight !== this.state.bottomPanelHeight) {
            this.setStateSafely({
                bottomPanelHeight,
            });
        }
    };

    renderContentContainer() {
        let content = this.renderContent();
        if (Array.isArray(content)) {
            content = <>{content}</>;
        }
        return content ? (
            <UIBackgroundView
                color={UIBackgroundViewColors.BackgroundPrimary}
                style={styles.contentContainer}
            >
                {content}
            </UIBackgroundView>
        ) : null;
    }

    renderSafely() {
        const content = (
            <>
                {this.renderTitle()}
                {this.renderContentContainer()}
            </>
        );
        const testIDProp = this.testID ? { testID: `${this.testID}_wrapper` } : null;
        const wrappedContent = this.wrapContentInScrollView ? (
            <ScrollView
                {...testIDProp}
                style={UIStyle.container.screen()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    UIStyle.container.page(),
                    styles.scrollContainer,
                    this.getContentContainerStyle(),
                    { paddingBottom: this.getBottomPanelHeight() },
                ]}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews={false}
            >
                {content}
            </ScrollView>
        ) : (
            <View
                {...testIDProp}
                style={[
                    UIStyle.container.screen(),
                    UIStyle.container.page(),
                    this.getContentContainerStyle(),
                    { paddingBottom: this.getBottomPanelHeight() },
                ]}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews={false}
            >
                {content}
            </View>
        );
        const animatedContainerStyle = {
            flex: 1,
            marginBottom: this.getMarginBottom(),
        };
        return (
            <Animated.View style={animatedContainerStyle}>
                {wrappedContent}
                {this.renderBottomContainer()}
            </Animated.View>
        );
    }
}

export default UIDialogController;
