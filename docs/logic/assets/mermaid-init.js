// Mermaidの初期化を確実に行う
let mermaidInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    if (typeof mermaid !== 'undefined' && !mermaidInitialized) {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis',
                padding: 20
            },
            themeVariables: {
                primaryColor: '#007bff',
                primaryTextColor: '#ffffff',
                primaryBorderColor: '#0056b3',
                lineColor: '#6c757d',
                sectionBkgColor: '#f8f9fa',
                altSectionBkgColor: '#e9ecef',
                gridColor: '#dee2e6',
                tertiaryColor: '#f8f9fa',
                edgeLabelBackground: '#ffffff',
                clusterBkg: '#f8f9fa'
            },
            fontSize: 16
        });
        mermaidInitialized = true;
        console.log('Mermaid initialized successfully');
    }
});
