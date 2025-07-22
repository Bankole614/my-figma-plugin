/// <reference types="@figma/plugin-typings" />

figma.showUI(__html__, { width: 400, height: 600 });

// Send project name to UI on load
figma.ui.postMessage({ type: 'init', projectName: figma.root.name });

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'export-svg') {
    const sel = figma.currentPage.selection;
    if (!sel.length) {
      figma.notify('Select a frame');
      return;
    }

    try {
      const bytes = await sel[0].exportAsync({ format: 'SVG' });
      const svgStr = new TextDecoder().decode(bytes);
      figma.ui.postMessage({ type: 'svg', svg: btoa(svgStr) });
    } catch (err) {
      figma.notify('Export failed');
    }
  }
};
