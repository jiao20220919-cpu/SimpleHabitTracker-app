/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as Icons from 'lucide-react';

interface HabitIconProps {
  name: string;
  className?: string;
}

export const HabitIcon: React.FC<HabitIconProps> = ({ name, className }) => {
  // Safe dynamic lookup for lucide icons
  const IconComponent = (Icons as Record<string, any>)[name] || Icons.CheckCircle2;
  return <IconComponent className={className} id={`icon-${name}`} />;
};
