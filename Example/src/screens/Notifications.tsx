/* eslint-disable global-require */
import * as React from 'react';
import { View } from 'react-native';

import { UILinkButton, UIBoxButton, UIBoxButtonVariant } from '@tonlabs/uikit.controls';
import { UILabel } from '@tonlabs/uikit.themes';
import { UIPopup, UINoticeColor, UINoticeType } from '@tonlabs/uikit.popups';
import { UIAssets } from '@tonlabs/uikit.assets';

import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

function InteractiveNotice() {
    const [visible, setVisible] = React.useState(false);
    const [bottomVisible, setBottomVisible] = React.useState(false);
    return (
        <>
            <UIPopup.InteractiveNotice
                type={UINoticeType.TopToast}
                visible={visible}
                onClose={() => setVisible(false)}
                title="Hello!"
                showCloseButton
                hasCountdown
                actions={[
                    {
                        title: 'Action One',
                        onTap: () => {
                            console.log('Action One');
                        },
                    },
                    {
                        title: 'Action Two',
                        onTap: () => {
                            console.log('Action Two');
                        },
                    },
                ]}
            />
            <UIPopup.InteractiveNotice
                visible={bottomVisible}
                onClose={() => setBottomVisible(false)}
                onTap={() => setBottomVisible(false)}
                title="Unfortunately, the everlink is not correct; please get in touch with the third-party service developers."
                icon={UIAssets.icons.ui.warn}
                showCloseButton
            />
            <View
                style={{
                    flexDirection: 'column',
                    paddingBottom: 30,
                    width: 250,
                }}
            >
                <UILinkButton
                    testID="show_top_interactive_notice"
                    title={`${visible ? 'Hide' : 'Show'} top InteractiveNotice`}
                    onPress={() => setVisible(!visible)}
                />
                <UILinkButton
                    testID="show_bottom_interactive_notice"
                    title={`${bottomVisible ? 'Hide' : 'Show'} bottom InteractiveNotice`}
                    onPress={() => setBottomVisible(prev => !prev)}
                />
            </View>
        </>
    );
}

function PushPopup() {
    const [visible, setVisible] = React.useState(false);
    const [longVisible, setLongVisible] = React.useState(false);
    return (
        <>
            <UIPopup.Push
                title="Hello!"
                message="You got a new message!"
                visible={visible}
                onClose={() => setVisible(false)}
                onTap={() => setVisible(false)}
            />
            <UIPopup.Push
                title="Hello!"
                message="Hey man, long time no see, maybe we can call each other? Come on, just 5-10 minutes, it won't take much time, you'll see."
                visible={longVisible}
                onClose={() => setLongVisible(false)}
                onTap={() => setLongVisible(false)}
                icon={require('./assets/long-push-icon.png')}
            />
            <View
                style={{
                    flexDirection: 'column',
                    paddingBottom: 30,
                    width: 250,
                }}
            >
                <UILinkButton
                    testID="show_push_popup"
                    title={`${visible ? 'Hide' : 'Show'} push popup`}
                    onPress={() => setVisible(!visible)}
                />
                <UILinkButton
                    testID="show_long_push_popup"
                    title={`${longVisible ? 'Hide' : 'Show'} long push popup`}
                    onPress={() => setLongVisible(!longVisible)}
                />
            </View>
        </>
    );
}

export function NotificationsScreen() {
    const [noticeColor, setNoticeColor] = React.useState<UINoticeColor>(UINoticeColor.Primary);
    const [hasCountdown, setHasCountdown] = React.useState<boolean>(true);
    const [visibleBottomToastNotice, setVisibleBottomToastNotice] = React.useState<boolean>(false);
    const [visibleTopToastNotice, setVisibleTopToastNotice] = React.useState<boolean>(false);
    return (
        <ExampleScreen>
            <ExampleSection title="UIPopup.InteractiveNotice">
                <InteractiveNotice />
            </ExampleSection>
            <ExampleSection title="UINotice">
                <View
                    style={{
                        paddingVertical: 20,
                        paddingHorizontal: 16,
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
                            flexDirection: 'column',
                            paddingBottom: 30,
                            width: 250,
                        }}
                    >
                        <UIBoxButton
                            title="PrimaryInverted"
                            variant={
                                noticeColor === UINoticeColor.Primary
                                    ? UIBoxButtonVariant.Positive
                                    : UIBoxButtonVariant.Neutral
                            }
                            onPress={() => setNoticeColor(UINoticeColor.Primary)}
                            layout={{
                                marginBottom: 4,
                            }}
                        />
                        <UIBoxButton
                            title="Negative"
                            variant={
                                noticeColor === UINoticeColor.Negative
                                    ? UIBoxButtonVariant.Positive
                                    : UIBoxButtonVariant.Neutral
                            }
                            onPress={() => setNoticeColor(UINoticeColor.Negative)}
                            layout={{
                                marginBottom: 4,
                            }}
                        />
                        <UIBoxButton
                            title="Secondary"
                            variant={
                                noticeColor === UINoticeColor.Secondary
                                    ? UIBoxButtonVariant.Positive
                                    : UIBoxButtonVariant.Neutral
                            }
                            onPress={() => setNoticeColor(UINoticeColor.Secondary)}
                            layout={{
                                marginBottom: 4,
                            }}
                        />
                    </View>
                    <View
                        style={{
                            width: 250,
                        }}
                    >
                        <UIBoxButton
                            title={`Countdown ${hasCountdown ? 'visible' : 'invisible'}`}
                            variant={
                                hasCountdown
                                    ? UIBoxButtonVariant.Positive
                                    : UIBoxButtonVariant.Neutral
                            }
                            onPress={() => setHasCountdown(prev => !prev)}
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
                        hasCountdown={hasCountdown}
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
                        hasCountdown={hasCountdown}
                    />
                </View>
            </ExampleSection>
            <ExampleSection title="UIPopup.Push">
                <PushPopup />
            </ExampleSection>
        </ExampleScreen>
    );
}
