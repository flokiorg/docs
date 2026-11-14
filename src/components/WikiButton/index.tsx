import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import Link from '@docusaurus/Link';
import FlokicoinLogo from '@site/src/assets/Flokicoin.svg'

type Props = {
    to: string;
    label: string;
};

export default function WikiButton(props: Props): JSX.Element {
    return (
        <div className={clsx(styles.wikiButton, 'text--center')}>
            <p className="text--center">
                <Link className={clsx(styles.wikiButtonButton, 'button button--secondary button--lg')} to={props.to}>
                    <span className={styles.wikiButtonIcon}><FlokicoinLogo /></span>
                    <span className={styles.wikiButtonText}>{props.label}</span>
                </Link>
            </p>
        </div>
    );
}
