import * as React from 'react';
import { View } from 'react-native';

import { UIImageView } from '@tonlabs/uikit.navigation_legacy';
import { UIActionImage, UIImage } from '@tonlabs/uikit.components';
import { UIAssets } from '@tonlabs/uikit.assets';
import { ExampleSection } from '../components/ExampleSection';
import { ExampleScreen } from '../components/ExampleScreen';

export const Images = () => (
    <ExampleScreen>
        <ExampleSection title="UIActionImage">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIActionImage
                    iconEnabled={UIAssets.icons.ui.keyThinDark}
                    iconDisabled={UIAssets.icons.ui.keyThinGrey}
                    iconHovered={UIAssets.icons.ui.keyThinWhite}
                />
            </View>
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIActionImage
                    iconEnabled={UIAssets.icons.ui.keyThinDark}
                    iconDisabled={UIAssets.icons.ui.keyThinGrey}
                    iconHovered={UIAssets.icons.ui.keyThinWhite}
                    disabled
                />
            </View>
        </ExampleSection>
        <ExampleSection title="UIImage">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                {/* $FlowFixMe */}
                <UIImage source={UIAssets.icons.ui.keyThinDark} />
            </View>
        </ExampleSection>
        <ExampleSection title="UIImageView Editable (press it)">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIImageView
                    photoStyle={{ width: 100, height: 100 }}
                    source={UIAssets.icons.ui.keyThinDark}
                    editable
                />
            </View>
        </ExampleSection>
        <ExampleSection title="UIImageView Fullscreen (press it)">
            <View style={{ maxWidth: 300, paddingVertical: 20 }}>
                <UIImageView
                    photoStyle={{ width: 100, height: 100 }}
                    sourceBig={UIAssets.icons.logo.tonlabsPrimary}
                    source={UIAssets.icons.logo.tonlabsPrimary}
                />
            </View>
        </ExampleSection>
    </ExampleScreen>
);
