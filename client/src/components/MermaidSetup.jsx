import React, { useRef, useEffect } from "react";
import mermaid from "mermaid";

// Initialize Mermaid once when the file loads
mermaid.initialize({
    startOnLoad: false,
    theme: "default",
});


// Removes unwanted escape characters and ensures the chart starts with a valid Mermaid graph declaration.
const cleanMermaidChart = (diagram) => {
    if (!diagram) return "";

    let clean = diagram
        .replace(/\r?\n/g, "\n")
        .trim()

    // If graph direction is missing, prepend one
    if (!clean.trim().startsWith("graph")) {
        clean = `graph TD\n${clean}`;
    }

    return clean;
};




// Convert labels like [Node Name] into unique Mermaid node IDs while reusing IDs for duplicate labels.
const autoFixNotes = (diagram) => {
  // Counter used to generate unique node IDs
  let index = 0;

  // Stores already-created nodes
  // Key   = node label
  // Value = generated Mermaid node string
  const used = new Map();

  // Find all text inside square brackets
  return diagram.replace(/\[(.*?)\]/g, (match, label) => {

    // Remove extra spaces from label
    const key = label.trim();

    // If this label already exists,
    // reuse the same node instead of creating a new one
    if (used.has(key)) {
      return used.get(key);
    }

    // Generate new node ID
    index++;

    // Example:
    // N1["Introduction"]
    // N2["Database"]
    const id = `N${index}`;

    // Mermaid node format
    const node = `${id}["${key}"]`;

    // Save for future reuse
    used.set(key, node);

    return node;
  });
};
function MermaidSetup({ diagram }) {
    // Reference to the div where Mermaid SVG will be injected, when we change containerRef, the div below which has this ref will chnage
    const containerRef = useRef(null);

    useEffect(() => {
        // Stop if no diagram or ref is not mounted yet
        if (!diagram || !containerRef.current) return;

        const renderDiagram = async () => {
            try {
                // Clear previous SVG before rendering a new one
                containerRef.current.innerHTML = "";

                // Generate a unique ID for Mermaid
                const uniqueId = `mermaid-${Math.random()
                    .toString(36)
                    .substring(2, 9)}`;

                // Sanitize Mermaid text before rendering
                const safeChart = autoFixNotes(cleanMermaidChart(diagram));

                // Convert Mermaid syntax into SVG
                const { svg } = await mermaid.render(
                    uniqueId,
                    safeChart
                );

                // Inject SVG into DOM
                containerRef.current.innerHTML = svg;
            } catch (error) {
                console.error(
                    "Mermaid render failed:",
                    error
                );
            }
        };

        renderDiagram();
    }, [diagram]);

    return (
        <div className="bg-white border rounded-lg p-4 overflow-x-auto">
            <div ref={containerRef} />
        </div>
    );
}

export default MermaidSetup;