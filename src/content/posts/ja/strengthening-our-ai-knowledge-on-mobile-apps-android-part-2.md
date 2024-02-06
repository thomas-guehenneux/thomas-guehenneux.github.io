---
title: "モバイルアプリ・AI知識の強化-3Dメガネ"
tags: [AI, AR, Android]
image: "@/assets/posts/strengthening-our-ai-knowledge-on-mobile-apps-android-part-2/header.jpg"
authors:
  - dinakar-maurya
categories:
  - android
date: 2023-11-30
---

先日投稿したブログ記事[モバイルアプリの AI 知識を強化](https://engineering.monstar-lab.com/jp/post/2023/08/31/strengthening-our-ai-knowledge-on-mobile-apps/)では、AI を使ったリップスティック機能をご紹介しました。本日は続編とし、3D メガネのフィルターについて記事にしました！

# 3D メガネのフィルター

今回の検証では、3D メガネを取り入れることで、フィルター利用体験を新しい次元へと導きます。リップスティックを塗るだけでなく、顔の動きに合わせてリアルタイムでダイナミックに調整される 3D メガネをかけることができます。既存のランドマークポイントを利用して、新しいランドマークポイント（「mappedLandmarksScreenTopLeft」）を導き出し、正確な目の位置を特定できるようにしました。

以下は、3D メガネをかけた最終的なスクリーンショットです。

![](@/assets/posts/strengthening-our-ai-knowledge-on-mobile-apps-android-part-2/final_screen_shot.jpg)
次の動画は、3Dメガネを目の上にリアルタイムで表示し、最終的な出力を紹介するデモビデオです。これは、目の位置の検出とそれに応じてメガネのレンダリングを示しています。

<video width="400" controls autoplay>
  <source src="/assets/videos/posts/strengthening-our-ai-knowledge-on-mobile-apps-android-part-2/final_video.webm" type="video/webm">
  Your browser does not support HTML video.
</video>
# ハイライト

新しい重要なコンポーネントは、下のイメージ中に矢印で強調表示されている部分です。

![](@/assets/posts/strengthening-our-ai-knowledge-on-mobile-apps-android-part-2/new_module_marked.jpg)

# ４つの新モジュール

### 1. ThreeDModelLoader (3DModelLoader)

このクラスは、アセットファイルからの 3D モデルのロードを管理し、サイズ、色、位置シフト、回転などのパラメーターの変更を可能にします。当初、Android 3D モデル・ビューワー・ライブラリでは ExampleSceneLoader と表示されていましたが、AR Makeup Android Prototype のために適応されました。私たちのアプリの中で機能し、新しい機能を導入し、アプリ内でレンダリングするための多様な 3D オブジェクトの側面のカスタマイズを可能にします。 このクラスに setRotationY()のような関数を組み込むことで、さらに機能を拡張できる可能性を示しています。この機能は、アプリケーションの将来の反復やアップデートにおいて、3D モデルの高度な操作やカスタマイズを可能にすることを示唆しています。

### 2. ThreeDModelView (3DModelView)

README では 3DModelView としても参照されている ThreeDModelView は、Android の 3D モデルビューワーライブラリ内の重要なコンポーネントです。プロジェクトのニーズに合わせて、このクラスは Kotlin に変換され、背景を透明にすることに重点を置いています。

主に 3D 空間のレンダリングを行い、そのために ModelRenderer を利用しています。修正には Kotlin への変換と、透明性を確保するための背景設定の構成が含まれます。

### 3. mappedLandmarks

ビットマップ画像の左上原点（0,0 ～ 411\*548）に精密にマッピングされ、ビットマップキャンバス内の要素を正確に配置できます。イメージのデバッグやパディングの調整に欠かせません。

### 4. mappedLandmarksScreenTopLeft

画面の左上隅（0,0 ～ 411,548）に正確にマップされ、オブジェクトの正確な配置と画面上の簡単なパディング調整に極めて重要です。アプリ内での正確な位置決めを保証するために、「displayDebugScreenCoordinatesView」というメソッドを実装しました。このメソッドは、各位置で画面上にカラフルなマークを描画し、これらの座標がビットマップ上のマッピングされたランドマーク位置に正確に対応していることを確認できます。この検証プロセスにより、マッピングされたランドマークがビットマップ内の意図した位置に正しく配置されていることが確認できます。

理想的なシナリオでは、'mappedLandmarks' と 'mappedLandmarksScreenTopLeft' の両方で同じ結果が得られるはずです。この位置合わせと座標の精度は非常に重要で、ビットマップ上で特定された位置と、画面左上にマッピングされた対応する位置が正確に一致することを保証します。このパリティによって、座標マッピングプロセスの正確さと、画面上の意図した位置との整合が確認されます。

ランドマークランドマークポイント例：(0,0)、(10,200)、...、(0,548)、(548,0)、(411,0)、(0,411)。これらのランドマークランドマークポイントは、ビットマップとスクリーン座標内に要素を正確に配置するための青写真として機能し、シームレスなユーザー体験を保証します。

**上記 1 および 2 の 3D モジュール**

[使用 3D モジュールライブラリ](https://github.com/WenlinMao/android-3d-model-viewer)
このライブラリのコードにはいくつかのカスタマイズが実装されており、特定のファイルを Kotlin に変換したり、コルーチンを使ってバックグラウンド・ロードを可能にしたり、assets フォルダからファイルを読み込んだり、3DModelLoader を使って 3D メガネを 1 つロードしてローダー機能を例示したりすることができます。2 つのモジュールは、既存コードのエントリー・ランドマークポイント・モジュールです。

# 実装

# 3D メガネを被せるまでのステップ

# 1. 3D メガネのロード

LiveCameraActivity の ThreeDModelLoader クラスを利用して、アセットフォルダから 3D メガネ（.obj ファイル）を読み込みます。

- 3DGlass.obj - 3D メガネのオブジェクトファイル

- 3DGlass.mtl - 3D メガネのテクスチャファイル

# 2. 画像寸法の拡大縮小：

processCameraImage 関数を使用して画像のサイズを変更します。scaleBitmapToScreenWidth メソッドを使用して、画像がスクリーン幅に適合するようにします。

- Pixel 6 デバイスでの注目すべき変換： 画像サイズは(480\*640)からコンパクトな(411\*548)に変換され、アスペクト比は維持されます。

# 3. MergedBitmapResult によるデータの強化

MLKitFaceDetector クラスは mergeBitmaps 関数を拡張し、MergedBitmapResult 構造体にエンリッチされたデータをもたらします

```
/**
 * Represents the result of merging bitmaps and adjusting facial landmarks origin as top left corner.
 * Make sure to draw bitmap from top left of the screen so that can see the result exactly over landmark positions.
 *
 * @property mergedBitmap The merged final bitmap.
 * @property mappedLandmarks List of adjusted facial landmarks' points origin as top left of @mergedBitmap distributed (0,0) to @mergedBitmap(width, height)
 * It can be used for debugging points over @mergedBitmap
 *
 * @property mappedLandmarksToScreenTopLeft List of adjusted facial landmarks' points, originating from the top-left corner of the screen, distributed from (0,0) to screen(width, height) / requested(width, height).
 * In an ideal scenario, mappedLandmarks and mappedLandmarksToScreenTopLeft might coincide. However, in cases where there is screen padding (vertical, horizontal), the mappedLandmarksToScreenTopLeft points will differ.
 * For example, if mappedLandmarks is (10, 300) and there is a left-side padding of 5 and top padding of 0, then mappedLandmarksToScreenTopLeft will be (10+5, 300+0).
*/
data class MergedBitmapResult(
    val mergedBitmap: Bitmap,
    val mappedLandmarks: List<PointF>,
    val mappedLandmarksToScreenTopLeft: List<PointF>
)
```

- エンリッチデータには、MergedBitmap、MappedLandmarks、MappedLandmarksToScreenTopLeft が含まれます。

- 関数 "mapLandmarksToScreenTopLeft "についての注記 この注記は、mapladLandmarksToScreenTopLeft 関数が点をスクリーン座標にマッピングするために不可欠であることを強調し、特にパディングが存在する場合はそれを考慮することの重要性を強調しています。現在パディングがない場合でも、パラメータはパディングが存在する場合はそれを考慮し、最終的に調整された座標がマップされたランドマークに正確に一致するようにする必要があることを明確にしています。より明確な説明は、上記の mappedLandmarksToScreenTopLeft のコメントを参照してください。

- パディングは、ランドマークポイントをずらして歪ませ、結果として 3D メガネの位置がずれてしまう可能性があります。

下の画像では、画像の左詰めに問題があります。

現在のシナリオでは、この問題を防ぐためにパディングをゼロに設定しています。しかし、私たちのコード・アーキテクチャは、パディングの調整を伴うシナリオに容易に適応できるように設計されています。

# 4. 3D メガネの x と y の位置を求める

'findLeftmostEyePosition'という関数があり、左目の位置を特定します。適切な関数を選択し、それを「threeDGlassPositionX」と「threeDGlassPositionY」変数に代入することで、3D メガネを正確に目の位置に配置することができます。

# 5. 3D メガネを画面上に表示する

LiveCameraView 内で、3D メガネ・ビューの表示は、関数 displayThreeDView によって編成されます。この関数は、LiveCameraViewModel で定義されたメガネの位置座標（threeDGlassPositionX、threeDGlassPositionY）を利用します。

- ### 実際のスクリーン上の画像表示
  Android の Box 要素を活用して 3D ビューの寸法を調整し、arProcessedOutputBitmap の幅と高さに合わせます。Box の構成は、width = requestedImageWidth.dp と height = requestedImageHeight.dp です。

```
Box(
    modifier = Modifier.size(
        width = requestedImageWidth.dp,
        height = requestedImageHeight.dp
    ), {
    displayThreeDView // 3d view
    Image(contentScale = ContentScale.FillHeight) // camera image
    }
```

画像コンテンツのスケールは、ContentScale.FillHeight として設定され、画像幅を維持しながら、垂直方向に拡大されます。

- ### コンポーズ・ビューで 2DView と 3DView を組み合わせる
  3D メガネ（displayThreeDView）とカメラ画像ビューの両方をボックス内にネストしてレンダリングすることで、3D メガネと 2D カメラ画像を同時に表示することができます。

```
Box({
    displayThreeDView // 3d view
    Image // camera image
    })
```

- ### 目の位置に 3D メガネを重ねる
  displayThreeDView 関数内で、3D メガネ・ビューは AndroidView コンポーザブルを利用してレンダリングされる。これにより、LiveCameraViewModel から取得した threeDGlassPositionX 座標と threeDGlassPositionY 座標に基づいて、3D メガネオーバーレイの位置決めが容易になります。

```
displayThreeDView ->
    liveCameraViewModel.threeDGlassPositionX.value?.toFloat()?.let { posX ->
        liveCameraViewModel.threeDGlassPositionY.value?.toFloat()?.let { posY ->
            // Keep this for debug purpose
            AndroidView(
                modifier = Modifier
                    .offset(posX.dp, posY.dp), // position
                factory = { _ ->
                    `3DView` // view
                }
            )
        }
    }
```

# ランドマーク測位のためのデバッグ・システム

精度を追求するため、DebugUtils.kt ファイルには、3D 空間内の点を追跡するのに不可欠な関数が豊富に用意されています。

**デバックの詳細**

### 1. 画面上のデバッグ - displayDebugScreenCoordinatesView 関数

デバッグに不可欠な画面座標を示すビジュアルインターフェースです。この機能は、UI キャンバス上に目の位置を含む点の集合を表示します。この視覚的な表示により、綿密な精査が容易になり、迅速なバグ修正が可能になります。

**A.** 下の画像は、スクリーン座標が描かれた正方形または長方形の背景をスクリーン上に表示したものです。これは、ランドマークポイントが正しく配置され、ビットマップ上の意図した位置に正確に配置されていることを確認するのに役立ちます。

![スクリーン上のデバッグランドマークポイント](@/assets/posts/strengthening-our-ai-knowledge-on-mobile-apps-android-part-2/points_eye_window.jpg)
Figure: スクリーン上のデバッグランドマークポイント

**B.** 下の写真では、四角いオーバーレイが取り除かれ、3D メガネが正しく配置され、指定されたランドマークポイントに従っていることがわかります。

![メガネを目の上に正確に配置](@/assets/posts/strengthening-our-ai-knowledge-on-mobile-apps-android-part-2/points_eye_glass.jpg)
Figure: メガネを目の上に正確に配置

### 2 ビットマップ上のデバッグ - drawFacePointsIncludingEyesOnBitmap 関数

目や唇など、顔の主要なランドマークをビットマップ上に描くための UI メソッド。青と緑の濃淡を利用して、これらの視覚的な手がかりが顔の特徴をシームレスに識別します。

**A.** 下の写真は、唇、目、顔のランドマークを、ビットマップの上にはっきりとした色で表示したもので、これらの顔の特徴が正確に配置されていることを確認するためのものです。

![ビットマップ上のデバッグランドマークポイント](@/assets/posts/strengthening-our-ai-knowledge-on-mobile-apps-android-part-2/points_over_bitmap.jpg)
Figure: ビットマップ上のデバッグランドマークポイント

**B.**
下の写真では、3D メガネが目の上に正確に描画され、ビットマップのランドマークポイントと完全に一致しています。

![ビットマップとメガネの上に描かれたデバッグランドマークポイント](@/assets/posts/strengthening-our-ai-knowledge-on-mobile-apps-android-part-2/points_over_bitmap_glass.jpg)
Figure: ビットマップとメガネの上に描かれたデバッグランドマークポイント

# なぜ UI デバッグが重要なのか

- ### 検証とデバッグの精度

displayDebugScreenCoordinatesView と drawFacePointsIncludingEyesOnBitmap の間の整列と同期は極めて重要です。これらの要素間の相関関係は、正確なデバッグプロセスを保証し、迅速なバグ解決と機能の改良を可能にします。

- ### デバッグへの綿密なアプローチを公開

これらの関数を活用することで、私たちのデバッグメカニズムは、AR フィルターの洗練に不可欠な顔のランドマークの正確な情報が取得できます。

# 直面した課題

### 1. Android デバイスのスクリーン上に画像を表示する際の課題

- Android デバイスのスクリーンに画像を表示することは困難でした。スケーリング係数を適用しないと、サイズ(411\*548) の画像は物理的なスクリーン上では小さすぎるように見えます。

- スケーリングを適用しないと、スクリーンの物理的サイズに比べて画像が著しく小さく表示されます。

下の画像は、カメラ画像が小さく、点とメガネが離れて配置されていることを示しています。

![](@/assets/posts/strengthening-our-ai-knowledge-on-mobile-apps-android-part-2/without_scale_issue.jpg)

試行錯誤と調整によりこれらの課題を解決し、画面上のランドマークポイントの適切なマッピングを維持しながら、3D モデルをより正確に描画することに成功しました。

### 2. コンポーズ・ビューで 2DView と 3DView を組み合わせる際の問題

当初、コンポーズ・ビューに 3D モデルを統合することを目指していました。しかし、カメラのビットマップ画像をライブラリから 3D ビューに統合する最初の試みは、期待通りの結果を得ることができませんでした。

そのため、Android View と ThreeDModelView をレイヤーとして併用し、3D ビュー内に画像を効果的に表示する別の手法を採用する必要がありました。

### 3. 画像のスケーリングとマップされたランドマークポイントの問題：

垂直方向と水平方向の両方向に画像をスケーリングすると、複雑な問題が発生しました。これは、スクリーン座標にマッピングされたランドマークポイントのズレを引き起こしました。

その結果、マップされたランドマークポイントが画面上の実際の位置を正確に反映しなくなりました。

**問題 01**
下の画像は、ランドマークポイントが水平方向にずれている問題です。黄色のカラーランドマークポイントが右側にずれています。

![](@/assets/posts/strengthening-our-ai-knowledge-on-mobile-apps-android-part-2/horizontal_shifting_right_side_issue.jpg)

**問題 02**

下の画像は、ランドマークポイントが垂直方向にずれている問題です。黄色の点が下側にずれています。
![](@/assets/posts/strengthening-our-ai-knowledge-on-mobile-apps-android-part-2/vertical_shifting_bottom_side_issue.jpg)

**解像度**

正確なマッピングのための画像スケーリングの補正

この課題に対処するため、画像の幅を調整し、縦方向にのみスケーリングしました。この方法は、ビットマップのランドマークポイントがビットマップ自体のサイズと一致するため、効果的であることが証明されました。

この修正により、ランドマークポイントの正確なマッピングが可能になり、以前直面していたアライメントの問題が修正されました。

下の画像では、垂直方向と水平方向の点のずれが修正されています。そして、ランドマークポイントは正しい位置に表示されていることがわかります。
![](@/assets/posts/strengthening-our-ai-knowledge-on-mobile-apps-android-part-2/bitmap_screen_coordinates_points_exactly_same_place.jpg)

# 画像のサイズとスケーリングに使用されるデータ例

ピクセル 6 デバイス

dp - UI 要素が異なる画面サイズや解像度で一貫したサイズを維持するのに役立ちます。

dp の画面サイズ

サイズ(411\*840)

ピクセル単位の画面サイズ

サイズ(1080\*2250)

カメラで撮影した直後の処理前の拡大縮小画像

サイズ(480\*640)

処理後、すなわちスケーリング

サイズ(411\*548)

# 今後の計画

この挑戦はまだ始まったばかりです！改善のためのロードマップは以下の通りです：

- 3dModule[ライブラリ](https://github.com/WenlinMao/android-3d-model-viewer)を[Google ARCore](https://developers.google.com/ar/develop)に置き換える。

エンジンモジュールのコードを Google ARCore に置き換え、新しい機能を統合することができます。GitHub モジュールは頻繁に更新されないので、新機能を追加するのが難しくなるかもしれません。

- ダイナミック・メガネ・ズーム

顔の位置の変化に合わせて直感的に拡大縮小するメガネを体験できます。

- 顔の動きに合わせたメガネの回転

MLKitFaceDetector の既存モジュール属性 face.headEulerAngleX、face.headEulerAngleY、face.headEulerAngleZ で利用可能な以下の顔属性を使用して、表情に合わせて調和的に回転するメガネを体験できます。

# クレジット

[ダウンロードした無料の 3D メガネ](https://www.turbosquid.com/ja/3d-model/free/glasses)

アンドロイド 3D ライブラリは、3D メガネをレンダリングするために使用しました。

# まとめ

私たちの Android アプリに 3D メガネを追加したとき、いくつか問題がありましたが、解決することができました！まず、カメラの画像と 3D ビューを一致させるのが大変でした。そこで、3D ビューを表示する別の方法を試したところ、うまくいきました。

次に、写真の大きさを変更した際、画面にうまく収まりませんでした。しかし、写真の幅と高さを修正したら、すべてが完璧に見えるようになりました。

それから、3D メガネがスクリーンに正しく表示されるようにしなければなりませんでした。私たちは、3D メガネが目の動きに合わせてリアルタイムでスクリーンにぴったり合うように、何度も改修を加えました。
私たちはこれからも AI を使ってモバイルアプリをさらに最高のものにしていきます！
