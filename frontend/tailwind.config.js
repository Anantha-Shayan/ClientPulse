export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#faf8ff',
        surface: '#faf8ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2f3ff',
        'surface-container': '#eaedff',
        'surface-container-high': '#e2e7ff',
        'surface-container-highest': '#dae2fd',
        'surface-variant': '#dae2fd',
        'on-surface': '#131b2e',
        'on-surface-variant': '#434655',
        'inverse-surface': '#283044',
        'inverse-on-surface': '#eef0ff',
        outline: '#747687',
        'outline-variant': '#c4c5d8',
        primary: '#0038bd',
        'primary-container': '#1b4fe8',
        'primary-fixed': '#dde1ff',
        'primary-fixed-dim': '#b8c4ff',
        secondary: '#515f74',
        'secondary-container': '#d5e3fd',
        tertiary: '#005338',
        'tertiary-container': '#006e4b',
        'tertiary-fixed': '#7ff9c1',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        ink: '#131b2e',
        mist: '#f2f3ff',
        leaf: '#006e4b',
        amber: '#b7791f',
        coral: '#ba1a1a',
        ocean: '#1b4fe8'
      },
      boxShadow: {
        sm: '0 1px 3px rgba(15, 23, 42, 0.08)',
        md: '0 4px 12px rgba(15, 23, 42, 0.12)',
        lg: '0 12px 32px rgba(15, 23, 42, 0.15)',
        panel: '0 12px 32px rgba(15, 23, 42, 0.12)'
      },
      fontSize: {
        display: ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-1': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'headline-2': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'headline-3': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
        body: ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        label: ['12px', { lineHeight: '1', fontWeight: '500' }]
      }
    }
  },
  plugins: []
};
