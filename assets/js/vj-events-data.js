// VJ Events Data - イベント出演履歴
const vjEventsData = [
    {
        id: 'rftp',
        title: 'Remember Future Tea Party',
        date: '2025.12.17',
        year: '2025',
        type: 'vr',
        thumbnail: 'assets/images/flyers/FLYER_RFTP_20251217.jpg',
        gallery: [
            'assets/images/flyers/FLYER_RFTP_20251217.jpg'
        ],
        venue: 'Kawaii系の曲が流れるVRChatの音楽イベント',
        hashtags: ['RFTP_VRC']
    },
    {
        id: 'na',
        title: 'NotApplicable',
        date: '2025.11.30',
        year: '2025',
        type: 'vr',
        thumbnail: 'assets/images/flyers/FLYER_NotApplicable_20251130.jpg',
        gallery: [
            'assets/images/flyers/FLYER_NotApplicable_20251130.jpg'
        ],
        venue: '無記入',
        hashtags: ['NotApplicable_VR']
    },
    {
        id: 'keren',
        title: '歌舞伎町遊戯祭KEREN〜外連〜',
        date: '2025.11.26',
        year: '2025',
        type: 'real',
        thumbnail: 'assets/images/flyers/FLYER_KEREN_20251126_01.png',
        gallery: [
            'assets/images/flyers/FLYER_KEREN_20251126_01.png',
            'assets/images/flyers/FLYER_KEREN_20251126_02.png'
        ],
        venue: '無記入',
        hashtags: ['KEREN', '外連']
    },
    {
        id: 'draw3',
        title: 'draw(tokyo);#3',
        date: '2025.10.12',
        year: '2025',
        type: 'real',
        thumbnail: 'assets/images/flyers/FLYER_drawTokyo03_20251012_01.jpg',
        gallery: [
            'assets/images/flyers/FLYER_drawTokyo03_20251012_02.jpg'
        ],
        venue: 'ジェネVJがテーマのクラブイベント',
        hashtags: ['function_draw']
    },
    {
        id: '202509infinity',
        title: 'INFINITY0',
        date: '2025.09.20',
        year: '2025',
        type: 'vr',
        thumbnail: 'assets/images/flyers/FLYER_INFINITY0_20250920.jpg',
        gallery: [
            'assets/images/flyers/FLYER_INFINITY0_20250920.jpg'
        ],
        venue: '無記入',
        hashtags: ['INFINITY0']
    },
    {
        id: 'sinnyuusei-welcome-2025',
        title: '新入生歓迎会 in 東京国際工科専門職大学',
        date: '2025.4.26',
        year: '2025',
        type: 'real',
        venue: '無記入'
    },
    {
        id: 'event-pjt-toshinose',
        title: 'pjt_年の瀬に向け',
        date: '2024.12.23',
        year: '2024',
        type: 'vr',
        thumbnail: 'assets/images/flyers/FLYER_pjt年の瀬に向け_20241223.png',
        gallery: [
            'assets/images/flyers/FLYER_pjt年の瀬に向け_20241223.png'
        ],
        venue: '無記入',
        hashtags: ['pjt_年の瀬に向け']
    },
    {
        id: 'event-infinity-last',
        title: 'CLUBINFINITY2024LAST',
        date: '2024.12.14',
        year: '2024',
        type: 'vr',
        thumbnail: 'assets/images/flyers/FLYER_INFINITY_20241214.jpg',
        gallery: [
            'assets/images/flyers/FLYER_INFINITY_20241214.jpg'
        ],
        venue: '無記入',
        hashtags: ['INFINITY']
    },
    {
        id: 'event-infinity-nov',
        title: 'INFINITY0',
        date: '2024.11.09',
        year: '2024',
        type: 'vr',
        thumbnail: 'assets/images/flyers/FLYER_INFINITY0_20241109.jpg',
        gallery: [
            'assets/images/flyers/FLYER_INFINITY0_20241109.jpg'
        ],
        venue: '無記入',
        hashtags: ['INFINITY']
    },
    {
        id: 'event-beforeglow',
        title: 'BeforeGlow',
        date: '2024.11.01',
        year: '2024',
        type: 'vr',
        thumbnail: 'assets/images/flyers/FLYER_BeforeGlow_20241101.jpg',
        gallery: [
            'assets/images/flyers/FLYER_BeforeGlow_20241101.jpg',
            'assets/images/flyers/FLYER_BeforeGlow_20241101_02.jpg'
        ],
        venue: 'VRChat | VRクラブイベント',
        hashtags: ['BeforeGlow']
    },
    {
        id: 'event-excite-ep2',
        title: 'EXCITE EPISODE2',
        date: '2024.10.27',
        year: '2024',
        type: 'vr',
        thumbnail: 'assets/images/flyers/FLYER_EXCITE_20241027.jpg',
        gallery: [
            'assets/images/flyers/FLYER_EXCITE_20241027.jpg'
        ],
        venue: 'VRChat | EXCITE シリーズ',
        hashtags: ['CLUBEXCITE']
    },
    {
        id: 'event-iput-festa-oct',
        title: 'IPUT FESTA',
        date: '2024.10.19',
        year: '2024',
        type: 'real',
        thumbnail: 'assets/images/flyers/FLYER_IPUTFesta_20241019.jpg',
        gallery: [
            'assets/images/flyers/FLYER_IPUTFesta_20241019.jpg'
        ],
        venue: '東京国際工科専門職大学 | 学園祭イベント'
    },
    {
        id: 'sinnyuusei-welcome-2024',
        title: '新入生歓迎会 in 東京国際工科専門職大学',
        date: '2024.4.27',
        year: '2024',
        type: 'real',
        venue: '無記入'
    },
    {
        id: 'iwaken-lab3-anniversary',
        title: 'Iwaken.Lab3周年記念パーティー in TOKYO NODE',
        date: '2024.3.23',
        year: '2024',
        type: 'real',
        venue: '無記入',
        hashtags: ['IwakenLab3周年']
    },
    {
        id: 'draw-tokyo-1',
        title: 'draw(tokyo);#1',
        date: '2024.02.24',
        year: '2024',
        type: 'real',
        thumbnail: 'assets/images/flyers/FLYER_drawTokyo01_20240224_01.png',
        gallery: [
            'assets/images/flyers/FLYER_drawTokyo01_20240224_01.png',
            'assets/images/flyers/FLYER_drawTokyo01_20240224_02.png'
        ],
        venue: 'CIRCUS TOKYO | プログラミング×音楽イベント',
        hashtags: ['function_draw']
    },
    {
        id: 'vjshitai',
        title: 'VJしたいっ',
        date: '2024.1.19',
        year: '2024',
        type: 'vr',
        thumbnail: 'assets/images/flyers/FLYER_VJしたい_20240119.png',
        gallery: [
            'assets/images/flyers/FLYER_VJしたい_20240119.png'
        ],
        venue: '無記入',
        hashtags: ['VJしたいっ']
    },
    {
        id: 'liquid',
        title: 'LIQUID',
        date: '2023.12.17',
        year: '2023',
        type: 'real',
        thumbnail: 'assets/images/flyers/FLYER_LIQUID_20231217_01.png',
        gallery: [
            'assets/images/flyers/FLYER_LIQUID_20231217_01.png'
        ],
        venue: 'fai aoyama | クラブイベント'
    },
    {
        id: 'iput-festa-2023',
        title: 'IPUT FESTA',
        date: '2023.09.30',
        year: '2023',
        type: 'real',
        thumbnail: 'assets/images/flyers/FLYER_IPUTFESTA_20230930.jpg',
        gallery: [
            'assets/images/flyers/FLYER_IPUTFESTA_20230930.jpg'
        ],
        venue: '無記入'
    },
    {
        id: 'saiten-neo-masquerade',
        title: '賽典 in NEO Masquerade',
        date: '2023.08.27',
        year: '2023',
        type: 'real',
        thumbnail: 'assets/images/flyers/FLYER_hinten_20230827.png',
        gallery: [
            'assets/images/flyers/FLYER_hinten_20230827.png'
        ],
        venue: '無記入'
    },
    {
        id: 'breakout-vol3',
        title: 'BreakOut vol.3',
        date: '2023.07.02',
        year: '2023',
        type: 'real',
        thumbnail: 'assets/images/flyers/FLYER_BREAKOUTvol03_20230702.jpg',
        gallery: [
            'assets/images/flyers/FLYER_BREAKOUTvol03_20230702.jpg'
        ],
        venue: '無記入'
    },
    {
        id: 'iput-dunk',
        title: 'IPUT DUNK',
        date: '2023.04.08',
        year: '2023',
        type: 'real',
        thumbnail: 'assets/images/flyers/FLYER_IPUTDUNK_20230408.jpg',
        gallery: [
            'assets/images/flyers/FLYER_IPUTDUNK_20230408.jpg'
        ],
        venue: '無記入'
    },
    {
        id: 'breakout-vol2',
        title: 'BreakOut vol.2 in Bridge Shinjuku',
        date: '2022.12.12',
        year: '2022',
        type: 'real',
        venue: '無記入'
    },
    {
        id: 'lambda',
        title: 'lambda',
        date: '2022.11.04',
        year: '2022',
        type: 'vr',
        thumbnail: 'assets/images/flyers/FLYER_Lambda_20231104.jpeg',
        gallery: [
            'assets/images/flyers/FLYER_Lambda_20231104.jpeg'
        ],
        venue: '無記入',
        hashtags: ['lambda_vr']
    },
    {
        id: 'yuucreate',
        title: 'rooftop in ユークリエイト様屋上にて',
        date: '2022.09.09',
        year: '2022',
        type: 'real',
        venue: '無記入'
    }
];
