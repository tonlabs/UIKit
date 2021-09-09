import * as React from 'react';
import { View } from 'react-native';

import { UILinkButton, UIBoxButton, UIBoxButtonVariant, UILabel } from '@tonlabs/uikit.hydrogen';
import { UIPopup, UINoticeColor } from '@tonlabs/uikit.popups';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Notifications = () => {
    const [noticeColor, setNoticeColor] = React.useState<UINoticeColor>(
        UINoticeColor.PrimaryInverted,
    );
    const [visibleBottomToastNotice, setVisibleBottomToastNotice] = React.useState<boolean>(false);
    const [visibleTopToastNotice, setVisibleTopToastNotice] = React.useState<boolean>(false);
    return (
        <ExampleScreen>
            <ExampleSection title="UINotice">
                <View
                    style={{
                        maxWidth: 350,
                        paddingVertical: 20,
                        alignItems: 'flex-start',
                    }}
                >
                    <UILinkButton
                        testID="show_TopToast_uiNotice"
                        title={`${visibleTopToastNotice ? 'Hide' : 'Show'} TopToast notice`}
                        onPress={() => setVisibleTopToastNotice(!visibleTopToastNotice)}
                    />
                    <UILinkButton
                        testID="show_BottomToast_uiNotice"
                        title={`${visibleBottomToastNotice ? 'Hide' : 'Show'} BottomToast notice`}
                        onPress={() => setVisibleBottomToastNotice(!visibleBottomToastNotice)}
                    />
                    <UILabel style={{ paddingTop: 30 }}>Select UINoticeColor:</UILabel>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                        }}
                    >
                        <UIBoxButton
                            title={'PrimaryInverted'}
                            variant={
                                noticeColor === UINoticeColor.PrimaryInverted
                                    ? UIBoxButtonVariant.Positive
                                    : UIBoxButtonVariant.Neutral
                            }
                            onPress={() => setNoticeColor(UINoticeColor.PrimaryInverted)}
                        />
                        <UIBoxButton
                            title={'Negative'}
                            variant={
                                noticeColor === UINoticeColor.Negative
                                    ? UIBoxButtonVariant.Positive
                                    : UIBoxButtonVariant.Neutral
                            }
                            onPress={() => setNoticeColor(UINoticeColor.Negative)}
                        />
                        <UIBoxButton
                            title={'Secondary'}
                            variant={
                                noticeColor === UINoticeColor.Secondary
                                    ? UIBoxButtonVariant.Positive
                                    : UIBoxButtonVariant.Neutral
                            }
                            onPress={() => setNoticeColor(UINoticeColor.Secondary)}
                        />
                    </View>
                    <UIPopup.Notice
                        type={UIPopup.Notice.Type.TopToast}
                        title="Your account was deleted"
                        visible={visibleTopToastNotice}
                        onClose={() => {
                            console.log('onClose');
                            setVisibleTopToastNotice(false);
                        }}
                        onTap={() => {
                            console.log('onTap');
                            setVisibleTopToastNotice(false);
                        }}
                        duration={UIPopup.Notice.Duration.Long}
                        color={noticeColor}
                        action={{
                            title: 'Undo',
                            onTap: () => {
                                console.log('Undo');
                                setVisibleTopToastNotice(false);
                            },
                        }}
                    />
                    <UIPopup.Notice
                        type={UIPopup.Notice.Type.BottomToast}
                        title="System is going down at midnight tonight. We’ll notify you when it’s back up."
                        visible={visibleBottomToastNotice}
                        onClose={() => {
                            setVisibleBottomToastNotice(false);
                        }}
                        onTap={() => {
                            setVisibleBottomToastNotice(false);
                        }}
                        duration={UIPopup.Notice.Duration.Long}
                        color={noticeColor}
                        action={{
                            title: 'Undo',
                            onTap: () => {
                                console.log('Undo');
                                setVisibleBottomToastNotice(false);
                            },
                        }}
                    />
                </View>
            </ExampleSection>
        </ExampleScreen>
    );
};
