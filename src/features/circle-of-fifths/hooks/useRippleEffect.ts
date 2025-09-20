import { useState, useCallback } from 'react';

/**
 * リップルエフェクトの状態管理フック
 */
export const useRippleEffect = () => {
  const [isRippleActive, setIsRippleActive] = useState(false);

  const triggerRipple = useCallback(() => {
    setIsRippleActive(true);
    // リップルを一定時間後に自動的にリセット
    setTimeout(() => setIsRippleActive(false), 100);
  }, []);

  const resetRipple = useCallback(() => {
    setIsRippleActive(false);
  }, []);

  return {
    isRippleActive,
    triggerRipple,
    resetRipple,
  };
};
