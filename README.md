# dragee-report-generator

Report generator for [dragee-cli](https://github.com/dragee-io/dragee-cli)

### JSON

[JSON Report builder](./src/json-report-builder.ts)

```json
[
    {
        "namespace": "ddd",
        "error": "The aggregate \"io.dragee.rules.relation.DrageeOne\" must at least contain a \"ddd/entity\" type dragee"
    }
]
```

### HTML

[HTML Report builder](./src/html-report-builder.ts) with [mermaidjs](https://github.com/mermaid-js/mermaid) charts

```html
<!DOCTYPE html>
<html>
    <body>
        <div>
            <h1>ddd</h1>
            <pre class="mermaid">
                pie showData
                    title ddd - Rules
                    "Success": 6
                    "Errors": 1
            </pre>
            <ul><li>The aggregate "io.dragee.rules.relation.DrageeOne" must at least contain a "ddd/entity" type dragee</li></ul>
        </div>
        <script type="module">
            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
        </script>
    </body>
</html>
```

### Markdown

[Markdown Report builder](./src/markdown-report-builder.ts) with [mermaidjs](https://github.com/mermaid-js/mermaid) charts

```markdown
    ```mermaid
        pie showData
            title ddd - Rules
            "Success": 7
            "Errors": 0
    ```
```