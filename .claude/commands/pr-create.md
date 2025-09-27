以下の手順でPRを作成してください

## 手順

### Step 1

現在のブランチ名、未コミットファイル、直近のコミット履歴を確認し、PR作成の準備が整っているかを判断する。

コマンド例：

```bash
git status
git log --oneline -10
```

### Step 2

ブランチの差分を全て網羅したPRを作成するため、変更内容を詳細に把握する。

コマンド例：

```bash
git diff main...HEAD --name-only
git diff main...HEAD --stat
mcp__github__list_commits #（GitHub MCP）
```

### Step 3

GitHub MCPの `mcp__github__get_file_contents` を使用してPRテンプレート（`.github/PULL_REQUEST_TEMPLATE.md`）を取得し、変更内容に基づいて各項目を埋める。

### Step 4

GitHub MCPの `mcp__github__create_pull_request` を使用してPRを作成する。

**パラメータ設定**:

- `title`: ブランチ名から適切なタイトルを生成（日本語、簡潔で分かりやすく）
- `body`: Step 3で準備したテンプレート内容の完全版
- `head`: 現在のフィーチャーブランチ名
- `base`: `main` （プロジェクトのデフォルトブランチ）
- `draft`: コマンドオプションで`--draft`が指定された場合、ドラフトで作成

### Step 5

GitHub MCPの `mcp__github__request_copilot_review` を使用してCopilotレビューを依頼する。

### Options

- --draft: PRをドラフトとして作成する
