// @flow
import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';

import { Popover, PopoverContainer } from 'react-native-simple-popover';

import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { KeyboardType } from 'react-native/Libraries/Components/TextInput/TextInput';
import Mnemonic from 'bitcore-mnemonic';

import UILabel from '../../text/UILabel';
import UIStyle from '../../../helpers/UIStyle';
import UILocalized from '../../../helpers/UILocalized';
import UIDetailsInput from '../UIDetailsInput';
import UIColor from '../../../helpers/UIColor';

import UIConstant from '../../../helpers/UIConstant';
import type { DetailsProps } from '../UIDetailsInput';
import type { ActionState } from '../../UIActionComponent';

type Props = DetailsProps & {
    containerStyle?: ViewStyleProp,
    phraseToCheck: string,
    isSeedPhraseValid?: boolean,
    onChangeIsValidPhrase?: (isValid: boolean) => void,
};

type State = ActionState & {
    popoverPlacement: string,
    wordThatChanged: number,
    inputHeight: number,
};

const styles = StyleSheet.create({
    hintsContainer: {
        flex: 1,
        width: UIConstant.toastWidth(),
        maxHeight: UIConstant.defaultCellHeight() * 3,
        backgroundColor: UIColor.backgroundPrimary(),
        borderBottomLeftRadius: UIConstant.borderRadius(),
        borderBottomRightRadius: UIConstant.borderRadius(),
        paddingHorizontal: UIConstant.contentOffset(),
        ...UIConstant.cardShadow(),
    },
    cellHint: {
        zIndex: 1,
        justifyContent: 'center',
        minHeight: UIConstant.defaultCellHeight(),
        backgroundColor: UIColor.backgroundPrimary(),

    },
});

const DASH = '\u2014';
export default class UISeedPhraseInput extends UIDetailsInput<Props, State> {
    static defaultProps = {
        ...UIDetailsInput.defaultProps,
        isSeedPhraseValid: null,
        autoCapitalize: 'none',
        returnKeyType: 'none',
        placeholder: UILocalized.Password,
        autofocus: true,
        containerStyle: { },
        forceMultiLine: true,
        phraseToCheck: '',
        onChangeIsValidPhrase: () => {},
    };

    lastWords: Array<string>;
    totalWords: number;
    popOverRef: Popover;

