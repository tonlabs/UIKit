import * as React from "react";
import {
    TouchableOpacity,
    Image, // TODO: use fast-image?
    View,
} from "react-native";

import buttonPlus from "@tonlabs/uikit.assets/icon-plus/add.png";
import buttonPlusDisabled from "@tonlabs/uikit.assets/icon-plus-disabled/add.png";

import { commonStyles } from "./styles";
import type { MenuItem } from "./types";

type Props = {
    menuPlus?: MenuItem[];
    menuPlusDisabled?: boolean;
};

export function MenuPlus({ menuPlus, menuPlusDisabled }: Props) {
    if (!menuPlus || menuPlus.length === 0) {
        return null;
    }

    if (menuPlusDisabled) {
        return (
            <View style={commonStyles.buttonContainer}>
                <Image source={buttonPlusDisabled} style={styles.icon} />
            </View>
        );
    }

    if (menuPlus.length === 1) {
        return (
            <TouchableOpacity
                testID="menu_view"
                onPress={menuPlus[0].onPress}
                style={commonStyles.buttonContainer}
            >
                <Image source={buttonPlus} style={commonStyles.icon} />
            </TouchableOpacity>
        );
    }

    return (
        <UIPopoverMenu
            testID="menu_view"
            menuItemsList={menuPlus}
            placement="top"
        >
            <Image source={buttonPlus} style={commonStyles.icon} />
        </UIPopoverMenu>
    );
}
