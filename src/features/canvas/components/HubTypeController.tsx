'use client';

import { useEffect } from 'react';
import { useHubStore } from '../../../stores/hubStore';

export const HubTypeController: React.FC = () => {
  const { hubType } = useHubStore();

  useEffect(() => {
    const container = document.querySelector('.hub-container');
    if (container) {
      container.setAttribute('data-hub-type', hubType);
    }
  }, [hubType]);

  return null;
};