    constructor(props: Props) {
        super(props);

        this.lastWords = [];
        this.totalWords = 12;

        this.state = {
            ...this.state,
            popoverPlacement: 'bottom',
            wordThatChanged: -1,
            inputHeight: UIConstant.smallCellHeight(),
            comment: '',
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.setTotalWords();
        this.updateInputRef();
    }

    // Setters
    setTotalWords() {
        const { phraseToCheck } = this.props;
        if (phraseToCheck.length === 0) {
            this.totalWords = 12;
        } else {
            const words = this.splitPhrase(phraseToCheck);
            this.totalWords = words.length;
        }
    }
    // Getters
    getDictionary(): Array<string> {
        return Mnemonic.Words.ENGLISH;
    }

    containerStyle(): ViewStyleProp {
        const { rightButton } = this.props;
        const flex = rightButton && rightButton.length > 0 ? UIStyle.flex : null;
        return flex;
    }

    extraInputStyle(): ViewStyleProp {
        return { height: this.state.inputHeight };
    }

    commentColor(): ?string {
        const { commentColor } = this.props;
        if (commentColor) {
            return commentColor;
        }

        const valid = this.areWordsValid();
        const count = this.getRemainingCount();

        if (!valid && count === 0) {
            return UIColor.error();
        } else if (valid && count === 0) {
            return UIColor.success();
        }

        return null;
    }

    getComment(): string {
        const { comment } = this.props;
        if (comment) {
            return comment;
        }

        const valid = this.areWordsValid();
        const count = this.getRemainingCount();

        if (!valid && count === 0) {
            return UILocalized.seedPhraseTypo;
        } else if (valid && count === 0) {
            return UILocalized.greatMemory;
        }

        return `${count} ${UILocalized.moreWords}`;
    }

    getLastWord(phrase: string): string {
        const w = this.splitPhrase(phrase);
        const last = w.length ? w[w.length - 1] : '';

        return last;
    }

    getRemainingCount(): number {
        const phrase = this.getValue().trim();
        const words = this.splitPhrase(phrase);
        const count = phrase.length === 0 ? 0 : words.length;
        return this.totalWords - count;
    }

    getPossibleHints(): Array<string> {
        const wtc = this.getWordThatChanged();
        const dictionary = this.getDictionary();
        const hints = dictionary.filter(word => word.startsWith(wtc));

        return hints;
    }

    getWordThatChangedIndex(): number {
        return this.state.wordThatChanged;
    }

    getWordThatChanged(): string {
        const wtc = this.getWordThatChangedIndex();
        if (wtc < 0) {
            return '';
        }

        const phrase = this.getValue();
        const words = this.splitPhrase(phrase);
        return words[wtc] || '';
    }

    areHintsVisible(): boolean {
        const wtc = this.getWordThatChangedIndex();
        return wtc !== -1;
    }

    areWordsValid(currentPhrase?: string): boolean {
        const { phraseToCheck, isSeedPhraseValid } = this.props;
        if (isSeedPhraseValid !== null) {
            return isSeedPhraseValid;
        }
        if (phraseToCheck.length > 0) {
            return this.areSeedPhrasesEqual(currentPhrase);
        }

        const phrase = currentPhrase || this.getValue();
        const words = this.splitPhrase(phrase);
        const dictionary = this.getDictionary();

        let result = true;
        for (let i = 0; i < words.length; i += 1) {
            if (words[i].length === 0) {
                break;
            }

            const included = dictionary.filter(word => word === words[i]);
            if (included.length === 0) {
                result = false;
                break;
            }
        }

        return result;
    }

    // Events
    onChangeText = (newValue: string): void => {
        const { onChangeText, onChangeIsValidPhrase } = this.props;
        const split = this.splitPhrase(newValue);
        if (split.length > this.totalWords) {
            return;
        }

        const finalValue = this.addDashes(split);
        this.identifyWordThatChanged(split);
        onChangeText(finalValue);

        if (onChangeIsValidPhrase) {
            onChangeIsValidPhrase(this.areWordsValid(finalValue));
        }
    };

    onContentSizeChange(height: number) {
        this.setStateSafely({ inputHeight: height });
    }

    onHintSelected(hint: string) {
        const phrase = this.getValue();
        const words = this.splitPhrase(phrase);
        const wtc = this.getWordThatChangedIndex();

        let newPhrase = '';
        const extraSpace = words.length === this.totalWords ? '' : ' ';
        for (let i = 0; i < words.length; i += 1) {
            const wordToAdd = i === wtc ? hint : words[i];
            newPhrase = `${newPhrase} ${wordToAdd}`;
        }
        newPhrase = `${newPhrase}`.trim();
        newPhrase = `${newPhrase}${extraSpace}`;

        // eslint-disable-next-line no-underscore-dangle
        this.popOverRef._element.focus();
        this.onChangeText(newPhrase);
    }

    // methods
    updateInputRef() {
        const element = this.popOverRef._element;
        if (element) {
            element.focus();
            this.setTextInputRef(element);
        } else {
            throw new Error('No element has been found for popover');
        }
    }

    splitPhrase(phrase: string): Array<string> {
        const noExtraSpaces = phrase.replace(/\s+/g, ' ');
        const words = noExtraSpaces.split(' ');
        const normalized = [];

        for (let i = 0; i < words.length; i += 1) {
            if (i === 0 && words[0] === '') {
                continue;
            }

            if (words[i] !== DASH && words[i] !== '-') {
                normalized.push(words[i]);
            }
        }

        return normalized;
    }

    addDashes(words: Array<string>): string {
        if (words.length) {
            let newPhrase = `${words[0]}`;
            for (let i = 1; i < words.length; i += 1) {
                if (words[i - 1] !== '') {
                    newPhrase = `${newPhrase} ${DASH} ${words[i]}`;
                }
            }
            return newPhrase;
        }

        return '';
    }

    identifyWordThatChanged(currentWords: Array<string>) {
        let i = 0;
        let change = -1;

        while (i < this.lastWords.length && i < currentWords.length) {
            if (this.lastWords[i] !== currentWords[i]) {
                change = i;
                break;
            }
            i += 1;
        }

        this.lastWords = Array.from(currentWords);
        this.setStateSafely({ wordThatChanged: change });
    }

    areSeedPhrasesEqual(currentPhrase?: string): boolean {
        const { phraseToCheck } = this.props;
        const typedPhrase = currentPhrase || this.getValue();

        const wA = this.splitPhrase(phraseToCheck);
        const wB = this.splitPhrase(typedPhrase);

        let result = false;
        if (wA.length === wB.length) {
            result = true;
            for (let i = 0; i < wA.length; i += 1) {
                if (wA[i] !== wB[i]) {
                    result = false;
                    break;
                }
            }
        }

        return result;
    }

    // Render
    renderHint(hint: string) {
        return (
            <TouchableOpacity
                style={styles.cellHint}
                onPress={() => this.onHintSelected(hint)}
            >
                <UILabel
                    text={hint}
                    role={UILabel.Role.Note}
                />
            </TouchableOpacity>
        );
    }

    renderWordsList() {
        const hints = this.getPossibleHints();
        const wtc = this.getWordThatChanged();

        if (hints.length === 0) {
            return null;
        } else if (hints.length === 1) {
            if (hints[0] === wtc) {
                return null;
            }
        }

        return (
            <View style={styles.hintsContainer}>
                <FlatList
                    data={hints}
                    renderItem={element => this.renderHint(element.item)}
                    scrollEnabled
                    showsVerticalScrollIndicator
                    keyExtractor={item => item}
                />
            </View>
        );
    }

    renderInputWithPopOver() {
        const isVisible = this.areHintsVisible();

        return (
            <Popover
                ref={(c) => { this.popOverRef = c; }}
                placement={this.state.popoverPlacement}
                arrowWidth={0}
                arrowHeight={0}
                isVisible={isVisible}
                offset={{
                    x: 0,
                    y: UIConstant.smallContentOffset() + 1,
                }}
                component={() => this.renderWordsList()}
            >
                {this.renderTextInput()}
            </Popover>
        );
    }

    renderWordHints() {
        return (
            <PopoverContainer>
                <View>
                    {this.renderAuxTextInput()}
                    {this.renderInputWithPopOver()}
                </View>
            </PopoverContainer>
        );
    }

    renderTextFragment() {
        return (
            <React.Fragment>
                {this.renderWordHints()}
            </React.Fragment>
        );
    }
}
