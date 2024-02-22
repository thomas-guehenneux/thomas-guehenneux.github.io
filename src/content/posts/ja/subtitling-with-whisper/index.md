---
title: "Whisperを利用して字幕を作ってみましょう"
tags: [AI]
image: "./header.webp"
authors:
  - gwanmuk-kang
date: 2023-12-08
---
技術の進歩によって現代は様々なコンテンツを見れるようになってきている中で、動画についてはTVからインターネットとプラットフォームへ変化してきています。

グローバル化も進み、国を超えて多様な動画を見るようになった今、言語という問題は楽しむことに大きな影響を及ばしています。

以前からこの問題に対してプロの翻訳家に依頼し、音声吹き替えや字幕のような形で解決していましたが、費用や品質に対しての課題が発生していました。ITを駆使して解決しようとする動きはあったもの、人と機械の間には品質において差があったため限界がある状況でした。

しかしながら、最近は人工知能（AI）を活用して、より精度の高い結果が出せるようになってきています。
本ブログではその一つであるOpenAIのWhisperを利用した字幕起こしについて紹介します。

# 字幕とは
字幕は、以下のように定義されています。

> 字幕（じまく）は、映像（動画）上に表示される文字情報および、その技術のことである。一般的な情報の提示のほか、映像本来の音声を何らかの理由で利用できない利用者のために表示される。
> 
> https://ja.wikipedia.org/wiki/%E5%AD%97%E5%B9%95

補助手段として利用されるものも、精度によっては動画の理解に大きな影響を及ぶこともあるものになります。

## 自動字幕起こしとは
音声を自動的に字幕に変換することを意味します。
メディアから音声を分析してテキストで読めるようにするものです。

今回はOpenAIのWhisperを利用し、実践していきます。

# OpenAI Whisper
OpenAIのWhisperは以下のように紹介されています。
> We’ve trained and are open-sourcing a neural net called Whisper that approaches human level robustness and accuracy on English speech recognition.
> 
> https://openai.com/research/whisper

OpenAIが研究し、Open Sourceとして公開されていますので、Githubから誰でも確認できます。

