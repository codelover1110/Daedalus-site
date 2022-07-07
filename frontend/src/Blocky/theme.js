/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Dark theme.
 */

import Blockly from 'blockly/core';


// Temporarily required to ensure there's no conflict with
// Blockly.Themes.Dark
Blockly.registry.unregister('theme', 'dark');

/**
 * Dark theme.
 */
export default Blockly.Theme.defineTheme('dark2', {
  'base': Blockly.Themes.Classic,
  'blockStyles': {

  },
  'fontStyles': {
    "family": "Georgia, serif",
        "weight": "bold",
        "size": 50
  },
  'componentStyles': {
    'workspaceBackgroundColour': '#212329',
    'toolboxBackgroundColour': '#212329',
    'toolboxForegroundColour': '#fff',
    'flyoutBackgroundColour': '#16171B',
    'flyoutForegroundColour': '#16171B',
    'flyoutOpacity': 1,
    'scrollbarColour': 'white',
    'insertionMarkerColour': '#4170F0',
    'insertionMarkerOpacity': 0.3,
    'scrollbarOpacity': 0.1,
    'cursorColour': 'white',
    'blackBackground': '#333',
  },
});
