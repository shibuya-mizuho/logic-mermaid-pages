# logic-mermaid-pages

「ビジネスロジック閲覧サイト」を自動生成するスクリプトデモプロジェクトです。

## 記事

[Mermaid x AST x go:generate = コードとドキュメントの完全同期への道（完結編）](https://developersblog.dmm.com/entry/2025/12/22/110000)

## デモサイト

https://shibuya-mizuho.github.io/logic-mermaid-pages/

## 概要

[internal/logic/main.go](internal/logic/main.go) を実行すると、Go のビジネスロジックをフローチャート化し、HTML/JS ドキュメントとして出力します。

`go:generate` は [application/usecase/order_create.go](application/usecase/order_create.go#L1) で定義しています。

[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) によって、mainブランチへのPush時に自動実行され、生成されたドキュメントはGitHub Pagesでホスティングされます。

## 使い方

1. [internal/logic](internal/logic) 配下にある Go ソースコードをご自身のプロジェクトにコピペしてください。
2. [internal/logic/main.go](internal/logic/main.go) の `config` をご自身のプロジェクトに合わせて変更してください。
3. ユースケースの入り口などに [application/usecase/order_create.go](application/usecase/order_create.go#L1) のように `//go:generate` コメントを追加してください。(パスは適宜変更してください)
4. ターミナルで `go generate ./...` を実行してください。

## LICENSE

MIT License

## 注意事項

あくまでもデモプロジェクトですので、無保証、無サポートです。ご了承ください。

上記のコードを利用したことによるいかなる損害についても、作者    は一切の責任を負いません。