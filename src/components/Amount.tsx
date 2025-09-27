import React from 'react';
import clsx from 'clsx';
import styles from './Amount.module.scss';

type Variant = 'inline' | 'chip' | 'badge';

type Props = {
  value: number | string;
  code?: string; // currency code label, e.g., FLC
  decimals?: number; // number of fraction digits
  compact?: boolean; // 1k/1.2M formatting
  variant?: Variant;
  className?: string;
  icon?: boolean; // show a small coin icon
};

const parseValue = (v: number | string): number => {
  if (typeof v === 'number') return v;
  // Strip spaces and thousands separators, keep digits and dot/comma
  const normalized = v
    .toString()
    .replace(/\s/g, '')
    .replace(/,(?=\d{3}(\D|$))/g, '')
    .replace(/\u00A0/g, '')
    .replace(/\u202F/g, '');
  const asNumber = Number(normalized.replace(',', '.'));
  return Number.isFinite(asNumber) ? asNumber : 0;
};

export default function Amount({
  value,
  code = 'FLC',
  decimals = 0,
  compact = false,
  variant = 'inline',
  className,
  icon = false,
}: Props) {
  const num = parseValue(value);

  const formatter = new Intl.NumberFormat(undefined, {
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

  const formatted = formatter.format(num);

  const wrapperClass = clsx(styles.amount, styles[variant], className);

  return (
    <span className={wrapperClass}>
      {icon && (
        <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15" />
          <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      )}
      <span>{formatted}</span>
      <span className={styles.code}> {code}</span>
    </span>
  );
}

