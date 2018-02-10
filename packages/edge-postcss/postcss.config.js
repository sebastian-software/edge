/* eslint-disable quote-props */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/unambiguous */

const appRootDir = require("app-root-dir").get()
const resolve = require("path").resolve

module.exports = ({ file, options, env }) => ({
  "plugins":
  {
    // ====================================================
    // ================== MERGING =========================
    // ====================================================

    // `@import()` plugin to include other PostCSS compatible files.
    // https://github.com/postcss/postcss-import
    "postcss-import": {},



    // ====================================================
    // ================= URLS/ASSETS ======================
    // ====================================================

    // Re-rebasing url()-referenced assets during processing.
    // Respects locations of imported files and PostCSS configured output location.
    // https://github.com/sebastian-software/postcss-smart-asset
    "postcss-smart-asset": {},

    // Asset Manager for PostCSS. For us mainly interesting
    // for its support for detecting image dimensions and
    // base64 based inlining.
    // https://github.com/borodean/postcss-assets
    "postcss-assets": {},



    // ====================================================
    // =================== CLEANUP ========================
    // ====================================================

    // Discard comments in your CSS files with PostCSS.
    // https://github.com/ben-eb/postcss-discard-comments
    // Remove all comments... we don't need them further down the line
    // which improves performance (reduces number of AST nodes)
    "postcss-discard-comments": {
      "removeAll": true
    },



    // ====================================================
    // ================ SASS INSPIRED =====================
    // ====================================================

    // Enabling configuration maps.
    // Reading default configuration map from root source folder.
    // https://github.com/pascalduez/postcss-map
    "postcss-map": {
      basePath: resolve(appRootDir, "src/"),
      maps: []
    },

    // Sass-like mixins
    // Needs to be executed before any variable handling plugins
    // https://github.com/andyjansson/postcss-sassy-mixins
    "postcss-sassy-mixins": {},

    // Converts Sass-like variables and conditionals into CSS.
    // https://github.com/jonathantneal/postcss-advanced-variables
    "postcss-advanced-variables": {
      "variables": {}
    },

    // Unwrap nested rules like how Sass does it.
    // https://github.com/postcss/postcss-nested
    "postcss-nested": {},



    // ====================================================
    // ================= NORMALIZE ========================
    // ====================================================

    // Add normalize.css as needed - automatically - and optimized for the defined browserslist.
    // https://github.com/jonathantneal/postcss-normalize
    "postcss-normalize": {},



    // ====================================================
    // ================== LAYOUT ==========================
    // ====================================================

    // Fractional grid system built with calc(). Supports masonry, vertical, and waffle grids.
    // https://github.com/peterramsing/lost
    "lost": {},

    // A PostCSS plugin to keep CSS grids stupidly simple
    // See also: https://github.com/sylvainpolletvillard/postcss-grid-kiss
    "postcss-grid-kiss": {
      "fallback": true,
      "screwIE": true
    },

    // Clearfix fallback for `display: flow-root`
    // https://github.com/fliptheweb/postcss-flow-root
    "postcss-flow-root": {},



    // ====================================================
    // ================== COLOR ===========================
    // ====================================================

    // Transform CSS2 color keywords to a custom palette
    // https://github.com/sebastian-software/postcss-better-colors
    "postcss-better-colors": {
      "palette": "mrmrs"
    },

    // Adds shorthand hex methods to rbga() values.
    // https://github.com/seaneking/postcss-hexrgba
    "postcss-hexrgba": {},

    // Transform CSS4 HSL Syntax into CSS3 HSL
    // https://github.com/dmarchena/postcss-color-hsl
    "postcss-color-hsl": {},

    // Transform W3C CSS hwb() function to more compatible CSS (rgb() or rgba()).
    // https://github.com/postcss/postcss-color-hwb
    "postcss-color-hwb": {},

    // Transform RGBA hexadecimal notations (#RRGGBBAA or #RGBA) to more compatible CSS (rgba())
    // https://github.com/postcss/postcss-color-hex-alpha
    "postcss-color-hex-alpha": {},

    // Transform W3C CSS color function to more compatible CSS
    // https://github.com/postcss/postcss-color-function
    "postcss-color-function": {},

    // Create smooth linear-gradients that approximate easing functions.
    // https://github.com/larsenwork/postcss-easing-gradients
    "postcss-easing-gradients": {},



    // ====================================================
    // =============== MEDIA QUERIES ======================
    // ====================================================

    // Writing simple and graceful Media Queries!
    // Support for CSS Media Queries Level 4: https://drafts.csswg.org/mediaqueries/#mq-range-context
    // https://github.com/postcss/postcss-media-minmax
    "postcss-media-minmax": {},

    // Custom Media Queries
    // https://github.com/postcss/postcss-custom-media
    "postcss-custom-media": {},



    // ====================================================
    // ================== EFFECTS =========================
    // ====================================================

    // Adds @keyframes from Magic Animations
    // https://github.com/nucliweb/postcss-magic-animations
    "postcss-magic-animations": {},

    // Insert 3D hack before will-change property
    // https://github.com/postcss/postcss-will-change
    "postcss-will-change": {},

    // Replace easing names from http://easings.net to `cubic-bezier()`.
    // https://github.com/postcss/postcss-easings
    "postcss-easings": {},

    // Fallback for Webkit Filters property to SVG filters. Amazing stuff.
    // It converts all 10 CSS shorthand filters:
    // grayscale, sepia, saturate, hue-rotate, invert, opacity, brightness, contrast, blur, drop-shadow
    // https://github.com/iamvdo/pleeease-filters
    "pleeease-filters": {},

    // Use shorthand transform properties in CSS
    // https://github.com/jonathantneal/postcss-transform-shortcut
    "postcss-transform-shortcut": {},



    // ====================================================
    // ================= EXTENSIONS =======================
    // ====================================================

    // Support for "initial" keyword for CSS properties + support for
    // "all" property to reset all inherited styles.
    // https://github.com/maximkoretskiy/postcss-initial
    "postcss-initial": {
      "reset": "inherited"
    },

    // Automagical responsive typography. Adds a responsive property to font-size,
    // line-height and letter-spacing that generates complex calc and vw based font sizes.
    // https://github.com/seaneking/postcss-responsive-type
    "postcss-responsive-type": {},

    // Adds fix and fix-legacy attributes to the clear property, for self-clearing of children.
    // https://github.com/seaneking/postcss-clearfix
    "postcss-clearfix": {},

    // Transform W3C CSS "font-family: system-ui" to a practical font-family list
    // https://github.com/JLHwung/postcss-font-family-system-ui
    // See also: https://booking.design/implementing-system-fonts-on-booking-com-a-lesson-learned-bdc984df627f
    "postcss-font-family-system-ui": {},



    // ====================================================
    // ================== FIXES ===========================
    // ====================================================

    // Transform W3C CSS font variant properties to more compatible CSS (font-feature-settings).
    // https://github.com/postcss/postcss-font-variant
    "postcss-font-variant": {},

    // Fix up CSS gradients with transparency for older browsers
    // https://github.com/gilmoreorless/postcss-gradient-transparency-fix
    "postcss-gradient-transparency-fix": {},

    // Tries to fix all of flexbug's issues
    // https://github.com/luisrudge/postcss-flexbugs-fixes
    "postcss-flexbugs-fixes": {},

    // Adds new pseudo-elements to inputs for easy cross-browser styling of their inner elements.
    // Currently, as of 0.3.0, supports range input controls only.
    // https://github.com/seaneking/postcss-input-style
    "postcss-input-style": {},

    // Transform :matches() W3C CSS pseudo class to more compatible CSS (simpler selectors)
    // https://github.com/postcss/postcss-selector-matches
    "postcss-selector-matches": {},

    // Add single and double colon peudo selectors
    // Normalizes e.g. `::before` to `:before` for wider browser support
    // https://github.com/axa-ch/postcss-pseudoelements
    "postcss-pseudoelements": {},

    // Parse CSS and add vendor prefixes to rules by Can I Use
    // https://github.com/postcss/autoprefixer
    "autoprefixer": {},



    // ====================================================
    // ================ OPTIMIZATION ======================
    // ====================================================

    // Reduce calc()
    // Note: Important to keep this after mixin/variable processing
    // https://github.com/postcss/postcss-calc
    "postcss-calc": {},

    // Reduce z-index values.
    // https://github.com/ben-eb/postcss-zindex
    "postcss-zindex": {},

    // Adding the best CSS compressor to the chain.
    // https://github.com/lahmatiy/postcss-csso
    "postcss-csso": {},



    // ====================================================
    // ============ DEVELOPER FEEDBACK ====================
    // ====================================================

    // Sass like @warn for PostCSS. Disabling internal usage of "postcss-reporter".
    // https://github.com/ben-eb/postcss-at-warn
    "postcss-at-warn": {
      "silent": true
    }
  }
})
