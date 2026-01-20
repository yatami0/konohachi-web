---
title: 'GitHub ActionsからAWS SESでメール送信する'
date: '2025-01-20'
excerpt: 'GitHub ActionsからAWS SESでメール送信したかったが本番運用叶わず'
---

# GitHub ActionsからAWS SESでメール送信してみた

## やりたかったこと

GitHub Actionsから定期的にメール送りたい。SendGridとかResendとか色々あるけど、せっかくなのでAWS SES使って勉強してみた。

結論：サンドボックス解除申請が却下されて本番運用はできなかったけど、OIDC認証周りの勉強になった。

## なぜAWS SESを選んだか（あとづけ）

- AWSの認証周り（IAM、OIDC）の勉強になる
- 将来的に独自ドメインでちゃんと運用する時の練習になる
- SendGridとかと違って、AWSエコシステムで完結する

## アクセスキー vs OIDC

GitHub ActionsからAWSを使うには認証が必要。2つの方式がある。

**アクセスキー方式**
- IAMユーザー作ってキーペアを発行
- GitHub Secretsに登録
- 漏洩したら終わり

**OIDC方式**
- 一時的な認証情報を都度取得
- 固定のパスワードが存在しない
- 漏洩リスクが低い

今回はせっかくなのでOIDC方式でやった。AWSが激推してた。

### OIDCの仕組み（ざっくり）

```
1. GitHub Actionsが起動
2. GitHubが「このワークフローは本物です」っていうトークン発行
3. AWSがトークン検証して一時的な認証情報を発行
4. その認証情報でSESを操作
```

固定パスワードがどこにも存在しないのがポイント。トークンには有効期限もある。昔DiscordのBOTを作ったときは確かアクセスキーを作成してた気がする

## 構築手順

### 1. SESでメールアドレス検証

AWSコンソール → SES → Verified identities → Create identity

自分のメールアドレス入れて確認メールのリンクをクリック。これで送信元として使える。

### 2. IAM IDプロバイダ作成

AWSに「GitHubからの認証を信頼していいよ」って登録する。

- プロバイダのURL: `https://token.actions.githubusercontent.com`
- 対象者: `sts.amazonaws.com`

### 3. IAMロール作成

GitHub Actionsが使う権限の入れ物。

**信頼ポリシー（誰が使えるか）**
- GitHubの特定リポジトリからのみ（例：yatami0/obsidian-vault）

**許可ポリシー（何ができるか）**
- SESの操作（AmazonSESFullAccess）

ロール名は `github-actions-ses-role` とかにした。

### 4. GitHub Actionsワークフロー（作：Claude Code）

`.github/workflows/send-daily-report.yml`

```yaml
name: Send Daily Report

on:
  schedule:
    - cron: '0 9 * * *'
  workflow_dispatch:

permissions:
  id-token: write  # これ必須
  contents: read

jobs:
  send-email:
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/github-actions-ses-role
          aws-region: ap-northeast-1

      - name: Send email via SES
        run: |
          aws ses send-email \
            --from "your-email@gmail.com" \
            --destination "ToAddresses=your-email@gmail.com" \
            --message "Subject={Data='Daily Report',Charset='UTF-8'},Body={Text={Data='テストメール',Charset='UTF-8'}}"
```

`permissions.id-token: write` を忘れるとOIDCトークン取れなくて詰む。

## 実行結果

ワークフロー実行 → ログには成功って出た → メール届かない → 迷惑メールフォルダにいた

SPF/DKIM/DMARCが未設定だから。独自ドメイン使えば改善できる。

## サンドボックスの壁

AWS SESには「サンドボックス」っていう制限がある。

- 送信先：検証済みアドレスのみ
- 送信量：1日200通まで

本番運用するには解除申請が必要なんだけど、**却下された**。

AWSはスパム対策で審査が厳しい。個人の学習目的だと通りにくいっぽい。

## 今後の方針

とりあえずResendとかのサードパーティに切り替える。

ただ、OIDC認証の設定は残しておく。将来サンドボックス解除されたら、ワークフローの送信部分だけ書き換えればいいから。

## 学んだこと・気づき

### メール配信について
- SMTPサーバーを自前で立てない理由がわかった（IPレピュテーション育てるのが大変）
- SendGridとかが強いのは、長年かけて築いた信頼（IPレピュテーション）があるから
- SPF/DKIM/DMARCの重要性

### OIDC認証について
- トークンベースの認証は、固定パスワードがないから漏洩リスクが低い
- IAMロールの「信頼ポリシー」と「許可ポリシー」の違い
- `token.actions.githubusercontent.com` はGitHub全体で共通のトークン発行サーバー（リポジトリ指定はIAMロールで行う）

### AWSの設計思想
- 最小権限の原則を実践しやすい仕組みになってる
- IAMで細かく権限管理できるのは便利だけど、最初は複雑に感じる

---

## 参考（調：Claude Code）

- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [GitHub Actions - Configuring OpenID Connect in AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [aws-actions/configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials)