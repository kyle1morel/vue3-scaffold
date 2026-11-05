/*

BC Design System tokens, the source for every value below that has one
https://www2.gov.bc.ca/gov/content/digital/design-system/foundations/design-tokens

PrimeVue design tokens ref
https://github.com/primefaces/primevue/blob/master/packages/themes/src/presets/material/base/index.js

*/

import * as tokens from '@bcgov/design-tokens/js';
import { definePreset } from '@primeuix/themes';
import Material from '@primeuix/themes/material';

// A component css override replaces Material's css for that component, so extend it instead
const materialCss = (component: string, options: unknown) => {
  const css = (Material.components as Record<string, { css?: unknown }>)[component]?.css;
  if (typeof css === 'function') return css(options);
  return typeof css === 'string' ? css : '';
};

export const ThemeOverride = definePreset(Material, {
  // Must use lower case for primitive keys unless you want pain
  primitive: {
    // bcblue.950 is the BC primary blue; BC has 10 shades, so 50 is filled with the BC info surface
    bcblue: {
      50: tokens.supportSurfaceColorInfo,
      100: tokens.themeBlue10,
      200: tokens.themeBlue20,
      300: tokens.themeBlue30,
      400: tokens.themeBlue40,
      500: tokens.themeBlue50,
      600: tokens.themeBlue60,
      700: tokens.themeBlue70,
      800: tokens.themeBlue80,
      900: tokens.themeBlue90,
      950: tokens.themeBlue100
    },
    // BC has no green scale, only the success tokens; the rest are tints and shades of the success border
    green: {
      50: tokens.supportSurfaceColorSuccess,
      100: '#d9e6db',
      200: '#b3cdb7',
      300: '#8eb392',
      400: '#689a6e',
      500: tokens.supportBorderColorSuccess,
      600: tokens.supportBorderColorSuccess,
      700: '#35673b',
      800: '#284d2c',
      900: '#1a341e',
      950: '#0d1a0f'
    },
    // BC has 10 gold shades, so 50 is filled with the lightest grey
    gold: {
      50: tokens.themeGray10,
      100: tokens.themeGold10,
      200: tokens.themeGold20,
      300: tokens.themeGold30,
      400: tokens.themeGold40,
      500: tokens.themeGold50,
      600: tokens.themeGold60,
      700: tokens.themeGold70,
      800: tokens.themeGold80,
      900: tokens.themeGold90,
      950: tokens.themeGold100
    },
    greyscale: {
      50: tokens.themeGray10,
      100: tokens.themeGray20,
      200: tokens.themeGray30,
      300: tokens.themeGray40,
      400: tokens.themeGray50,
      500: tokens.themeGray60,
      600: tokens.themeGray70,
      700: tokens.themeGray80,
      800: tokens.themeGray90,
      900: tokens.themeGray100,
      950: tokens.themeGray110
    },
    // BC has no red scale, so it is banded from the danger surface, default and hover tokens
    red: {
      50: tokens.supportSurfaceColorDanger,
      100: tokens.supportSurfaceColorDanger,
      200: tokens.supportSurfaceColorDanger,
      300: tokens.supportSurfaceColorDanger,
      400: tokens.surfaceColorPrimaryDangerButtonDefault,
      500: tokens.surfaceColorPrimaryDangerButtonDefault,
      600: tokens.surfaceColorPrimaryDangerButtonDefault,
      700: tokens.surfaceColorPrimaryDangerButtonDefault,
      800: tokens.surfaceColorPrimaryDangerButtonHover,
      900: tokens.surfaceColorPrimaryDangerButtonHover,
      950: tokens.surfaceColorPrimaryDangerButtonHover
    },
    support: {
      border: {
        width: '0.1rem'
      },
      info: {
        border: tokens.supportBorderColorInfo,
        icon: tokens.iconsColorInfo,
        surface: tokens.supportSurfaceColorInfo
      },
      danger: {
        border: tokens.supportBorderColorDanger,
        icon: tokens.iconsColorDanger,
        surface: tokens.supportSurfaceColorDanger
      },
      required: {
        text: '{red.400}'
      },
      success: {
        border: tokens.supportBorderColorSuccess,
        icon: tokens.iconsColorSuccess,
        surface: tokens.supportSurfaceColorSuccess
      },
      warning: {
        border: tokens.supportBorderColorWarning,
        icon: tokens.iconsColorWarning,
        surface: tokens.supportSurfaceColorWarning
      }
    },
    // Medium border meets the 3:1 contrast WCAG requires for control edges
    borderactive: tokens.surfaceColorBorderActive,
    borderdark: tokens.surfaceColorBorderDark,
    borderlight: tokens.surfaceColorBorderDefault,
    bordermedium: tokens.surfaceColorBorderMedium,
    disabledcolor: tokens.surfaceColorPrimaryDisabled,
    overlay: tokens.surfaceColorOverlayDefault,
    primarypressed: tokens.surfaceColorPrimaryPressed,
    surfacehover: tokens.surfaceColorSecondaryHover,
    surfacepressed: tokens.surfaceColorSecondaryPressed,
    textdanger: tokens.typographyColorDanger,
    textlink: tokens.typographyColorLink,
    textprimary: tokens.typographyColorPrimary,
    textsecondary: tokens.typographyColorSecondary,
    white: tokens.themeGrayWhite
  },
  semantic: {
    primary: {
      50: '{bcblue.50}',
      100: '{bcblue.100}',
      200: '{bcblue.200}',
      300: '{bcblue.300}',
      400: '{bcblue.400}',
      500: '{bcblue.500}',
      600: '{bcblue.600}',
      700: '{bcblue.700}',
      800: '{bcblue.800}',
      900: '{bcblue.900}',
      950: '{bcblue.950}'
    },
    disabledOpacity: '0.6',
    content: {
      fontSize: '2rem'
    },
    formField: {
      focusRing: {
        color: '{borderactive}',
        width: tokens.layoutBorderWidthMedium,
        style: 'solid',
        offset: '2px'
      }
    },
    colorScheme: {
      light: {
        surface: {
          0: '{white}',
          50: '{greyscale.50}',
          100: '{greyscale.100}',
          200: '{greyscale.200}',
          300: '{greyscale.300}',
          400: '{greyscale.400}',
          500: '{greyscale.500}',
          600: '{greyscale.600}',
          700: '{greyscale.700}',
          800: '{greyscale.800}',
          900: '{greyscale.900}',
          950: '{greyscale.950}'
        },
        primary: {
          color: '{primary.950}',
          contrastColor: '{white}',
          hoverColor: '{primary.900}',
          activeColor: '{primarypressed}'
        },
        content: {
          hover: {
            background: '{surfacehover}'
          }
        },
        list: {
          option: {
            focusBackground: '{surfacehover}'
          }
        },
        mask: {
          background: '{overlay}'
        },
        text: {
          color: '{textprimary}',
          hoverColor: '{textprimary}',
          mutedColor: '{textsecondary}',
          hoverMutedColor: '{textsecondary}'
        },
        formField: {
          borderColor: '{bordermedium}',
          hoverBorderColor: '{borderdark}',
          focusBorderColor: '{borderactive}',
          invalidBorderColor: '{support.danger.border}',
          floatLabelInvalidColor: '{red.500}',
          disabledBackground: '{disabledcolor}',
          disabledColor: '{surface.600}',
          paddingX: tokens.layoutPaddingSmall,
          paddingY: tokens.layoutPaddingSmall,
          placeholderColor: '{surface.700}'
        },
        highlight: {
          color: '{primary.color}',
          focusColor: '{primary.color}'
        },
        navigation: {
          item: {
            color: '{greyscale.50}'
          }
        }
      }
    }
  },
  components: {
    accordion: {
      header: {
        padding: tokens.layoutPaddingMedium
      },
      // Toggle icon before the title
      css: (options) => `
        ${materialCss('accordion', options)}
        .p-accordionheader { justify-content: flex-start; }
        .p-accordionheader .p-accordionheader-toggle-icon {
          order: -1;
          margin-right: 1rem;
        }
      `
    },
    // Matches the BC design system buttons: BC focus outline on every variant, BC disabled colours, not opacity
    button: {
      root: {
        paddingY: tokens.layoutPaddingSmall,
        focusRing: {
          width: tokens.layoutBorderWidthMedium,
          style: 'solid',
          offset: '2px'
        }
      },
      colorScheme: {
        light: {
          root: {
            primary: {
              focusRing: {
                color: '{borderactive}'
              }
            },
            secondary: {
              background: '{surface.0}',
              hoverBackground: '{surfacehover}',
              activeBackground: '{surfacepressed}',
              borderColor: '{borderdark}',
              hoverBorderColor: '{borderdark}',
              activeBorderColor: '{borderdark}',
              color: '{textprimary}',
              hoverColor: '{textprimary}',
              activeColor: '{textprimary}',
              focusRing: {
                color: '{borderactive}'
              }
            },
            danger: {
              hoverBackground: '{red.800}',
              hoverBorderColor: '{red.800}',
              activeBackground: '{support.danger.surface}',
              activeBorderColor: '{support.danger.surface}',
              activeColor: '{support.danger.border}',
              focusRing: {
                color: '{borderactive}'
              }
            }
          },
          outlined: {
            primary: {
              hoverBackground: '{surfacehover}'
            },
            // Material's grey reads as disabled and fails contrast, so match the BC secondary button
            secondary: {
              hoverBackground: '{surfacehover}',
              activeBackground: '{surfacepressed}',
              borderColor: '{borderdark}',
              color: '{textprimary}'
            }
          },
          text: {
            primary: {
              color: '{textprimary}',
              hoverBackground: '{greyscale.200}',
              activeBackground: '{surfacepressed}'
            }
          },
          link: {
            color: '{textlink}',
            hoverColor: '{textlink}',
            activeColor: '{textlink}'
          }
        }
      },
      // Replaces Material's focus styles, which swap in the pressed colour instead of showing the outline
      css: () => `
        .p-button:disabled {
          opacity: 1;
          background: var(--p-disabledcolor);
          border-color: var(--p-disabledcolor);
          color: var(--p-surface-600);
        }
        .p-button-secondary:disabled { border-color: var(--p-borderlight); }
        .p-button-text:disabled,
        .p-button-link:disabled {
          background: transparent;
          border-color: transparent;
        }
        .p-button:not(:disabled):hover .p-button-label { text-decoration: underline; }
      `
    },
    card: {
      body: {
        padding: tokens.layoutPaddingMedium
      },
      root: {
        borderRadius: tokens.layoutBorderRadiusLarge
      },
      title: {
        fontSize: tokens.typographyFontSizeBody
      },
      css: () => `
        .p-card {
          border: 1px solid var(--p-borderlight);
          margin-bottom: 1rem;
        }
        .p-card .p-divider { margin-bottom: 0; }
      `
    },
    datatable: {
      paginatorBottom: {
        borderWidth: '0'
      },
      css: (options) => `
        ${materialCss('datatable', options)}
        .p-datatable .p-datatable-loading-icon { color: var(--p-primary-color); }
        .p-datatable .p-paginator { justify-content: flex-end; }
      `
    },
    dialog: {
      title: {
        fontSize: tokens.typographyFontSizeH5,
        fontWeight: String(tokens.typographyFontWeightsBold)
      },
      // Footer buttons are written primary-first; reverse them so the primary action sits on the right
      css: () => `
        .p-dialog-footer {
          flex-direction: row-reverse;
          justify-content: flex-start;
        }
      `
    },
    menu: {
      item: {
        color: '{text.color}',
        icon: {
          color: '{text.color}'
        }
      }
    },
    menubar: {
      root: {
        gap: '0'
      },
      baseItem: {
        borderRadius: 'none'
      },
      item: {
        focusBackground: '{primary.activeColor}',
        focusColor: '{surface.0}',
        activeBackground: '{primary.activeColor}',
        activeColor: '{surface.0}',
        borderRadius: 'none',
        padding: '0.45rem 0.45rem'
      },
      submenu: {
        padding: 'none'
      },
      colorScheme: {
        light: {
          root: {
            background: '{primary.900}',
            borderColor: '{primary.900}',
            borderRadius: 'none',
            padding: 'none'
          },
          submenu: {
            background: '{primary.900}'
          }
        }
      }
    },
    message: {
      colorScheme: {
        light: {
          error: {
            background: '{support.danger.surface}',
            color: '{textsecondary}'
          },
          info: {
            background: '{support.info.surface}',
            color: '{textsecondary}'
          },
          success: {
            background: '{support.success.surface}',
            color: '{textsecondary}'
          },
          warn: {
            background: '{support.warning.surface}',
            color: '{textsecondary}'
          }
        }
      },
      // Setting the message.root.borderWidth token causes the border to overflow the parent, causing alignment issues.
      // This workaround uses outline with an offset to render a border within bounds of parent.
      // Message has no icon colour token, so the BC icon colours are set here too.
      css: () => `
        .p-message {
          outline-width: var(--p-support-border-width);
          outline-offset: calc(-1 * var(--p-support-border-width));
        }
        .p-message-error { outline-color: var(--p-support-danger-border); }
        .p-message-info { outline-color: var(--p-support-info-border); }
        .p-message-success { outline-color: var(--p-support-success-border); }
        .p-message-warn { outline-color: var(--p-support-warning-border); }
        .p-message-error .p-message-icon { color: var(--p-support-danger-icon); }
        .p-message-info .p-message-icon { color: var(--p-support-info-icon); }
        .p-message-success .p-message-icon { color: var(--p-support-success-icon); }
        .p-message-warn .p-message-icon { color: var(--p-support-warning-icon); }
      `
    },
    panel: {
      header: { padding: '1.5rem 2.25rem 1.5rem 2.25rem' },
      toggleableHeader: { padding: '1.5rem 2.25rem 1.5rem 2.25rem' },
      content: { padding: '0 2.25rem 1.5rem 2.25rem' },
      css: () => `
        .p-panel {
          box-shadow: 0px 1.5px 6px 0px rgba(0, 0, 0, 0.25);
          border: none;
        }`
    },
    radiobutton: {
      icon: {
        size: '10px',
        checkedColor: '{disabledcolor}',
        checkedHoverColor: '{disabledcolor}',
        disabledColor: '{form.field.disabled.color}'
      },
      css: () => '.p-radiobutton-checked .p-radiobutton-box { border-width: thick }'
    },
    progressspinner: {
      colorScheme: {
        light: {
          root: {
            colorOne: '{primary.color}',
            colorTwo: '{primary.color}',
            colorThree: '{primary.color}',
            colorFour: '{primary.color}'
          }
        }
      }
    },
    tabs: {
      tab: {
        color: '{primary.color}'
      },
      tabpanel: {
        padding: '1.2rem 1.2rem 1.2rem 1.2rem'
      },
      css: (options) => `${materialCss('tabs', options)} .p-tab { text-decoration: underline; }`
    },
    tooltip: {
      root: {
        background: '{surface.800}',
        color: '{surface.0}'
      }
    },
    toast: {
      root: {
        borderWidth: '{support.border.width}'
      },
      colorScheme: {
        light: {
          error: {
            background: '{support.danger.surface}',
            borderColor: '{support.danger.border}',
            color: '{textsecondary}',
            detailColor: '{textsecondary}',
            closeButton: {
              hoverBackground: '{red.200}',
              focusRing: { color: '{red.600}', shadow: 'none' }
            }
          },
          info: {
            background: '{support.info.surface}',
            borderColor: '{support.info.border}',
            color: '{textsecondary}',
            detailColor: '{textsecondary}',
            closeButton: {
              hoverBackground: '{bcblue.200}',
              focusRing: { color: '{bcblue.600}', shadow: 'none' }
            }
          },
          success: {
            background: '{support.success.surface}',
            borderColor: '{support.success.border}',
            color: '{textsecondary}',
            detailColor: '{textsecondary}',
            closeButton: {
              hoverBackground: '{green.200}',
              focusRing: { color: '{green.600}', shadow: 'none' }
            }
          },
          warn: {
            background: '{support.warning.surface}',
            borderColor: '{support.warning.border}',
            color: '{textsecondary}',
            detailColor: '{textsecondary}',
            closeButton: {
              hoverBackground: '{gold.300}',
              focusRing: { color: '{gold.600}', shadow: 'none' }
            }
          }
        }
      }
    }
  }
});