> [whisper](https://github.com/openai/whisper)

## 仕組み
<img src="https://raw.githubusercontent.com/openai/whisper/main/approach.png">
まずは一定の幅でメディアを分割し、言語の分析と文字起こしを行って正しい時間を付与して字幕を作成しています。

### メディアの分割
メディアを丸ごと処理して字幕を作成しているわけではなく、最大30秒という時間軸で分割して一つ一つ字幕を作成していきます。

### 言語の分析
パラメータとしてメディアの言語が指定されている場合はスキップされます。

言語を指定しないこともでき、その場合はこの段階で言語を検知して字幕を作成します。

### 文字起こし
この段階でWhisperのModelを利用して音声がテキストに変換されます。

Whisperには英語への翻訳機能もあり、利用設定をした場合はここで音声が英語に翻訳されたテキストで出力されます。

### 時間を付与
テキストの結果に時間情報を組み合わせてテキストをまとめます。終わったら最初に戻って次のトークンを遂行します。

# Setup
PyTorchが駆動できる環境を必要とするので、以下のWhisperのSetupに従って構築しましょう。

> [Setup](https://github.com/openai/whisper/tree/main#setup)

## モデルについて
Whisperをどのモデルで実行するかによって字幕の質が変わります。
基本的に提供されるモデルには色々な種類がありますので、こちらから選んで始めてみましょう。

[Available models and languages](https://github.com/openai/whisper/tree/main#available-models-and-languages)
> | Size   | Parameters | English-only model | Multilingual model | Required VRAM | Relative speed |
> |--------|------------|--------------------|--------------------|---------------|----------------|
> | tiny   | 39 M       | tiny.en            | tiny               | ~1 GB         | ~32x           |
> | base   | 74 M       | base.en            | base               | ~1 GB         | ~16x           |
> | small  | 244 M      | small.en           | small              | ~2 GB         | ~6x            |
> | medium | 769 M      | medium.en          | medium             | ~5 GB         | ~2x            |
> | large  | 1550 M     | N/A                | large              | ~10 GB        | 1x             |

Sizeはtinyからlargeまであり、要求されるVRAMと文字起こしの速度が異なります。

Whisperを実行しようとするマシンのスペックによって、適切なモデルを選ぶことになります。largeであるほど字幕の質が良いものになる可能性は高くなります。

また、Modelのパラメータによって、表記より多く必要とされることもありますので、実際に実行してみながら確認しましょう。

# やってみる
Setupを終えて利用するモデルが決まったら、いざ実行です。

## Whisper using CPU
AI駆動には専用のデバイスが必要と聞いた方もいるかもしれません。ただ、汎用的な演算装置であるCPUでも駆動してみることはできますので、こちらからやってみましょう。

### 実行環境
- MacBook Pro 13-inch, 2020
- macOS 12.6.7
- Python 3.9
- Whisper v20231117

### 実行
OpenAI WhisperのGithub レポジトリのサンプルを実行してみましょう。
```python
import whisper

model = whisper.load_model("base")
result = model.transcribe("jfk.flac")
print(result["text"])
```
> **_Note:_** AudioファイルはWhisperのGithubレポジトリのtestsのフォルダーにあるjfk.flacを利用しています。

```zsh
% python3 sample1.py
/Users/gwanmuk_kang/Library/Python/3.9/lib/python/site-packages/whisper/transcribe.py:115: UserWarning: FP16 is not supported on CPU; using FP32 instead
  warnings.warn("FP16 is not supported on CPU; using FP32 instead")
 And so my fellow Americans, ask not what your country can do for you, ask what you can do for your country.
```

最後の行にAudioファイルがテキストに変換されていることが確認できます。

Warningが出力されていることも確認できますが、Whisperのデフォルト設定がGPUを想定しているのでCPUで実行した際には設定が変更されるという内容になります。

次は日本語の音声ファイルを実行してみます。

```python
import whisper

model = whisper.load_model("base")
result = model.transcribe("rusuden_04.wav")
print(result["text"])
```
> **_NOTE:_**
日本語音声は、[あみたろの声素材工房](https://amitaro.net/voice/voice_dl/)でダウンロードしています。

実行した結果は以下になります。

```zsh
お電話ありがとうございます大変申し訳ございませんが本日の影響は全て終了させていただきましたまたのお電話をお待ちしております
```
問題なく作成されたことがわかります。

次はもっと長い音声でやってみましょう。


```python
import whisper

model = whisper.load_model("base")
result = model.transcribe("japanese-conversation-23645.mp3")
print(result["text"])
```
> **_NOTE:_** 
> 日本語音声は、[pixabay](https://pixabay.com/sound-effects/search/japanese/)でダウンロードしています。

結果は次のようになります。

```zsh
介石長ドレ sir attending Nahはいじゃあ 者さんのおごどら應該全部折菩すいませんと。キュウシュメン分けに行かないので知してください。さわ eli、いただきます。てことを� Sharline Line Flash給批が練した日の James B executiveの本名は翻ね落下了 forし敢用をrus連園浴様ですコンマイチ星ハイ合字を描いて教えてどうもあれはそうです。どこに出したことで、こっちは電源を間に当たした。あげろと。安心してくるな。あんたの側に動き地に話し付けてきました。さらに、やっぱりセイスだす。もういこう、もう無駄に出来しまえんで。そこで帰って、よくすぐにといて帰りながら行きましょう。そんな話見てやるんすね。どうも!
```

理解できない日本語が出力されています。今まで利用していたbaseのモデルでは正確さに限界があるので、次はモデルをlargeに変えて実行してみます。

```python
import whisper

model = whisper.load_model("large")
result = model.transcribe("japanese-conversation-23645.mp3")
print(result["text"])
```

時間はかなりかかりますが、結果は次のように良くなったことがわかります。

```zsh
はい、じゃあちょっと良くなったらお願いします。はい、じゃあ皆さん戻られたらお待ちしていただきます。はい、ではテスト行きます。ちょっと奥にあるのでありますが、テストいただきます。テスト、よーい、はい。彼女を連れ回して申し訳ありません。ぜひ、仕事に追われて、調整した彼女を見ていただいたら、気持ちもある。いかがしてくれるでしょうか。そうですな。どんなサボった味でこっちは天や万やだしたか。まあ、けど安心してください。はい。あんたの代わりに、ご機嫌、きっちり話しつけときました。三年契約成立がする。もう一個も無駄にできてしまえんで、さっさと帰って、曲作りに取りに行って帰りながらやるでしょう。え、あんたの契約?そんな話聞いてないのですかよ。ちょっとお待ちください。君は彼女の彼女に雇われているんだろう。
```

テキストの結果は確認できています。次はここから字幕のファイルを作成してみます。

```python
import whisper
from whisper.utils import get_writer

model = whisper.load_model("large")
result = model.transcribe("japanese-conversation-23645.mp3")

# save the result to srt file
writer = get_writer("srt", "./")
writer(result, "japanese-conversation-23645.srt")
```

> **_NOTE:_** utilsにあるWriteSRTを利用しています。

```
1
00:00:00,000 --> 00:00:15,920
はい、じゃあちょっと良くなったらお願いします。

2
00:00:19,920 --> 00:00:22,420
はい、じゃあ皆さん戻られたらお待ちしていただきます。

...省略...

22
00:01:45,760 --> 00:01:46,500
ちょっとお待ちください。

23
00:01:47,960 --> 00:01:50,000
君は彼女の彼女に雇われているんだろう。
```

発話者ごとに字幕が作られています。時間は概ね合っていますが、雑音まで含めてしまったので正確な時間であるとは言えない結果になりました。

ここで、transcribeのword_timestampsをtrueに指定するともっと時間が正確になる可能性があるので、試してもいいでしょう。

> word_timestamps: bool
> 
> Extract word-level timestamps using the cross-attention pattern and dynamic time warping, and include the timestamps for each word in each segment.
>
> https://github.com/openai/whisper/blob/e58f28804528831904c3b6f2c0e473f346223433/whisper/transcribe.py#L87

今までは、CPUを利用してWhisperを駆動してみました。結果の品質をあげようとするとそれなりの時間を要することにもなります。

CPUは汎用的な演算を前提にしているため、早めにAIの演算を遂行するために専用的なデバイスを利用することも可能です。

その中で、比較的に接しやすいGPUを利用してまた実行してみます。

# Acceleration with GPU
GPGPUと呼ばれるもので、CPUの演算の一部をGPUに担当させる技術を意味します。

このために各GPUのVendorから公表されている技術があり、NVIDIAのCUDAやAMDのROCmがその例です。

## Whisper with CUDA
PyTorchはCUDAにも対応していて、WhisperもCUDAで学習しているので比較的に使いやすい所があります。

> [PyTorch](https://pytorch.org/get-started/locally/)

NVIDIAのデバイスをお持ちの方は試してみてもいいでしょう。

## Whisper with ROCm
AMDではNVIDIAのCUDAに対抗してROCmを発表しています。

Whisperが利用しているPyTorchはROCmもサポートしているため、実行してみることができます。ただ、リファレンスなどはCUDAよりサポートが弱いこともあるので試行錯誤が必要です。

筆者のGPUでは、PyTorch 1.13とROCm 5.2の組み合わせで実行させることができました。

インストールは以下のようにできます。

```zsh
pip install torch==1.13.1+rocm5.2 torchvision==0.14.1+rocm5.2 torchaudio==0.13.1 --extra-index-url https://download.pytorch.org/whl/rocm5.2
```

ROCmがCUDAと交換性があるので実行できますが、バージョンによってはできなくなるなどが発生されますので、検証して利用しましょう。

# まとめ
AIの研究進み、AIの発展によって様々な開発がされています。グローバルな時代で言語よる障壁はAIでサポートすることが可能になってきています。

未熟な部分もありつつ、十分に利用可能な領域まで発展されていると感じられています。

今回は字幕というテーマでOpenAIのWhisperを利用してみて、どのような結果が得られるかを試しました。

字幕の品質を向上するために、設定値を変更するかAIモデルをチューニングすることも可能で、いずれ紹介できればと思っています。

これからAIの発展に伴い、どのようにAIを活用していけるか考えていきましょう。
