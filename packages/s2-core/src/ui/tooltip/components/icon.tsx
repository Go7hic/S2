import React from 'react';
import { TOOLTIP_DEFAULT_ICON_PROPS } from '@/common/constant/tooltip';
import { IconProps } from '@/common/interface/tooltip';
import { getIcon, HtmlIcon } from '@/common/icons';

export const Icon = (props: IconProps) => {
  const { icon, ...attrs } = props;

  if (!icon) {
    return null;
  }

  if (getIcon(icon as string)) {
    const name = icon as string;

    return <HtmlIcon name={name} {...TOOLTIP_DEFAULT_ICON_PROPS} {...attrs} />;
  }
  const Component = icon as React.ComponentClass;
  return <Component {...TOOLTIP_DEFAULT_ICON_PROPS} {...attrs} />;
};
