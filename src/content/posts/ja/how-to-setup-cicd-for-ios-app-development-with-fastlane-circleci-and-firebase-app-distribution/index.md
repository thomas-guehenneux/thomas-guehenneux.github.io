---
title: iOSアプリのCI/CDフロー ベストプラクティスガイド：gitブランチ戦略の選択から、FastlaneとCircleCIを利用して、Firebase App Distributionへの配布まで
tags: [ios, devops, fastlane, continous integration, continuous delivery, firebase app distribution, circleci]
image: "./header.webp"
authors:
  - aarif-sumra
categories:
  - ios
date: 2021-09-15
---

アプリ開発者は、改善を意識しアプリ開発を行なっております。多くの開発者は既存アプリに新規機能追加をすることになり、運が良い開発者であれば新規の開発に携われるかもしれません。いずれにせよ、新しい開発者をオンボーディングしたり、新規プロジェクトを立ち上げることは難しいことではあります。もし慎重に行われなければ**技術的負債**が開発者、マネジャー、セールスおよび（最も重要）クライアントの悩みの種にになるかもしれません。

## Git-flow: 簡単な概要

Git-flow は、アジャイルだけでなく従来のウォーターフォールのプロジェクトでも使われています。

継続的インテグレーション／継続的デリバリーの実施を始める前に、**git branching model**を決めることが重要です。CI／CD ツールを利用することはみなさんの開発ワークフローと似ているはずです。

### Git branching model

この記事はモバイルアプリケーションに焦点を当てています。従って、今回は、その目的を果たすために、以下の**git branching model**を使用します。

<figure class="image">
  <img src="https://nvie.com/img/git-model@2x.png">
  <figcaption style="text-align: center;">Figure 1: Git Branching Model by <a href="https://nvie.com/posts/a-successful-git-branching-model/">Vincent Driessen</a></figcaption>
</figure>

Git-flow は本質的に merge-based の解決策です。それはブランチを rebase しません。また、利用するタグ名のフォーマットを『vX.Y.Z-beta-N』にして changelog 自動化するユーティリティを使うともっと便利になります。

**その最も純粋な形の Github-Flow と Git-Flow は、活発な開発ワークフローを採用することを手助けできていません。** Github の現代の傾向は、通常、最低 2 つの branch ー develop、および master を持っているようです。develop はいつもアクティブな開発で、master は最新のリリースをタグを付けてを保持しています。

