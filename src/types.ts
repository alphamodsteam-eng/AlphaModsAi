import React from 'react';

export type NavItem = 'home' | 'history' | 'sparkles' | 'stats' | 'profile';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-wc': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        autoplay?: boolean | string;
        loop?: boolean | string;
        style?: React.CSSProperties;
      }, HTMLElement>;
    }
  }
}
