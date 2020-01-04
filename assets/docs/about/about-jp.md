# Blade II Online について

Blade II Online（ブレード・ツー・オンライン）は、[ロンドン・キングストン大学](https://www.kingston.ac.uk/) での最後の学年中開発した "Individual Project"（訳して個人プロジェクト、学位論文に近い）となったゲームです。

ブレード（ゲームによってブレードIIかゲート・オブ・アヴァロン）は[英雄伝説 閃の軌跡II](https://www.falcom.co.jp/sen2/kai/) や[東京ザナドゥ](https://www.falcom.co.jp/txana_explus/)等の[日本ファルコム](https://www.falcom.co.jp/)の作品でミニゲームとして含まれる一対一のカードゲームです。

例のゲームをプレイ中様々な形のブレードを遊ぶのがとても気に入り、大学の最終プロジェクトとしてリメイクしようと決断しました。

視野を広げると同時に、チャレンジを求めるため、原作のブレードのコンセプトを拡張し、世界中のどこにでもいる相手と遊べる、オンライン版を作ろうとしました。今まで得てきた知識と共に、インターンシップで重ねた重要な実践や経験を採用し、オンラインゲーム機能、ユーザーアカウント、ユーザー認証、プロフィール、ハイスコア、ログイン等を提供するバックエンド・システムの全体尚、ゲームのラーンチャーとゲームそのものを企画し、開発しました。

本ゲームのラーンチャーを、JavaScript でコードを書き、HTML と CSS で UI を構成し、[Electron](https://electronjs.org/) で作成しました。[League of Legends](https://jp.leagueoflegends.com/ja/) や [DotA 2](https://wikiwiki.jp/dota2/%E3%82%B2%E3%83%BC%E3%83%A0%E6%A6%82%E8%A6%81) のようなオンラインゲームと同様に様々な機能を含むラーンチャーを提供したかった私は、特に面白い [League of Legends ラーンチャーの最新版のアーキテクチャー](https://technology.riotgames.com/news/architecture-league-client-update)を記述する記事を読み、やはり Electron はこのラーンチャーのニーズ、残っている開発時間やリソースに関して最も相応しいと判断しました。急速なプロトタイピング、コンパイル時間の無さ、沢山の強力なオープンソースライブラリーが開発をより速く、楽にしました。

ゲームそのものは [Unreal Engine 4](https://www.unrealengine.com/ja/what-is-unreal-engine-4) で開発しました。可能な限りゲームとエンジンロジックは C++ を利用し、実装しました。個人的に意見を述べると、[Unity](https://unity.com/ja) で開発するのは Unreal Engine より楽だと思いますが、C++ を活かしたゲーム作成の経験が不足していたと思っていましたし、今でもそう思います。

自力で作ったグラフィック資料は全て [Maya](https://www.autodesk.co.jp/products/maya/overview) や [GIMP](https://www.gimp.jp.net) で作成しましたが、他の資料は諸無料やオーペンソースな元にいただきました。

バックエンド・インフラストラクチャーは色々なテクノロジーに支えられ、種々な [AWS](https://aws.amazon.com/) サービスを利用しています：

- [EC2](https://aws.amazon.com/ec2/?nc2=h_ql_prod_fs_ec2) 仮想マシンに載せた、[NGINX](https://www.nginx.com/) にリバースプロキシされた、Go で書いたゲームサーバー。
- [RDS for MySQL](https://aws.amazon.com/rds/mysql/) を活用する データ保存。
- 認証、ハイスコア、アカウント操作・検索等を提供する、[Lambda](https://aws.amazon.com/lambda/) と [API Gateway](https://aws.amazon.com/api-gateway/) を用いる、Go で書いた REST API。

---

### 本ゲームをお試しいただき誠に感謝いたします。

- スタントン・ジェームズ瑛之助