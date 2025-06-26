/// <reference types="@figma/plugin-typings" />

figma.showUI(__html__, { width: 320, height: 200 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'export-selection') {
    const selection = figma.currentPage.selection;
    if (selection.length !== 1) {
      figma.notify("⚠️ Select exactly one frame or group.");
      return;
    }

    const node = selection[0];
    if (!("exportAsync" in node)) {
      figma.notify("❌ Cannot export that node.");
      return;
    }

    try {
      const svgBytes = await node.exportAsync({ format: "SVG" });
      // Send raw bytes array to UI
      figma.ui.postMessage({ type: 'svg-bytes', bytes: Array.from(svgBytes) });
      // don’t close the plugin — let the UI handle it
    } catch (err) {
      figma.notify("❌ Export failed – see console.");
      console.error("SVG export error:", err);
    }
  }
};
