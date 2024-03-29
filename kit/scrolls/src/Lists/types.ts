import type { FlatListProps, ListRenderItem, ViewStyle, StyleProp } from 'react-native';

export type GridProps<ItemT> = {
    /**
     * Data for the grid
     */
    data: FlatListProps<ItemT>['data'];
    /**
     * Takes an item from data and renders it into the list.
     */
    renderItem: ListRenderItem<ItemT>;
    /**
     * GridView container style
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * The height of the grid item. By default all items are squares.
     */
    itemHeight?: number;
    /** used for autotests */
    testID?: string;
};

export type LayoutCell = {
    height: number;
    x: number;
    y: number;
};

export type Layout = Record<string, LayoutCell>;

export type MasonryItem<Item> = { key: string; item?: Item; aspectRatio: number };
