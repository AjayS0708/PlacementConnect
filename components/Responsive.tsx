'use client';

import { ReactNode } from 'react';
import { useIsMobile, useIsTablet, useIsDesktop, useBreakpoint, Breakpoint, matchesBreakpoint } from '@/utils/responsive';

interface ResponsiveProps {
  children: ReactNode;
}

/**
 * Show content only on mobile devices
 */
export function MobileOnly({ children }: ResponsiveProps) {
  const isMobile = useIsMobile();
  return isMobile ? <>{children}</> : null;
}

/**
 * Show content only on tablet devices
 */
export function TabletOnly({ children }: ResponsiveProps) {
  const isTablet = useIsTablet();
  return isTablet ? <>{children}</> : null;
}

/**
 * Show content only on desktop devices
 */
export function DesktopOnly({ children }: ResponsiveProps) {
  const isDesktop = useIsDesktop();
  return isDesktop ? <>{children}</> : null;
}

/**
 * Show content on mobile and tablet
 */
export function MobileAndTablet({ children }: ResponsiveProps) {
  const isDesktop = useIsDesktop();
  return !isDesktop ? <>{children}</> : null;
}

/**
 * Hide content on mobile devices
 */
export function HiddenOnMobile({ children }: ResponsiveProps) {
  const isMobile = useIsMobile();
  return !isMobile ? <>{children}</> : null;
}

/**
 * Responsive component with breakpoint-based rendering
 */
export function Responsive({
  children,
  min,
  max,
}: {
  children: ReactNode;
  min?: Breakpoint;
  max?: Breakpoint;
}) {
  const currentBreakpoint = useBreakpoint();

  const shouldShow = () => {
    if (min && !matchesBreakpoint(currentBreakpoint, min)) {
      return false;
    }
    if (max && matchesBreakpoint(currentBreakpoint, max)) {
      return false;
    }
    return true;
  };

  return shouldShow() ? <>{children}</> : null;
}

/**
 * Responsive container with different layouts per breakpoint
 */
export function ResponsiveLayout({
  mobile,
  tablet,
  desktop,
}: {
  mobile: ReactNode;
  tablet?: ReactNode;
  desktop?: ReactNode;
}) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  if (isMobile) return <>{mobile}</>;
  if (isTablet && tablet) return <>{tablet}</>;
  if (desktop) return <>{desktop}</>;
  
  return <>{mobile}</>;
}

/**
 * Responsive grid that adjusts columns based on breakpoint
 */
export function ResponsiveGrid({
  children,
  mobileColumns = 1,
  tabletColumns = 2,
  desktopColumns = 3,
  gap = '1rem',
  className,
}: {
  children: ReactNode;
  mobileColumns?: number;
  tabletColumns?: number;
  desktopColumns?: number;
  gap?: string;
  className?: string;
}) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const columns = isMobile
    ? mobileColumns
    : isTablet
    ? tabletColumns
    : desktopColumns;

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Responsive spacer with different heights per breakpoint
 */
export function ResponsiveSpacer({
  mobile = '1rem',
  tablet,
  desktop,
}: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const height = isMobile ? mobile : isTablet && tablet ? tablet : desktop || mobile;

  return <div style={{ height }} />;
}

/**
 * Responsive text size component
 */
export function ResponsiveText({
  children,
  mobile = 'text-base',
  tablet,
  desktop,
  className,
}: {
  children: ReactNode;
  mobile?: string;
  tablet?: string;
  desktop?: string;
  className?: string;
}) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const sizeClass = isMobile
    ? mobile
    : isTablet && tablet
    ? tablet
    : desktop || mobile;

  return <div className={`${sizeClass} ${className || ''}`}>{children}</div>;
}
