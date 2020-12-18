// @flow
import React from 'react';
import { Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal';
import { ScrollView } from 'react-native-gesture-handler';


import { UIConstant, UITextStyle, UIColor, UIFont } from '@tonlabs/uikit.core';
import { UISearchBar } from '@tonlabs/uikit.components';
import { uiLocalized } from '@tonlabs/uikit.localization';

import UIModalController from '../UIModalController';
import type {
    ModalControllerProps,
    ModalControllerState,
    ModalControllerShowArgs,
} from '../UIModalController';

let shared;

const countryPickerStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        margin: 1,
    },
    scrollView: {
        borderWidth: 0,
        borderColor: 'transparent',
    },
    touchFlag: {
        opacity: 0,
        position: 'absolute',
    },
    itemCountry: {
        height: UIConstant.buttonHeight(),
    },
    itemCountryName: {
        borderBottomWidth: 0,
        height: UIConstant.smallCellHeight(),
    },
    modalContainer: {
        flex: 1,
        margin: -1,
    },
    countryName: {
        ...UITextStyle.primary,
        ...UIFont.bodyMedium(), // TODO: switch to TypographyVariants.Action
    },
    disabledCountryName: {
        ...UITextStyle.quaternary,
        ...UIFont.bodyRegular(), // TODO: switch to TypographyVariants.ParagraphText
    },
    separator: {
        marginVertical: 1,
        marginHorizontal: UIConstant.contentOffset(),
        backgroundColor: UIColor.grey2(),
    },
});

type Props = ModalControllerProps & {
    isShared: boolean,
};

type State = ModalControllerState & {
    expression: string,
};

export type Country = {
    cca2: string,
    name: string,
}

export default class UICountryPicker extends UIModalController<Props, State> {
    static defaultProps = {
        isShared: false,
    };

    static show(args: ModalControllerShowArgs) {
        if (shared) {
            shared.show(args);
        }
    }

    static focus() {
        if (shared) {
            shared.focus();
        }
    }

    static getAllCountries(): Country[] {
        return getAllCountries();
    }

    cca2: ?string;
    language: ?string;
    countryPicker: ?CountryPicker;
    countryPickerInput: ?UISearchBar;
    disabledCountries: ?string[];
    excludedCountries: ?string[];
    isLanguages: ?boolean;

    constructor(props: Props) {
        super(props);
        this.fullscreen = false;
        this.testID = '[UICountryPicker]';
        this.cca2 = null;
        this.language = null;
        this.disabledCountries = [];
        this.excludedCountries = [];
        this.modalOnWeb = false;
        this.isLanguages = false;

        this.state = {
            expression: '',
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.isShared) {
            shared = this;
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.props.isShared) {
            shared = null;
        }
    }

    // Events
    onCancel = () => {
        this.setExpression('');
    };

    onPickCountry = (country: Country) => {
        this.hide();
        this.setExpression('');
        if (this.onSelect) {
            this.onSelect(country);
        }
    };

    onChangeExpression = (newValue: string) => {
        this.setExpression(newValue);
        if (this.countryPicker) {
            this.countryPicker.handleFilterChange(newValue);
        }
    };

    // Getters
    getExpression() {
        return this.state.expression;
    }

    getDisabledCountries(): Array<string> {
        return this.disabledCountries || [];
    }

    // Setters
    setExpression(expression: string) {
        this.setStateSafely({ expression });
    }

    // Actions
    async show(args: any) {
        if (typeof args === 'object') {
            const {
                fullscreen = false,
                language = 'eng',
                cca2 = 'US',
                disabledCountries = [],
                excludedCountries = [],
                modalOnWeb = false,
                isLanguages = false,
            } = args;
            this.fullscreen = fullscreen;
            this.cca2 = cca2;
            this.language = language;
            this.disabledCountries = disabledCountries;
            this.excludedCountries = excludedCountries;
            this.modalOnWeb = modalOnWeb;
            this.isLanguages = isLanguages;
        }
        await super.show(args);

        this.focus();
    }

    async focus() {
        if (this.countryPickerInput) {
            this.countryPickerInput.focus();
        }
    }

    // Render
    renderSearchBar() {
        if (!this.countryPicker) {
            return null;
        }

        return (
            <React.Fragment>
                <UISearchBar
                    value={this.getExpression()}
                    placeholder={`${uiLocalized.Search}...`}
                    ref={(component) => { this.countryPickerInput = component; }}
                    onChangeExpression={this.onChangeExpression}
                    bottomSeparatorStyle={countryPickerStyle.separator}
                    renderGlass
                />
            </React.Fragment>
        );
    }

    renderContentView() {
        // Wraping the component with a ScrollView fixes on Android the
        // problem of the list not avoiding the keyboard... on iOS this
        // doesn't seem to work. KeyboardAvoidingView fixes it for iOS.
        const picker = (
            <>
                {this.renderSearchBar()}
                <ScrollView>
                    <CountryPicker
                        ref={(component) => { this.countryPicker = component; }}
                        cca2={this.cca2}
                        translation={this.language}
                        hideAlphabetFilter
                        filterable
                        renderFilter={() => null}
                        disabledCountries={this.disabledCountries}
                        disabledCountryText={uiLocalized.serviceUnavailable}
                        excludedCountries={this.excludedCountries}
                        styles={countryPickerStyle}
                        onChange={this.onPickCountry}
                        dataType={this.isLanguages ?
                            CountryPicker.dataTypes.languages :
                            CountryPicker.dataTypes.countries}
                    />
                </ScrollView>
            </>
        );
        const toRender = Platform.OS === 'ios'
            ? (
                <KeyboardAvoidingView
                    style={countryPickerStyle.container}
                    keyboardVerticalOffset={120}
                    behavior="padding"
                >
                    {picker}
                </KeyboardAvoidingView>
            )
            : picker;
        return toRender;
    }
}
