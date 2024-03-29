import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { UIMsgButton, UIMsgButtonType } from '@tonlabs/uikit.controls';
import {
    UIBackgroundView,
    UILabel,
    UILabelColors,
    UILabelRoles,
    ColorVariants,
    useTheme,
} from '@tonlabs/uikit.themes';
import { UILayoutConstant } from '@tonlabs/uikit.layout';
import { uiLocalized } from '@tonlabs/localization';
import { UIAssets } from '@tonlabs/uikit.assets';
import type { TransactionConfirmationMessage } from '../types';
import { TransactionDetails } from '../TransactionDetails';

export function TransactionConfirmation({
    onApprove: onApproveProp,
    onCancel: onCancelProp,
    externalState,
    onLayout,
    ...transactionDetailsProps
}: TransactionConfirmationMessage) {
    const theme = useTheme();

    const onApprove = React.useCallback(() => {
        onApproveProp({
            status: 'approved',
        });
    }, [onApproveProp]);
    const onCancel = React.useCallback(() => {
        onCancelProp({
            status: 'cancelled',
        });
    }, [onCancelProp]);

    return (
        <View onLayout={onLayout}>
            <TransactionDetails
                {...transactionDetailsProps}
                key="TransactionConfirmation-details"
            />
            {externalState?.status == null ? (
                <View style={styles.buttonsContainer}>
                    <UIMsgButton
                        testID="transaction_confirmation_confirm"
                        title={uiLocalized.Browser.TransactionConfirmation.Confirm}
                        type={UIMsgButtonType.Secondary}
                        onPress={onApprove}
                        layout={{
                            marginRight: UILayoutConstant.tinyContentOffset,
                        }}
                        icon={UIAssets.icons.ui.buttonConfirm}
                    />
                    <UIMsgButton
                        testID="transaction_confirmation_cancel"
                        title={uiLocalized.Browser.TransactionConfirmation.Cancel}
                        type={UIMsgButtonType.Secondary}
                        onPress={onCancel}
                        icon={UIAssets.icons.ui.buttonClose}
                    />
                </View>
            ) : (
                <View style={styles.responseContainer}>
                    <UIBackgroundView
                        testID="transaction_confirmation_response"
                        color={ColorVariants.BackgroundAccent}
                        style={[
                            styles.button,
                            styles.response,
                            {
                                borderColor: theme[ColorVariants.LineAccent],
                            },
                        ]}
                    >
                        <UILabel
                            role={UILabelRoles.Action}
                            color={UILabelColors.StaticTextPrimaryLight}
                        >
                            {externalState.status === 'approved'
                                ? uiLocalized.Browser.TransactionConfirmation.Confirm
                                : uiLocalized.Browser.TransactionConfirmation.Cancel}
                        </UILabel>
                    </UIBackgroundView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    buttonsContainer: {
        maxWidth: '100%',
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: UILayoutConstant.contentInsetVerticalX2,
    },
    responseContainer: {
        maxWidth: '100%',
        paddingLeft: '20%',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        paddingTop: UILayoutConstant.contentInsetVerticalX2,
    },
    // TODO: change it to UIMsgButton (or similar)
    button: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        paddingHorizontal: 40,
        borderRadius: 12,
        marginRight: UILayoutConstant.tinyContentOffset,
    },
    response: {
        borderBottomRightRadius: 0,
    },
});