Git-flow（GitHub-flow ひねりによる）は、CI と CD の具体的な解決策を見つけやすくしてくれます。もちろん、チームサイズによって違う流れを選べますが、、どうしてもそのフローは上記の[Git Branching Model](#Git-branching-model)とも似ているはずです。

## Implementing Continous Integration & Delivery

定義上、、**共有リポジトリにコード変更を統合する、単一のプロジェクトで共同作業する開発者によって採用される自動化されたプロセスまたはプラクティスです**。そんな自動化処理は、テストコード、パッケージ化、および本番環境への配信とデプロイなどのステップで構成されています。

開発者はプロダクト開発中、QA チームまたはクライアントが機能をチェックしてテストするために、新しい IPA ファイルまたは APK ファイルをしばしば要求されます。手動で毎回 IPA/APK をビルドして別のチームへ渡すのは効率的ではありません。こっちで CI／CD を導入して開発関係ない作業（例：ユニットテストし、バイナリを配布）をかなり自動化して開発者は肩の荷を下ろすことができます。

### Advantages of CI/CD

Git-flow と結合された CI／CD は、たとえば以下のような多くの利点があります：

- 自動化されたビルドをテストチームへ配信して、開発者の時間を節約する
- 保証されている純粋なビルドによるビルドの不整合（主に、ローカルなキャッシュのため起こされる）を除去する
- オープンなコミュニケーションおよび自由な情報の流れを促進することにより、チームのエンゲージメントを高いレベルに引き上げる
- チームメンバー間の知識共有を促進することにより、開発者の依存を減らす
- コードをマージする時の、開発者の自信を改善する
- 手動処理が原因で起こるかもしれないバグを排除する

小さいチームまたは個々の開発者が、オーバーヘッドを追加して CI を採用することにはデメリットがあるかもしれません。しかし、多くの人々と複数のプロジェクトに取り組んでいる開発者のために、CI は時間とお金についての非常に高いリターンを持つ賢明な投資となります。

## Fastlane

![Fastlane Logo](https://i.imgur.com/NhAAxig.png)

チームのスキルによって`Shell Script`、`Ruby`、`Python` など利用してアプリビルドを実施できます。しかし、**[Fastlane](https://docs.fastlane.tools/)** (Ruby を元にしたツールだ！) は、CI／CD を実施するための一番おすすめのツールです。歴史的には、**[Fabric](https://fabric.io)** の一部になり、その後 2017 年に Google に買収されました。Fastlane のコミュニティは盛り上がり、ビジネスケースに合わせるにたくさんのオープンソースプラグインを見つけることができます。

Monstarlab では、私達は、私達の CI／CD 解決策を実施するために、Fastlane ツールを選びました。それは`Ruby`のいくらかの知識を必要としています。ただ、そのエキスパートである必要はないです。

Fastlane が初めての方は、[この資料](https://docs.fastlane.tools/)を参照してください。iOS と Android 両方の適度によいドキュメンテーションがあります。ただし、[`StackOverflow`](https://stackoverflow.com/questions/tagged/fastlane+android) のようなフォーラムで検索しても、いくつかの Android fastlane action の詳細と関連するものを見つけることに苦労しました。

#### Modeling Git Branching Model to Fastlane

普通に [Git Branching Model](#Git-branching-model) のそれぞれの主要な branch は、下のテーブルに例示するように環境と一致しています：

| Environment | Alias/Tag | Branch              | Description                                                            |
| ----------- | --------- | ------------------- | ---------------------------------------------------------------------- |
| Development | alpha     | develop             | 次または遠方のリリースのすべての機能は通常、この環境で開発されています |
| Staging     | beta      | release/ or hotfix/ | Pre-release 環境.                                                      |
| Production  | prod      | master              | `master`で作成されたビルドは常にこの環境を使用します。                 |

より複雑なフローは環境分離の追加のレイヤーを持つこともできます。例えば、以下のように環境を分類できます：

```ruby
# Fastfile

ALIAS_MAP = {
  'alpha' => 'Develop',
  'beta' => 'Staging',
  'prod'=> 'Production'
}
...
  desc 'Build alpha IPA'
  lane :alpha do |options|
    build_app # This will be replaced with custom `build_deploy` private lane later
  end

  desc 'Build beta IPA'
  lane :beta do |options|
    build_app # This will be replaced with custom `build_deploy` private lane later
  end

  desc 'Build production ipa'
  lane :prod do |options|
    build_app # This will be replaced with custom `build_deploy` private lane later
  end
...
```

<div style="text-align: center;">Listing 1</div>

ℹ️ 　*CI の YAML ファイルからコマンドライン引数を渡すために **lane** `options`パラメータを使用する場合があります。*

以下の通り、 `build_app`アクションの構成を`lane`ごとに `Gymfile`に入れることも可能です。

```ruby
# Gymfile
for_platform :ios do

    include_bitcode true
    include_symbols true

    for_lane :alpha do
      scheme '<YOUR_DEV_SCHEME>'
      export_method 'development' # or 'enterprise' for in-house testing
    end

    for_lane :beta do
      scheme '<YOUR_STAGING_SCHEME>'
      export_method 'ad-hoc'
    end

    for_lane :prod do
      scheme '<YOUR_PRODUCTION_SCHEME>'
      export_method 'app-store' # or 'enterprise' for release
    end
  end
```

<div style="text-align: center;">Listing 2</div>
</br>

`Gymfile`で利用可能な構成オプションについては、[こちら](https://docs.fastlane.tools/actions/gym/#parameters)をご参照ください。

*Listing 2*のコードを`Gymfile`に書くことで、**scheme および export_method のような設定を以下のような build_app のパラメータに設定する必要はないです**：

```ruby
# Now you don't need to set parameters marked with 👈
# since it is handled in Gym file
build_app(
  scheme: "Release", # 👈
  export_options: { # 👈
    method: "app-store" # 👈
  }
)
```

<div style="text-align: center;">Listing 3</div>

ℹ️ 注：_Listing 3 と異なり、bundle id と provisioning profile は xcconfig を使用して設定します。_

## Firebase App Distribution

ビルドされた IPA バイナリを Firebase に配布するには、Firebase アプリ配布の設定方法に関するこの[ドキュメント](https://firebase.google.com/docs/app-distribution/ios/distribute-fastlane)を読むことを**強くお勧めします。**

*Listing 1*において、ビルドを実行するために、`build_app`を用いしました。こちらの action を別の`build_deploy`というプライベート`lane`に移動すると、3 つの main lane に重複するコードを削除できます。（これを確認するため _[Listing 7](#Revising-Main-Lanes-in-Listing-1)_ をご参照ください。）

```ruby
  desc 'Build and deploy ipa'
  private_lane :build_deploy do |options|
    #1. Check if any new commits since last release
    is_releasable = analyze_commits(match: "*#{options[:environment]}*")
    unless is_releasable
      UI.important  "No changes since last one hence skipping build"
      next
    end

    #2. Increment build number
    increment_build_number(
      build_number:  lane_context[SharedValues::RELEASE_NEXT_VERSION] # set a specific number
    )
    #3. If you can use `match`, you use `match`.
    setup_provisioning_profiles

    #4. Build deploy
    build_app
    deploy_app options
  end
```

<div style="text-align: center;">Listing 4</div>

###### Step 1. Check if any new commits since the last release

[`analyze_commits`](https://github.com/xotahal/fastlane-plugin-semantic_release#analyze_commits)は[semantic release](https://github.com/semantic-release/semantic-release)を簡単に実装するのためのサードパーティ fastlane plugin です。このプラグインは最後のリリースから、どれだけの変化があるかがチェックしてくれます。存在する場合ビルドをトリガーしますし、なければ「No changes since the last one hence skipping build」メッセージを投げて停止します。これにより、CI マシンでのビルド時間を節約できます。

###### Step 2. Increment build number

Marketing Version と Internal Build Version を別個にしておくことができます。例えば、もし Xcode プロジェクトで[AGV ツーリング有効](https://developer.apple.com/library/archive/qa/qa1827/_index.html)にしているならば、`increment_build_number`アクションを使うことができます。このアクションでターゲットのビルド番号が自動的に変更されます。

###### Step 3. Setup Provisioning Profiles

ここの Fastlane`match`コマンドを使うことができます。 もしも`match`を利用できない（ Apple Developer へのアクセスはない）場合、最初に、`import_certificate `コマンドを使用して、それから`FastlaneCore::ProvisioningProfile.install`を実行することによってそれをインストールします。

###### Step 4. Build and deploy

*Listing 1*にある`build_app`アクションを利用します。IPA ビルドを完成したら Firebase App Distribution へ配布するため別のプライベート`lane`: `deploy_app`を呼び出します。

### Deploying

`alpha`と`beta`は firebase へデプロイします。prod は、App Store connect に手動でアップロードできますし、[upload_to_testflight](https://docs.fastlane.tools/actions/upload_to_testflight/) アクションを使って自動化もできます。今回は、説明を簡略化するために、GitHub リリースに IPA ファイルを asset としてアップロードします。

`deploy_app` lane は以下の Listing 5 のようになります。このプライベート`lane`は 5 つのステップに分割ことができます。

```ruby
  private_lane :deploy_app do |options|
    environment = options[:environment]
    next if environment == 'prod' # Since `prod` is uploaded to testflight and app store
    #1. Generate Change Log
    notes = conventional_changelog(title: "Change Log", format: "plain")

    #2. Get Google App ID
    gsp_path = "SupportingFiles/GoogleService/#{ALIAS_MAP[environment]}-Info.plist"
    google_app_id = get_info_plist_value(path: gsp_path, key: 'GOOGLE_APP_ID')

    #3. Upload to firebase
    firebase_app_distribution(
      app: google_app_id,
      # groups: tester_group,
      release_notes: notes,
      firebase_cli_path: FIREBASE_CLI_PATH
    )

    #4. Upload dSYM files to crashlytics
    upload_symbols_to_crashlytics(gsp_path: gsp_path)
    clean_build_artifacts
  end
```

<div style="text-align: center;">Listing 5</div>

###### Step 1. Generating Change Log:

ログを生成するために、Fastlane の[semantic-release](https://github.com/xotahal/fastlane-plugin-semantic_release)プラグインを使用しています。
`conventional_changelog`は`analyze_commits`と連携して使われる必要があります（`is_releasable`をチェックするために、`build_deploy`レーンで`conventional_changelog`を使用しました
）。`analyze_commits`は、`v1.0.1-beta5`のように 1 つ前の git-tag にマッチするための`match` regex 引数を渡して使っています。これは、最後のタグ、および現在の`v1.0.1-beta6`の間だけのログを生成するのに役立ちます。

###### Step 2. Get Google App ID

3 つの環境向けに、それぞれの`google_app_id`が必要です。これは Firebase から Plist の形で取得できます。サンプルコードプロジェクトは、マルチ configuration の単一ターゲットの Xcode プロジェクトです。GoogleService plists を下記通り名前変えて`GoogleService`ディレクトリに移動して整理しておきます。 - GoogleService/Develop-Info.plist - GoogleService/Staging-Info.plist - GoogleService/Production-Info.plist
まずは`gsp_path`を取得して、そこから`google_app_id`を取ります。

###### Step 3. Upload to Firebase

`firebase_app_distribution`を実行するため、**Firebase CLI**を環境上でインストールする必要があります。CircleCI の`setup`コマンドをご参照ください。そちらでは`firebase-cli`を npm-package としてインストールしておきました。
`firebase_app_distribution`で重要な引数は`firebase_cli_path`です。

###### Step 4. Upload dSYM files to crashlytics

最後に、[`dSYM` ファイルを Firebase へアップロード](https://firebase.google.com/docs/crashlytics/get-deobfuscated-reports?hl=en)します。もしアプリがクラッシュしてしまった場合、再起動の時に firebase から送信されるレポートを、シンボルを解除して読みやすくするためです。

**Note:**
Xcode プロジェクトで bit code が有効になっている場合、App Store はコードを再コンパイルし、dSYM ファイルを提供します。 クラッシュレポートのシンボルを解除するには、そのファイルをダウンロードして Firebase Crashlytics にアップロードする必要があります。 したがって、製品版の場合のみ、この手順を実行する必要があります。 ** Fastlane の `download_dsym`アクションをご参照ください。**

## Github Release

`release_on_github`はプライベートレーンであり、コミットに自動的にタグを付け、リリースノートを追加し、本番用の IPA ファイルを添付します。IPA ファイルは後で App StoreConnect にアップロードできます。

Firebase App Distribution には IPA ファイルをダウンロードするための API がないため、デバイスのみにインストールできます。`deploygate`ような他のベータ版配信サービスを使用してクライアントに `beta`リリースを提供したい場合、GitHub release にプレリリースとして IPA ファイルを保存したいかもしれません。

### Uploading IPA as an asset

```ruby
  desc "Release on github"
  private_lane :release_on_github do |options|
    environment = options[:environment]
    #1. Generate Change Log
    notes = conventional_changelog(title: "Change Log")

    #2. Get Version and Build Number
    version_number = get_version_number
    build_number = get_build_number

    #3. Set Github Release
    is_prerelease = environment == 'beta' ? true : false

    name =  "[#{ALIAS_MAP[environment]}] v#{version_number} Build: #{build_number}}"

    set_github_release(
      repository_name: "#{ENV['CIRCLE_PROJECT_USERNAME']}/#{ENV['CIRCLE_PROJECT_REPONAME']}",
      name: name,
      commitish: ENV['CIRCLE_SHA1'],
      description: notes,
      tag_name: "v#{version_number}-#{options[:environment]}-#{build_number}",
      is_prerelease: is_prerelease,
      upload_assets: [lane_context[SharedValues::IPA_OUTPUT_PATH]]
    )
  end
```

<div style="text-align: center;">Listing 6</div>

###### Step 1. Generate Change Log

`conventional_changelog`はデフォルトのマークダウンスタイルのメモを自動生成してくれます。これは、自動リリースノートを作成するときに便利です。

###### Step 2. Get Version and Build Number

これらを使用して、リリースのタイトルを設定します。 `get_version_number`と` get_build_number`を使用するには、Xcode プロジェクトで AGV ツールを有効にする必要があります。

###### Step 3. Set Github Release

ベータ版がプレリリースとしてマークされているかどうかを確認します。環境に基づいて、リリースノートの名前/タイトルをフォーマットします。タグ名を `v1.0.1-beta-1234`のような形式で設定し、ビルドされた IPA ファイルをアセットとしてリリースにアップロードします。

ℹ️ 注：_環境では、個人トークンまたは CI 用 BOT のトークンを `GITHUB_API_TOKEN`に設定する必要があります。 このトークンには、タグを作成する権限が必要です。_

### Revising Main Lanes in Listing 1

Github への「alpha」開発中に高頻度で頻繁に発生し、Firebase に保存されるため、スキップします。 これにより、GitHub のスペースを節約できます。

```ruby
# Fastfile

ALIAS_MAP = {
  'alpha' => 'Develop',
  'beta' => 'Staging',
  'prod'=> 'Production'
}
...
  desc 'Build alpha IPA'
  lane :alpha do |options|
    build_deploy options
    # Not releasing to Github since Firebase App Distribution
  end

  desc 'Build beta ipa'
  lane :beta do |options|
    build_deploy options
    release_on_github options
  end

  desc 'Build production ipa'
  lane :prod do |options|
    build_deploy options
    release_on_github options
  end
...
```

<div style="text-align: center;">Listing 7</div>

## Matching up CircleCI configuration with Fastlane

CircleCI はシンプルな `YAML`config.yml の設定に従って、プルリクエストがマージされるか、コードがブランチにプッシュされると、_config.yml_ の設定に従って、CircleCI ワークフローがトリガーされ、Fastlane で特定のレーンが起動されます。

*Table 1*の alias 列にある `alpha`、`beta`、および `prod`と呼ばれる 3 つの環境引数があることに注意してください。以下の yaml ファイルのスニペットをご覧ください。

```yaml
---
jobs:
  deploy:
    executor:
      name: default
    parameters:
      build_type:
        type: enum
        enum: ["alpha", "beta", "prod"] # Corresponds to lanes
        default: alpha
    steps:
      - attach_workspace:
          at: /Users/distiller/project
      - run:
          name: Build ipa
          command: bundle exec fastlane ios << parameters.build_type >>
      - store_artifacts:
          path: output
          when: on_success
```

以下も同じ yaml ファイルのスニペットです。 ここで、 `setup`は、rubygems、npm モジュール、cocoapod、firebase cli、carthage などの必要な依存関係をインストールします。

```yaml
---
workflows:
  main:
    jobs:
      - setup
      - test:
          requires:
            - setup
      - deploy:
          name: build_deploy_alpha
          build_type: alpha
          requires:
            - setup
          filters:
            branches:
              only:
                - develop # RegEx
      - deploy:
          name: build_deploy_beta
          build_type: beta
          requires:
            - setup
          filters:
            branches:
              only:
                - /release\/.*/ # RegEx
                - /hotfix\/.*/ # RegEx
      - deploy:
          name: build_deploy_prod
          build_type: prod
          requires:
            - setup
          filters:
            branches:
              only:
                - master # RegEx
```

各ワークフローの*フィルター*にも特に注意してください。 `develop`、`/release\/.*/`、`/hotfix\/.*/`、`master` といった**[正規表現](https://en.wikipedia.org/wiki/Regular_expression)が含まれています。**

| Push On Branch           | Lane executed                      | Environment |
| ------------------------ | ---------------------------------- | ----------- |
| `develop`                | bundle exec fastlane ios **alpha** | Development |
| `release/*` & `hotfix/*` | bundle exec fastlane ios **beta**  | Staging     |
| `master`                 | bundle exec fastlane ios **prod**  | Production  |

上記のスニペットによって、[git ブランチモデル](#Git-branching-model) が、CircleCI YAML ファイルの構成と Fastlane 構成ファイルに、どのように反映されるかが理解いただけたかと思います。CircleCI Yaml の詳細については、[こちら](https://circleci.com/docs/2.0/writing-yaml/)をご覧ください。

## Conclusion

効果的な開発ワークフローと CI-CD の実装は、開発の時間を大幅に削減するのに役立ちます。 同様に、QA チームはバグや問題を特定のビルドにリンクすることができ、開発者とより生産的な会話をすることができるようになります。 特に、新しい開発者の立ち上がりまでの時間も大幅に短縮されます。

## Resources

[Sample Code](https://github.com/monstar-lab-oss/ios-template)
[Fastlane Tools Docs](https://docs.fastlane.tools/)
[Firebase App Distribution](https://firebase.google.com/docs/app-distribution/ios/distribute-fastlane)
[Git Branching Model by Vincent Driessen](https://nvie.com/posts/a-successful-git-branching-model/)
[AGV tooling enabled](https://developer.apple.com/library/archive/qa/qa1827/_index.html)

_Article Photo by [Rasa Kasparaviciene](https://unsplash.com/photos/xs0ohkkR_xc)_
