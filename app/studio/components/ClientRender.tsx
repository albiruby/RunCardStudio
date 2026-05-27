import { useExportSize, getExportSizeClasses } from './SharedTemplates';
/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { useState, useEffect, ReactNode } from 'react';

export default function ClientRender({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : <>{fallback}</>;
}
