/**
 * Returns a self-contained HTML page that renders the OpenAPI schema.
 * No external assets are required, so the docs work without adding Swagger UI dependencies.
 */
export function renderSwaggerPage(): string {
    return `<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>L_Shop API Docs</title>
    <style>
        :root {
            color-scheme: light;
            --bg: #f7f7f8;
            --panel: #ffffff;
            --text: #202124;
            --muted: #62666d;
            --line: #dedfe3;
            --get: #0969da;
            --post: #1a7f37;
            --patch: #9a6700;
            --delete: #cf222e;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            background: var(--bg);
            color: var(--text);
            font-family: Inter, Arial, Helvetica, sans-serif;
            line-height: 1.5;
        }
        header {
            border-bottom: 1px solid var(--line);
            background: var(--panel);
            padding: 28px 40px;
        }
        main {
            display: grid;
            grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
            gap: 24px;
            padding: 24px 40px 44px;
        }
        h1 { margin: 0; font-size: 32px; line-height: 1.15; }
        h2 { margin: 0 0 12px; font-size: 20px; }
        h3 { margin: 0; font-size: 17px; }
        p { margin: 8px 0 0; color: var(--muted); }
        a { color: var(--get); text-decoration: none; }
        aside {
            position: sticky;
            top: 20px;
            align-self: start;
            border: 1px solid var(--line);
            border-radius: 8px;
            background: var(--panel);
            padding: 16px;
        }
        aside a {
            display: block;
            padding: 7px 8px;
            border-radius: 6px;
            color: var(--text);
            font-size: 14px;
        }
        aside a:hover { background: #f0f1f3; }
        .meta {
            display: flex;
            flex-wrap: wrap;
            gap: 8px 16px;
            margin-top: 14px;
            color: var(--muted);
            font-size: 14px;
        }
        .section {
            margin-bottom: 28px;
        }
        .endpoint {
            overflow: hidden;
            border: 1px solid var(--line);
            border-radius: 8px;
            background: var(--panel);
            margin: 10px 0;
        }
        .endpoint__head {
            display: grid;
            grid-template-columns: 84px minmax(0, 1fr);
            gap: 14px;
            align-items: center;
            padding: 14px 16px;
            border-bottom: 1px solid var(--line);
        }
        .method {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 30px;
            border-radius: 6px;
            color: white;
            font-weight: 700;
            letter-spacing: 0;
            text-transform: uppercase;
            font-size: 12px;
        }
        .method--get { background: var(--get); }
        .method--post { background: var(--post); }
        .method--patch { background: var(--patch); }
        .method--delete { background: var(--delete); }
        code {
            display: inline-block;
            overflow-wrap: anywhere;
            color: #24292f;
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
            font-size: 13px;
        }
        .endpoint__body {
            display: grid;
            gap: 12px;
            padding: 14px 16px 16px;
        }
        .pill {
            display: inline-flex;
            align-items: center;
            min-height: 24px;
            padding: 3px 8px;
            border-radius: 999px;
            background: #f0f1f3;
            color: var(--muted);
            font-size: 12px;
            font-weight: 600;
        }
        .details {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
        }
        .box {
            border: 1px solid var(--line);
            border-radius: 8px;
            padding: 10px 12px;
            background: #fbfbfc;
        }
        .box strong {
            display: block;
            margin-bottom: 6px;
            font-size: 13px;
        }
        .empty {
            border: 1px dashed var(--line);
            border-radius: 8px;
            padding: 28px;
            background: var(--panel);
            color: var(--muted);
        }
        @media (max-width: 860px) {
            header { padding: 22px 18px; }
            main { grid-template-columns: 1fr; padding: 18px; }
            aside { position: static; }
            .details { grid-template-columns: 1fr; }
            .endpoint__head { grid-template-columns: 72px minmax(0, 1fr); }
        }
    </style>
</head>
<body>
    <header>
        <h1>L_Shop API Docs</h1>
        <p>Визуальная документация всех backend-маршрутов. JSON-спецификация доступна по <a href="/api/docs/openapi.json">/api/docs/openapi.json</a>.</p>
        <div class="meta" id="meta"></div>
    </header>
    <main>
        <aside>
            <h2>Разделы</h2>
            <nav id="nav"></nav>
        </aside>
        <section id="content" aria-live="polite">
            <div class="empty">Загрузка документации...</div>
        </section>
    </main>
    <script>
        const methods = ["get", "post", "put", "patch", "delete"];
        const methodLabels = {
            get: "GET",
            post: "POST",
            put: "PUT",
            patch: "PATCH",
            delete: "DELETE"
        };

        function escapeHtml(value) {
            return String(value)
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll("'", "&#039;");
        }

        function schemaName(schema) {
            if (!schema) return "empty";
            if (schema.$ref) return schema.$ref.split("/").at(-1);
            if (schema.oneOf) return schema.oneOf.map(schemaName).join(" | ");
            if (schema.allOf) return schema.allOf.map(schemaName).join(" & ");
            if (schema.type === "array") return "array<" + schemaName(schema.items) + ">";
            return schema.type || "object";
        }

        function requestBodyName(operation) {
            return schemaName(operation.requestBody?.content?.["application/json"]?.schema);
        }

        function responseNames(operation) {
            return Object.entries(operation.responses || {})
                .map(([status, response]) => {
                    const schema = response?.content?.["application/json"]?.schema;
                    return status + ": " + (schema ? schemaName(schema) : "empty");
                })
                .join(", ");
        }

        function renderEndpoint(path, method, operation) {
            const params = operation.parameters?.map((param) => param.name + " (" + param.in + ")").join(", ");
            const security = operation.security?.length ? "currSid cookie" : "";
            return \`
                <article class="endpoint">
                    <div class="endpoint__head">
                        <span class="method method--\${method}">\${methodLabels[method]}</span>
                        <div>
                            <h3>\${escapeHtml(operation.summary || path)}</h3>
                            <code>\${escapeHtml(path)}</code>
                        </div>
                    </div>
                    <div class="endpoint__body">
                        \${operation.description ? \`<p>\${escapeHtml(operation.description)}</p>\` : ""}
                        <div>
                            \${security ? \`<span class="pill">Auth: \${escapeHtml(security)}</span>\` : ""}
                            \${params ? \`<span class="pill">Params: \${escapeHtml(params)}</span>\` : ""}
                        </div>
                        <div class="details">
                            <div class="box">
                                <strong>Request body</strong>
                                <code>\${escapeHtml(requestBodyName(operation))}</code>
                            </div>
                            <div class="box">
                                <strong>Responses</strong>
                                <code>\${escapeHtml(responseNames(operation))}</code>
                            </div>
                        </div>
                    </div>
                </article>
            \`;
        }

        async function loadDocs() {
            const response = await fetch("/api/docs/openapi.json");
            const spec = await response.json();
            const nav = document.getElementById("nav");
            const content = document.getElementById("content");
            const meta = document.getElementById("meta");
            const groups = new Map();

            for (const [path, pathItem] of Object.entries(spec.paths)) {
                for (const method of methods) {
                    const operation = pathItem[method];
                    if (!operation) continue;
                    const tag = operation.tags?.[0] || "Other";
                    if (!groups.has(tag)) groups.set(tag, []);
                    groups.get(tag).push({ path, method, operation });
                }
            }

            meta.innerHTML = \`
                <span>Version: \${escapeHtml(spec.info.version)}</span>
                <span>Base URL: <code>\${escapeHtml(spec.servers?.[0]?.url || "/api")}</code></span>
                <span>Endpoints: \${Array.from(groups.values()).reduce((sum, items) => sum + items.length, 0)}</span>
            \`;

            nav.innerHTML = Array.from(groups.keys())
                .map((tag) => \`<a href="#tag-\${encodeURIComponent(tag)}">\${escapeHtml(tag)}</a>\`)
                .join("");

            content.innerHTML = Array.from(groups.entries())
                .map(([tag, items]) => \`
                    <section class="section" id="tag-\${encodeURIComponent(tag)}">
                        <h2>\${escapeHtml(tag)}</h2>
                        \${items.map(({ path, method, operation }) => renderEndpoint(path, method, operation)).join("")}
                    </section>
                \`)
                .join("");
        }

        loadDocs().catch((error) => {
            document.getElementById("content").innerHTML =
                '<div class="empty">Не удалось загрузить OpenAPI JSON: ' + escapeHtml(error.message) + '</div>';
        });
    </script>
</body>
</html>`;
}
