# logic-mermaid-pages

「ビジネスロジック閲覧サイト」を自動生成するスクリプトデモプロジェクトです。

## デモサイト

https://shibuya-mizuho.github.io/logic-mermaid-pages/

## 概要

[internal/logic/main.go](internal/logic/main.go) を実行すると、Go のビジネスロジックをフローチャート化し、HTML/JS ドキュメントとして出力します。

`go:generate` は [application/usecase/order_create.go](application/usecase/order_create.go#L1) で定義しています。

[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) によって、mainブランチへのPush時に自動実行され、生成されたドキュメントはGitHub Pagesでホスティングされます。
