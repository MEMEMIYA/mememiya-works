// Works Data - VJ作品とイベント情報
const worksData = {
    // All Works
    all: [
        // Featured Works用の作品
        {
            id: 'not-applicable',
            title: 'Not Applicable',
            year: '2025',
            yearMonth: '2025年11月上旬~下旬',
            categories: ['ジェネVJ','VJ', 'ライブ', '個人制作'],
            thumbnail: 'assets/images/thumbnails/Thumbnail_NotApplicable.jpg',
            youtube: 'https://youtu.be/XIRyIAMlUXM?si=N_ENquWf-RXLh3mB',
            description: 'VRChatで行われた本イベント『Not Applicable』にて、DJ ymg氏の映像演出（VJ）を担当しました。このワールドは背面の大きなスクリーンに加え、前面の計16個のTVモニターにも映像を映し出せる点が魅力です。UnityによるジェネレーティブVJ映像を核としつつ、前方テレビへの個別投影および制御にはResolumeを用い、プリレンダリング映像を投影しました。VRChat内の仮想カメラを用いて、DJの姿をリアルタイムで映し出す演出を行った点も特徴です。',
            gallery: [
                'assets/images/flyers/FLYER_NotApplicable_20251130.jpg',
                'assets/images/subImage/na_配線図_01.png',
            ],
            tags: ['ジェネVJ', 'Unity', 'VRChat'],
            blogUrls: [
                {
                    url: 'https://note.com/mememiya/n/ne2641c0d5789',
                    title: '今年VJとして出たイベントまとめ【2025年1月~12月】',
                    description: '2025年1月から12月までに出演したDJVJイベントをまとめました。『Iwaken Lab. Advent Calendar 2025』の参加記事です。',
                    image: 'https://assets.st-note.com/production/uploads/images/238425191/rectangle_large_type_2_8ebec54b63c70ccd707a29800667088a.jpeg?fit=bounds&quality=85&width=1280'
                }
            ],
            meta: {
                duration: '1か月',
                制作形態: '個人制作',
                tools: 'Unity　Resolume Arena　TouchDesigner　Sound2Light　Fork　etc.',
                tech: 'リアルタイムレンダリング　オーディオリアクティブ'
            }
        },
        {
            id: 'kabuki',
            title: '歌舞伎町遊戯祭KEREN〜外連〜',
            year: '2025',
            yearMonth: '2025年11月上旬~下旬',
            categories: ['プロジェクションマッピング','VJ', 'ライブ',  'チーム制作'],
            thumbnail: 'assets/images/thumbnails/Thumbnail_keren.jpg',
            gallery: [
                'assets/images/subImage/keren_03.jpg',
                'assets/images/subImage/KEREN_combine_01.png'
            ],
            description: '歌舞伎町で行われたイベント『歌舞伎町遊戯祭KEREN〜外連〜』にて、VJの90n83i氏と共に、DJ Pokamon氏およびDJ Dekkachan氏のVJを担当しました。Resolume Arenaを用いてプロジェクションマッピングを行いながらVJを行ったほか、PCを2台使用してP2P接続を行い、ウェブカメラでDJの姿をリアルタイムで映して投影する演出を取り入れました。なお、投影先のサッカーボール状のオブジェクトは別の方の制作物です。投影面は六角形・五角形の面が計8か所あり、3台のプロジェクターを使用してマッピングを行いました。',
            tags: ['プロジェクションマッピング','VJ'],
            blogUrls: [
                {
                    url: 'https://note.com/mememiya/n/ne2641c0d5789',
                    title: '今年VJとして出たイベントまとめ【2025年1月~12月】',
                    description: '2025年1月から12月までに出演したDJVJイベントをまとめました。『Iwaken Lab. Advent Calendar 2025』の参加記事です。',
                    image: 'https://assets.st-note.com/production/uploads/images/238425191/rectangle_large_type_2_8ebec54b63c70ccd707a29800667088a.jpeg?fit=bounds&quality=85&width=1280'
                }
            ],
            meta: {
                duration: '約2週間',
                制作形態: 'B2B VJ 90n83i',
                tools: 'Resolume Arena　TouchDesigner　Sound2Light　PremierePro',
                tech: 'リアルタイムレンダリング　P2P'
            }
        },
        {
            id: 'draw-tokyo-3',
            title: 'draw(tokyo);#3 ',
            year: '2025',
            yearMonth: '2025年7月~10月',
            categories: ['ジェネVJ','VJ', 'ライブ','個人制作'],
            thumbnail: 'assets/images/thumbnails/Thumbnail_drawTokyo03_02.png',
            youtubeIds: ['m0W6QtjCpxk'],
            gallery: [
                'assets/images/subImage/drawTokyo3_combine_01.png',
                'assets/images/subImage/drawTokyo3_combine_02.png',
                'assets/images/subImage/drawTokyo3_combine_03.png'
            ],
            description: '渋谷のclubasiaで行われた、ジェネレーティブVJ(ジェネVJ)がコンセプトのクラブイベント『draw(tokyo);#3』での映像およびシステムです。ラウンジフロアにて、DJはnon氏、VJは90n83i氏とB2B形式で出演しました。演出面では「オカルトとSF」をテーマに設定し、ラウンジフロアの進行管理も一部担当しました。',
            meta: {
                duration: '3ヶ月',
                制作形態: 'B2B VJ 90n83i',
                tools: 'Unity　TouchDesigner　Sound2Light　Fork',
                tech: 'リアルタイムレンダリング　オーディオリアクティブ'
            },
            tags: ['ジェネVJ', 'Unity'],
            blogUrls: [
                {
                    url: 'https://note.com/mememiya/n/n7284ce7b9d73',
                    title: 'ジェネVJ初心者が『draw(tokyo);#3』でVJしたので振り返り&ざっくり解説',
                    description: 'draw(tokyo);#3でのジェネVJ演出について振り返りました。',
                    image: 'https://assets.st-note.com/production/uploads/images/237962470/rectangle_large_type_2_e04f6d716fd8826d293a91e0f95942cd.png?fit=bounds&quality=85&width=1280'
                },
                {
                    url: 'https://note.com/mememiya/n/ne2641c0d5789',
                    title: '今年VJとして出たイベントまとめ【2025年1月~12月】',
                    description: '2025年1月から12月までに出演したDJVJイベントをまとめました。『Iwaken Lab. Advent Calendar 2025』の参加記事です。',
                    image: 'https://assets.st-note.com/production/uploads/images/238425191/rectangle_large_type_2_8ebec54b63c70ccd707a29800667088a.jpeg?fit=bounds&quality=85&width=1280'
                }
            ]
        },
        {
            id: 'cinema-dining',
            title: '和菓子のシネマダイニング',
            year: '2025',
            yearMonth: '2025年4月~6月',
            categories: ['インタラクティブ映像', 'チーム制作'],
            thumbnail: 'assets/images/thumbnails/Thumbnail_JapaneseSweets_01.jpg',
            youtubeIds: ['iUJkl_Mvl7s', 'eZqGyIx_rbw'],
            gallery: [
                'assets/images/subImage/JapaneseSweets_01.jpg',
                'assets/images/subImage/JapaneseSweets_02.jpg'
            ],
            description: '6月の和菓子「水無月」を五感で楽しむシネマダイニングの企画・制作です。大学のグループ実習にて、企画立案からシステム構築まで一貫して行いました。私は主にPMや絵コンテ、投影システムの設計、プロジェクションマッピング等のテクニカルディレクションを担当しました。Kinect（深度センサー）を用いて、動かすお皿の位置に「立葵（タチアオイ）」の花が追従するインタラクティブな仕掛けを実装しています。背景には「紫陽花」を配し、すべて6月にちなんだモチーフで空間を構成しました。また、大学内での運用・安全面を考慮し、短焦点プロジェクターを用いた省スペースかつ安全な投影環境を構築しています。',
            tags: ['Kinect', 'TouchDesigner', 'プロジェクションマッピング'],
            meta: {
                duration: '2ヶ月',
                制作形態: 'チーム制作(4名)',
                tools: 'Unity　TouchDesigner　Procreate',
                role: '絵コンテ　投影　機材調達　マッピング　PM'
            }
        },
        'coming-soon',
        'coming-soon',
        'coming-soon',
        {
            id: 'digital-floral-flow',
            title: 'Digital Floral Flow',
            year: '2024',
            yearMonth: '2024年3月~4月',
            categories: ['インタラクティブ映像', '個人制作'],
            thumbnail: 'assets/images/thumbnails/Thumbnail_DFF.jpg',
            gallery: [
                'assets/images/subImage/DFF_combine_01.png',
                'assets/images/subImage/DFF_05.png',
                'https://youtube.com/shorts/Oh7fzmYBaJw?si=JUFkadvpQyqo3GtY'
            ],
            youtube: 'https://youtube.com/shorts/Oh7fzmYBaJw?si=JUFkadvpQyqo3GtY',
            description: '手の動きに反応して池の中の水や植物が揺れる、四季折々のインタラクティブ映像です。Kinectを使用しており、手やマウスの動きに合わせて、水に浸かった木の棒が追従します。ボタン操作によって四季も変化し、夏は昼と夜の2バージョンを用意しました。夜のシーンでは花火が打ち上がります。大学のオープンキャンパスにて展示しました。',
            tags: ['個人制作', 'TouchDesigner', 'Kinect'],
            meta: {
                duration: '1か月',
                制作形態: '個人制作',
                tools: 'TouchDesigner　Photoshop',
                使用デバイス: 'Azure Kinect　短焦点プロジェクター'
            }
        },
        {
            id: 'welcome-party-ar-live',
            title: '新入生歓迎会でのARライブ',
            year: '2023',
            yearMonth: '2023年3月~4月',
            categories: ['VJシステム制作', 'ライブ', 'チーム制作'],
            thumbnail: 'assets/images/thumbnails/Thumbnail_新入生歓迎会_03.jpg',
            youtubeIds: ['https://youtu.be/EI4zuU0Q4As', 'https://youtu.be/QCPcm_asuJU', 'https://youtu.be/BFefcM2uym4', 'https://youtu.be/hlWddLdkeQI'],
            description: '大学で行われた「IPUT DUNK」という新入生歓迎イベントの演目の中のDJVJ ARLiveの中で用いるVJシステムを制作しました。TouchDesignerを用いており、誰でも簡単にマウスで操作できることをコンセプトにオーディオビジュアライザーを制作しました。あわせてUnreal Engineでの演出指示も担当しています。イベント本番では私自身がメインVJを務めたため、友人へこのシステムによる側面投影用VJを委託しました。NDIでシステムから映像を伝送し、ホールの側面にAR合成する構成です。AR合成された映像は配信されたほか、会場内のモニターでも閲覧可能でした。',
            tags: ['TouchDesigner', 'AR', 'Live'],
            gallery: [
                'assets/images/flyers/FLYER_IPUTDUNK_20230408.jpg'
            ],
            meta: {
                duration: '1か月',
                制作形態: 'チーム制作',
                tools: 'TouchDesigner　Resolume Avenue　Procreate',
                役割: '正面スクリーンのVJ　TouchDesignerを用いた演出システム制作　一部Unreal Engine演出指示'
            },
        },
        {
            id: 'glsl-live-coding',
            title: 'GLSLでのライブコーディング',
            year: '2023',
            yearMonth: '2023年10~11月',
            categories: ['プログラミング', '個人制作'],
            thumbnail: 'assets/images/thumbnails/Thumbnail_LiveCording_03.jpg',
            youtubeIds: ['https://youtu.be/d2nRm-Cpv_k?si=u0rmYnyTuR75jeby', 'https://youtu.be/dH47YXjt2xY', 'https://youtu.be/WppucT-v9TY', 'https://youtu.be/taDxOp8jQbQ'],
            description: 'GLSLを用いたライブコーディング・パフォーマンスです。リアルタイムでコードを書きながらビジュアルを生成しています。',
            tags: ['個人制作', 'GLSL', 'Real-time'],
            meta: {
                duration: '1か月',
                制作形態: '個人制作',
                tools: 'KodeLife　TwiGL',
                tech: 'リアルタイムレンダリング　'
            }
        },
        {
            id: 'toho-pv',
            title: 'ここでしか味わえないをもっと！',
            year: '2023',
            yearMonth: '2022年12月~2023年2月',
            categories: ['プロモーションビデオ', 'チーム制作'],
            thumbnail: 'assets/images/thumbnails/Thumbnail_TOHO_02.jpg',
            youtube: 'https://youtu.be/RXvp9IiYIt0',
            description: 'TOHOシネマズ学生映画祭に向けて制作した、コーラとポップコーンのプロモーション映像（CM）です。チームリーダー兼監督としてプロジェクトを主導しました。コンペティションにて最終選考まで残り、日比谷のTOHOシネマズのスクリーンにて上映されました。',
            tags: ['PV', 'コンペティション参加作品', 'チーム制作'],
            gallery: [
                'assets/images/subImage/TOHO_01.png'
            ],
            meta: {
                duration: '1か月半',
                tools: 'Blender　Premiere Pro　AfterEffects　Illustrator',
                制作形態: 'チーム制作(10名)',
                役割: '監督　企画　一部実写撮影　絵コンテ　編集　モデリング　一部アニメーション'
            }
        },
        {
            id: '256fes-souta',
            title: '256fes参加 キャラモデリング',
            year: '2022',
            yearMonth: '2022年7月',
            categories: ['モデリング', '個人制作'],
            thumbnail: 'assets/images/thumbnails/Thumbnail_Souta.png',
            gallery: [
                'assets/images/thumbnails/Thumbnail_Souta.png'
            ],
            description: 'Mayaを使用して制作した「256fes」参加用のキャラクターモデルです。256個の三角形ポリゴンと、一辺256pxのテクスチャ一枚のみでキャラクターを構成する制限の中で制作しました。　#256fes',
            tags: ['Maya', 'Blender', '個人制作'],
            meta: {
                duration: '1か月',
                制作形態: '個人制作',
                tools: 'Blender　Maya　Photoshop',
            }
        }
        // ================================
        // Coming Soon - 準備中の作品
        // ここに 'coming-soon' を追加すると、その位置にComing Soonカードが表示されます
        // 複数追加可能です
        // ================================

    ],

    // VJ Events - vj-events-data.jsから読み込み
    events: typeof vjEventsData !== 'undefined' ? vjEventsData : []
};

// Featured Works配列を生成（IDリストから参照）
if (typeof featuredWorksIds !== 'undefined') {
    worksData.featured = featuredWorksIds.map(id => {
        return worksData.all.find(work => work.id === id);
    }).filter(work => work !== undefined);
} else {
    worksData.featured = [];
    console.warn('⚠ featuredWorksIds not found, featured array is empty');
}
