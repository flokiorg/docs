import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import type {Props} from '@theme/Admonition/Type/Note';
import AdmonitionLayout from '@theme/Admonition/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass } from '@fortawesome/free-regular-svg-icons';

const infimaClassName = 'alert alert--primary feature-card';

const defaultProps = {
  icon: <FontAwesomeIcon icon={faCompass} />,
  title: (
    <Translate
      id="theme.admonition.feature"
      description="The default label used for the Feature admonition (:::feature)">
      feature
    </Translate>
  ),
};

export default function AdmonitionTypeFeature(props: Props): JSX.Element {
  return (
    <AdmonitionLayout
      {...defaultProps}
      {...props}
      className={clsx(infimaClassName, props.className)}>
      {props.children}
    </AdmonitionLayout>
  );
}

