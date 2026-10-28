/*

BCGov design system colour guide
https://www2.gov.bc.ca/gov/content/digital/design-system/foundations/colour

Good site for generating shades
https://maketintsandshades.com/#003366

PrimeVue design tokens ref
https://github.com/primefaces/primevue/blob/master/packages/themes/src/presets/material/base/index.js

*/

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
      50: '#F7F9FC',
      100: '#F1F8FE',
      200: '#D8EAFD',
      300: '#C1DDFC',
      400: '#A8D0FB',
      500: '#91C4FA',
      600: '#7AB8F9',
      700: '#5595D9',
      800: '#3470B1',
      900: '#1E5189',
      950: '#013366'
    },
    green: {
      // Override base green hues, for base values see link at top
      50: '#F6FFF8',
      100: '#d9e6db',
      200: '#b3cdb7',
      300: '#8eb392',
      400: '#689a6e',
      500: '#42814A',
      600: '#42814A',
      700: '#35673b',
      800: '#284d2c',
      900: '#1a341e',
      950: '#0d1a0f'
    },
    gold: {
      50: '#FAF9F8',
      100: '#FEF8E8',
      200: '#FEF0D8',
      300: '#FDE9C4',
      400: '#FCE2B0',
      500: '#FBDA9D',
      600: '#FBD389',
      700: '#FACC75',
      800: '#F9C462',
      900: '#F8BA47',
      950: '#FCBA19'
    },
    greyscale: {
      50: '#FAF9F8',
      100: '#F3F2F1',
      200: '#ECEAE8',
      300: '#E0DEDC',
      400: '#D1CFCD',
      500: '#C6C5C3',
      600: '#9F9D9C',
      700: '#605E5C',
      800: '#3D3C3B',
      900: '#353433',
      950: '#252423'
    },
    red: {
      // Override base red hues, for base values see link at top
      50: '#F4E1E2',
      100: '#F4E1E2',
      200: '#F4E1E2',
      300: '#F4E1E2',
      400: '#CE3E39',
      500: '#CE3E39',
      600: '#CE3E39',
      700: '#CE3E39',
      800: '#A2312D',
      900: '#A2312D',
      950: '#A2312D'
    },
    support: {
      border: {
        width: '0.1rem'
      },
      info: {
        border: '#053662',
        icon: '#053662',
        surface: '#F7F9FC'
      },
      danger: {
        border: '#CE3E39',
        icon: '#CE3E39',
        surface: '#F4E1E2'
      },
      required: {
        text: '{red.400}'
      },
      success: {
        border: '#42814A',
        icon: '#42814A',
        surface: '#F6FFF8'
      },
      warning: {
        border: '#F8BB47',
        icon: '#F8BB47',
        surface: '#FEF1D8'
      }
    },
    // BC border tokens; medium meets the 3:1 contrast WCAG requires for control edges
    borderactive: '#2E5DD7',
    borderdark: '#353433',
    borderlight: '#D8D8D8',
    bordermedium: '#898785',
    disabledcolor: '#EDEBE9',
    primarypressed: '#01264C',
    surfacehover: '#EDEBE9',
    surfacepressed: '#E0DEDC',
    textdanger: '#CE3E39',
    textlink: '#255A90',
    textprimary: '#2D2D2D',
    textsecondary: '#474543',
    white: '#FFFFFF'
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
        width: '2px',
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
          background: 'rgba(0, 0, 0, 0.45)'
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
          paddingX: '0.5rem',
          paddingY: '0.5rem',
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
        padding: '1rem'
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
        paddingY: '0.5rem',
        focusRing: {
          width: '2px',
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
        padding: '1rem'
      },
      root: {
        borderRadius: '0.5rem'
      },
      title: {
        fontSize: '1rem'
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
        fontSize: '1.25rem',
        fontWeight: 'bold'
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
