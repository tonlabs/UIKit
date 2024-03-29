import type BigNumber from 'bignumber.js';
import React from 'react';
import type { UIAmountInputProps } from '../types';

export function useDefaultValue(
    defaultAmount: UIAmountInputProps['defaultAmount'],
    formatAmount: (amount: BigNumber) => {
        formattedText: string;
        normalizedText: string;
        caretPosition: number;
    },
):
    | {
          formattedText: string;
          normalizedText: string;
          caretPosition: number;
      }
    | undefined {
    const defaultAmountRef = React.useRef(defaultAmount);
    const defaultValue = React.useMemo(() => {
        if (!defaultAmountRef.current) {
            return undefined;
        }
        return formatAmount(defaultAmountRef.current);
    }, [formatAmount]);
    return defaultValue;
}
