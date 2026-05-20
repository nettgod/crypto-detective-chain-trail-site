const TILE = 32;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const sprites = new Image();
sprites.src = "assets/characters.png";
const propsSheet = new Image();
propsSheet.src = "assets/props-modern-houses.png";

const sceneStat = document.getElementById("sceneStat");
const evidenceStat = document.getElementById("evidenceStat");
const sceneCode = document.getElementById("sceneCode");
const sceneTitle = document.getElementById("sceneTitle");
const objectiveText = document.getElementById("objectiveText");
const toast = document.getElementById("toast");
const dialogue = document.getElementById("dialogue");
const dialogueSpeaker = document.getElementById("dialogueSpeaker");
const dialogueText = document.getElementById("dialogueText");
const dialogueNext = document.getElementById("dialogueNext");
const evidenceLog = document.getElementById("evidenceLog");
const stageList = document.getElementById("stageList");
const consoleEl = document.querySelector(".console");
const dossier = document.getElementById("dossier");
const dossierCode = document.getElementById("dossierCode");
const dossierTitle = document.getElementById("dossierTitle");
const evidenceDetail = document.getElementById("evidenceDetail");
const checkpointForm = document.getElementById("checkpointForm");
const checkpointResult = document.getElementById("checkpointResult");
const closeDossier = document.getElementById("closeDossier");
const guideOverlay = document.getElementById("guideOverlay");
const guideKicker = document.getElementById("guideKicker");
const guideTitle = document.getElementById("guideTitle");
const guideGrid = document.getElementById("guideGrid");
const guidePrimary = document.getElementById("guidePrimary");
const guideLanguageToggle = document.getElementById("guideLanguageToggle");
const manualToggle = document.getElementById("manualToggle");
const languageToggle = document.getElementById("languageToggle");
const controlsPanel = document.querySelector(".controls");
const evidenceDetailHeading = document.getElementById("evidenceDetailHeading");
const checkpointHeading = document.getElementById("checkpointHeading");
const checkpointSubmit = document.getElementById("checkpointSubmit");
const logoSubtitle = document.getElementById("logoSubtitle");
const sceneStatLabel = document.getElementById("sceneStatLabel");
const evidenceStatLabel = document.getElementById("evidenceStatLabel");
const objectiveLabel = document.getElementById("objectiveLabel");
const evidenceLogKicker = document.getElementById("evidenceLogKicker");
const touchInteract = document.getElementById("touchInteract");

const charRows = {
  detective: 0,
  chief: 1,
  clerk: 2,
  analyst: 3,
  suspect: 4
};

const dirCols = {
  down: 0,
  left: 1,
  right: 2,
  up: 3
};

const scenes = [
  {
    code: "SCENE 01",
    name: "Chief's Office",
    title: "ห้องผู้กำกับ",
    floor: "#b8ca80",
    wall: "#263445",
    objective: "รับ Case File จากผู้กำกับ",
    npc: { id: "chief", name: "ผู้กำกับ", char: "chief", x: 10, y: 6 },
    player: { x: 10, y: 8 },
    clue: { x: 4, y: 5, label: "Case File", evidence: "Case File: BTC address + Binance withdrawal TXID" },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "มีเส้นทางเงินต้องสงสัยข้ามหลาย chain เริ่มจาก Binance withdrawal TXID",
      "กฎเดียว: ทุกคำตอบต้องมี tx hash, block, value และ reasoning ที่ตรวจซ้ำได้",
      "รับ Case File แล้วไปที่ Binance Counter"
    ],
    completeText: "ได้รับ Case File แล้ว ประตูไป Binance Counter เปิด"
  },
  {
    code: "SCENE 02",
    name: "Binance Counter",
    title: "Binance Counter",
    floor: "#98bbc5",
    wall: "#21465c",
    objective: "ยืนยัน chain, fee และ receiving address",
    npc: { id: "clerk", name: "เจ้าหน้าที่ Binance", char: "clerk", x: 12, y: 5 },
    player: { x: 3, y: 10 },
    clue: { x: 8, y: 7, label: "TX Terminal", evidence: "Stage 1: BNB Smart Chain, 0.00021 BNB fee, to 0x4ce9..." },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "TXID เดียวกันเปิดผิด explorer แล้วจะเหมือนไม่พบธุรกรรม",
      "เลือก chain ให้ถูกก่อน แล้วค่อยบันทึก fee กับ receiving address"
    ],
    completeText: "Stage 1 evidence recorded. BSC Market unlocked"
  },
  {
    code: "SCENE 03",
    name: "BSC Market",
    title: "BSC Market",
    floor: "#d6b874",
    wall: "#7b5c2a",
    objective: "ตาม BNB ไปที่ PancakeSwap และหา EGC",
    npc: { id: "clerk", name: "แม่ค้า DEX", char: "clerk", x: 13, y: 7 },
    player: { x: 3, y: 10 },
    clue: { x: 9, y: 4, label: "Token Stall", evidence: "Stage 2: PancakeSwap, EGC / EverGrow Coin, 258,000,000 EGC" },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "อย่าดูแค่ native BNB balance ให้เปิด BEP-20 Token Txns",
      "token trail จะพาไป EverGrow Coin"
    ],
    completeText: "EGC trail recorded. Ethereum Station unlocked"
  },
  {
    code: "SCENE 04",
    name: "Ethereum Station",
    title: "Ethereum Station",
    floor: "#93a4c8",
    wall: "#324767",
    objective: "แยก approve / swap / bridge",
    npc: { id: "analyst", name: "นายสถานี Ethereum", char: "analyst", x: 11, y: 5 },
    player: { x: 3, y: 10 },
    clue: { x: 7, y: 7, label: "Approval Gate", evidence: "Stage 3: Coinbase ETH, approval gas, WETH approvals, Polygon bridge TX" },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "Approval ไม่ใช่เงินออกจริง แต่เป็น permission",
      "sum เฉพาะ approve transactions แล้วหา bridge deposit ไป Polygon"
    ],
    completeText: "Bridge trail recorded. Polygon Harbor unlocked"
  },
  {
    code: "SCENE 05",
    name: "Polygon Harbor",
    title: "Polygon Harbor",
    floor: "#7fb9a9",
    wall: "#2e685f",
    objective: "หา NFT identity clue",
    npc: { id: "analyst", name: "ภัณฑารักษ์ NFT", char: "analyst", x: 12, y: 6 },
    player: { x: 3, y: 10 },
    clue: { x: 8, y: 5, label: "NFT Frame", evidence: "Stage 4: Anakin Skywalker image, OpenSea username h2dajeffers" },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "NFT image เป็น clue ไม่ใช่ legal identity",
      "ใช้ OpenSea username เป็น pivot ต่อ แต่ห้าม overclaim"
    ],
    completeText: "NFT clue recorded. Victim Apartment unlocked"
  },
  {
    code: "SCENE 06",
    name: "Victim Apartment",
    title: "Victim Apartment",
    floor: "#b89a78",
    wall: "#65462f",
    objective: "reconstruct MetaMask hack timeline",
    npc: { id: "chief", name: "เหยื่อ", char: "chief", x: 10, y: 6 },
    player: { x: 3, y: 10 },
    clue: { x: 6, y: 5, label: "Wallet Logs", evidence: "Stage 5: suspect 0xe89a..., ETH/BEZOGE/MATIC/EDGELON, failed BEZOGE amount" },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "มี ETH ถูกเติมเข้ามานิดหนึ่งก่อน asset ถูกดึงออก",
      "เหมือนคนร้ายเติม gas ให้ wallet เพื่อทำ transaction ต่อ"
    ],
    completeText: "Victim timeline recorded. Suspect Alley unlocked"
  },
  {
    code: "SCENE 07",
    name: "Suspect Alley",
    title: "Suspect Alley",
    floor: "#697989",
    wall: "#303842",
    objective: "ตาม BEZOGE ไป exchange endpoint",
    npc: { id: "suspect", name: "สายข่าว", char: "suspect", x: 13, y: 7 },
    player: { x: 3, y: 10 },
    clue: { x: 9, y: 4, label: "Swap Trace", evidence: "Stage 6: approval block 13633971, swap 24.856694615839375838 ETH, WhiteBIT" },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "ลำดับคือ failed -> approve -> swap -> outbound",
      "ถ้าจับลำดับผิดจะเหมือนเงินหายไปเฉย ๆ"
    ],
    completeText: "Suspect outbound recorded. VASP Records unlocked"
  },
  {
    code: "SCENE 08",
    name: "VASP Records",
    title: "VASP Records Office",
    floor: "#b5c69a",
    wall: "#4b643e",
    objective: "วิเคราะห์ exchange response และ PII guard",
    npc: { id: "analyst", name: "เจ้าหน้าที่ VASP", char: "analyst", x: 11, y: 5 },
    player: { x: 3, y: 10 },
    clue: { x: 7, y: 7, label: "WhiteBIT Report", evidence: "Stage 7: user 10855559, activity window, ETH/USDT totals, top USDT outbounds, KYC caveat" },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "อ่าน Customer Information, KYC Documents และ Order History",
      "KYC เป็น off-chain pivot แต่ต้อง verify authenticity เพิ่ม"
    ],
    completeText: "VASP pivot recorded. War Room unlocked"
  },
  {
    code: "SCENE 09",
    name: "War Room",
    title: "Final Case Report",
    floor: "#dacb93",
    wall: "#806332",
    objective: "ส่ง final report พร้อม evidence map",
    npc: { id: "chief", name: "ผู้กำกับ", char: "chief", x: 11, y: 6 },
    player: { x: 3, y: 10 },
    clue: { x: 8, y: 5, label: "Report Desk", evidence: "Final report: timeline, fund flow, evidence map, attribution caveat, next action" },
    exits: [],
    dialogue: [
      "คำตอบถูกยังไม่พอ รายงานต้องทำให้ reviewer เปิดหลักฐานตรวจซ้ำได้",
      "ถ้าหลักฐานครบ คดีนี้ปิดได้"
    ],
    completeText: "Case cleared. Final report submitted"
  }
];

const caseFiles = [
  {
    title: "Case File: Initial Lead",
    rows: [
      ["Starting BTC address", "bc1q8zu0zj8w8kfd4dp7vdg3ltxcw59qz50e3ux46q"],
      ["Binance withdrawal TXID", "0xf4985003ac11aafe81de2a6f9d5ed5a367f5de349c150c91c4fb8d27b43c862d"],
      ["Instruction", "เริ่มจากข้อมูลตั้งต้นนี้ แล้วใช้ public explorers ตรวจ chain, tx, block, value และ reasoning เอง"],
      ["Evidence rule", "คำตอบที่ไม่มีหลักฐานตรวจซ้ำได้ยังไม่ถือว่าปิด checkpoint"]
    ],
    questions: [
      {
        q: "ผู้กำกับต้องการให้ทุกคำตอบมีอะไรประกอบ?",
        choices: ["คำตอบสั้น ๆ อย่างเดียว", "chain / tx hash / block / value / reasoning", "รูปภาพ NFT เท่านั้น"],
        answer: 1
      },
      {
        q: "clue แรกที่ได้รับจากผู้กำกับคืออะไร?",
        choices: ["Binance withdrawal TXID", "OpenSea username", "KYC document"],
        answer: 0
      }
    ]
  },
  {
    title: "Stage 1 Evidence: Binance Withdrawal",
    rows: [
      ["Given TXID", "0xf4985003ac11aafe81de2a6f9d5ed5a367f5de349c150c91c4fb8d27b43c862d"],
      ["Investigation task", "ลองเปิด TXID นี้บน Etherscan, BscScan และ PolygonScan เพื่อหา chain ที่ถูกต้อง"],
      ["Required evidence", "บันทึก chain, transaction fee, receiving address และ block number จากหน้า explorer"],
      ["Do not guess", "ถ้า explorer บอกว่าไม่พบธุรกรรม ให้ลอง chain อื่นก่อนสรุป"]
    ],
    questions: [
      {
        q: "TXID นี้อยู่บน chain ใด?",
        choices: ["Ethereum", "BNB Smart Chain", "Polygon"],
        answer: 1
      },
      {
        q: "on-chain fee ที่ต้องบันทึกคือเท่าไร?",
        choices: ["0.00021 BNB", "0.11919168 ETH", "258,000,000 EGC"],
        answer: 0
      }
    ]
  },
  {
    title: "Stage 2 Evidence: BSC Swap Trail",
    rows: [
      ["Starting address", "ใช้ receiving address จาก Stage 1 เป็น wallet ตั้งต้น"],
      ["Explorer tab", "เปิด BEP-20 Token Txns และดูธุรกรรมหลังได้รับ BNB"],
      ["Investigation task", "ระบุ DEX/service, token ที่ได้รับ, จำนวน token และ token website จาก token/contract page"],
      ["Common trap", "อย่าดูเฉพาะ BNB balance เพราะ token trail อยู่ใน BEP-20 activity"]
    ],
    questions: [
      {
        q: "DEX/service ที่ใช้ swap คืออะไร?",
        choices: ["Uniswap", "PancakeSwap", "WhiteBIT"],
        answer: 1
      },
      {
        q: "token ที่ได้รับคืออะไร?",
        choices: ["BEZOGE", "EGC / EverGrow Coin", "USDT"],
        answer: 1
      }
    ]
  },
  {
    title: "Stage 3 Evidence: Ethereum Approval Gate",
    rows: [
      ["Starting address", "ใช้ address เดิมจาก Stage 1 แต่ตรวจบน Ethereum"],
      ["Explorer areas", "ดู Transactions, Internal Txns และ Token Approvals/Contract interactions"],
      ["Investigation task", "หา ETH inflow จาก Coinbase, sum gas เฉพาะ approval transactions และหา bridge deposit ไป Polygon"],
      ["Common trap", "approval ไม่ใช่ transfer จริง และไม่ควรรวม gas ของ swap เข้า approval gas total"]
    ],
    questions: [
      {
        q: "Approval transaction ควรถูกตีความอย่างไร?",
        choices: ["เงินออกจริงทันที", "permission ให้ contract ใช้ token", "KYC verification"],
        answer: 1
      },
      {
        q: "bridge TX นี้พา flow ไป chain ใด?",
        choices: ["Polygon", "Bitcoin", "Solana"],
        answer: 0
      }
    ]
  },
  {
    title: "Stage 4 Evidence: NFT Identity Clue",
    rows: [
      ["Starting point", "ใช้ Polygon activity ของ address เดิม"],
      ["Investigation task", "หา NFT transaction, เปิด metadata/image และตรวจ OpenSea profile ของ address"],
      ["Required evidence", "บันทึกภาพ/ชื่อ NFT clue และ username/profile ที่ผูกกับ wallet"],
      ["Caveat", "username เป็น OSINT pivot ไม่ใช่ legal attribution"]
    ],
    questions: [
      {
        q: "NFT image clue ที่พบคืออะไร?",
        choices: ["Anakin Skywalker", "Darth Vader", "Yoda"],
        answer: 0
      },
      {
        q: "OpenSea username ควรใช้เป็นหลักฐานแบบใด?",
        choices: ["legal attribution ทันที", "OSINT clue / pivot", "แทน tx hash ได้"],
        answer: 1
      }
    ]
  },
  {
    title: "Stage 5 Evidence: Victim Timeline",
    rows: [
      ["Victim wallet", "0x95eeb3bae8d79e078ce23ac1c5580c4cec11b227"],
      ["Incident date", "17 Nov 2021"],
      ["Investigation task", "แยกธุรกรรมก่อน/หลัง incident date แล้วหา address ที่เกี่ยวข้องกับ gas funding และ asset movement"],
      ["Required evidence", "ระบุ suspect address, asset ที่ออกจาก victim บน Ethereum/Polygon และ failed BEZOGE amount"],
      ["Common trap", "อย่าเอาธุรกรรมก่อน incident date มาปนกับเหตุการณ์หลัก"]
    ],
    questions: [
      {
        q: "เหตุผลที่ suspect เติม ETH เข้า victim wallet คืออะไร?",
        choices: ["เพิ่มราคา token", "ใช้เป็น gas fees", "สร้าง NFT ใหม่"],
        answer: 1
      },
      {
        q: "asset บน Ethereum ที่เกี่ยวข้องคือข้อใด?",
        choices: ["ETH และ BEZOGE", "MATIC และ EDGELON", "BTC และ USDC"],
        answer: 0
      }
    ]
  },
  {
    title: "Stage 6 Evidence: BEZOGE to Exchange",
    rows: [
      ["Starting point", "ใช้ suspect wallet จาก Stage 5"],
      ["Investigation task", "ตามลำดับ failed transaction → approval → swap → outbound route"],
      ["Required evidence", "หา BEZOGE approval block, ETH ที่ได้จาก swap และ exchange destination"],
      ["Common trap", "อย่าเดาปลายทาง exchange จากชื่อ wallet ต้องมี routing/deposit evidence"]
    ],
    questions: [
      {
        q: "ลำดับที่ถูกต้องในการตาม BEZOGE คือข้อใด?",
        choices: ["swap → failed → approve", "failed → approve → swap → outbound", "KYC → NFT → bridge"],
        answer: 1
      },
      {
        q: "exchange destination คือที่ใด?",
        choices: ["Coinbase", "WhiteBIT", "OpenSea"],
        answer: 1
      }
    ]
  },
  {
    title: "Stage 7 Evidence: VASP Response",
    rows: [
      ["Source", "WhiteBIT VASP response workbook ใช้ในห้องเรียนเท่านั้น"],
      ["Sheets to inspect", "Customer Information, KYC Documents, Order History"],
      ["Investigation task", "หา account identity, activity window, asset totals และ USDT outbound candidates จาก workbook"],
      ["PII guard", "ห้ามเผยแพร่ raw XLSX หรือ PII ใน public build"],
      ["Caveat", "KYC เป็น off-chain pivot แต่ต้อง verify authenticity ก่อน attribution"]
    ],
    questions: [
      {
        q: "VASP response ช่วยเพิ่มหลักฐานด้านใด?",
        choices: ["off-chain account / KYC / order history pivot", "NFT image quality", "block mining difficulty"],
        answer: 0
      },
      {
        q: "ทำไมยังไม่ควรสรุปว่า KYC name คือคนร้ายทันที?",
        choices: ["KYC อาจเป็น stolen identity หรือ mule account", "เพราะไม่มี chain", "เพราะ USDT ไม่ใช่ token"],
        answer: 0
      }
    ]
  },
  {
    title: "Final Evidence: Case Report",
    rows: [
      ["Required report", "สรุป timeline, fund flow, evidence map, attribution caveat และ next action"],
      ["Review rule", "รายงานต้องทำให้ reviewer เปิดหลักฐานตรวจซ้ำได้ทุกจุด"],
      ["Submission standard", "ห้ามส่งเฉพาะคำตอบสุดท้าย ต้องมี reasoning และ evidence reference"]
    ],
    questions: [
      {
        q: "Final report ที่ดีต้องทำให้ reviewer ทำอะไรได้?",
        choices: ["เปิดหลักฐานตรวจซ้ำได้", "เห็นเฉพาะคำตอบสุดท้าย", "ไม่ต้องดู tx hash"],
        answer: 0
      },
      {
        q: "สิ่งใดต้องใส่ในรายงานเพื่อกัน overclaim?",
        choices: ["attribution caveat", "สีของ NFT", "จำนวน slide"],
        answer: 0
      }
    ]
  }
];

const googleFormScenes = [
  {
    code: "SCENE 01",
    name: "Binance Lead",
    title: "Binance Lead",
    floor: "#b8ca80",
    wall: "#263445",
    objective: "รับข้อมูลตั้งต้นจาก Binance แล้วพิสูจน์ chain/fee เอง",
    npc: { id: "chief", name: "ผู้กำกับ", char: "chief", x: 10, y: 6 },
    player: { x: 10, y: 8 },
    clue: { x: 4, y: 5, label: "Case File", evidence: "Google Form Q5-Q6: Binance withdrawal TXID" },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "เริ่มจาก BTC address และข้อมูล withdrawal ที่ Binance ส่งมา",
      "อย่าใช้ fee จาก exchange แทน network fee ต้องเปิด explorer ให้ถูก chain",
      "เก็บ Case File แล้วตอบ checkpoint Q5-Q6 ก่อนออกจากห้อง"
    ],
    completeText: "ผ่าน Q5-Q6 แล้ว ประตูไป BSC Swap เปิด"
  },
  {
    code: "SCENE 02",
    name: "BSC Swap",
    title: "BSC Swap Market",
    floor: "#98bbc5",
    wall: "#21465c",
    objective: "ตาม BNB หลังรับเข้า wallet แล้วหา DEX/token/website",
    npc: { id: "clerk", name: "เจ้าหน้าที่ Binance", char: "clerk", x: 12, y: 5 },
    player: { x: 3, y: 10 },
    clue: { x: 8, y: 7, label: "BEP-20 Log", evidence: "Google Form Q7-Q10: BSC swap trail" },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "หลังรับ BNB แล้วอย่าดูเฉพาะ native balance ให้เปิด BEP-20 Token Txns",
      "คำตอบรอบนี้ต้องมาจาก transaction/event log และ token page"
    ],
    completeText: "ผ่าน Q7-Q10 แล้ว ประตูไป Ethereum Station เปิด"
  },
  {
    code: "SCENE 03",
    name: "Ethereum Station",
    title: "Ethereum Station",
    floor: "#d6b874",
    wall: "#7b5c2a",
    objective: "หา ETH จาก Coinbase, approval gas, WETH approvals และ bridge TX",
    npc: { id: "analyst", name: "นักวิเคราะห์ Ethereum", char: "analyst", x: 13, y: 7 },
    player: { x: 3, y: 10 },
    clue: { x: 9, y: 4, label: "Approval Gate", evidence: "Google Form Q11-Q15: Ethereum approvals and bridge" },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "Address เดิมบน BSC อาจมีประวัติบน Ethereum ด้วย",
      "แยกให้ชัดว่าอะไรคือ transfer, swap, approval และ bridge deposit"
    ],
    completeText: "ผ่าน Q11-Q15 แล้ว ประตูไป Polygon Harbor เปิด"
  },
  {
    code: "SCENE 04",
    name: "Polygon Harbor",
    title: "Polygon Harbor",
    floor: "#93a4c8",
    wall: "#324767",
    objective: "ตาม NFT clue และ OpenSea username",
    npc: { id: "analyst", name: "ภัณฑารักษ์ NFT", char: "analyst", x: 11, y: 5 },
    player: { x: 3, y: 10 },
    clue: { x: 7, y: 7, label: "NFT Frame", evidence: "Google Form Q16-Q17: NFT and username" },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "NFT image เป็น clue สำหรับ OSINT ไม่ใช่หลักฐานระบุตัวบุคคลสุดท้าย",
      "เก็บชื่อ username ไว้เป็น pivot แล้วใส่ caveat ในรายงานเสมอ"
    ],
    completeText: "ผ่าน Q16-Q17 แล้ว ประตูไป Victim Apartment เปิด"
  },
  {
    code: "SCENE 05",
    name: "Victim Apartment",
    title: "Victim Apartment",
    floor: "#7fb9a9",
    wall: "#2e685f",
    objective: "reconstruct MetaMask hack timeline ของ victim wallet",
    npc: { id: "chief", name: "เหยื่อ", char: "chief", x: 12, y: 6 },
    player: { x: 3, y: 10 },
    clue: { x: 8, y: 5, label: "Wallet Logs", evidence: "Google Form Q18-Q23: suspect, stolen assets, gas funding" },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "ตัดธุรกรรมก่อน incident date ออกก่อน แล้วค่อยดู movement หลังเกิดเหตุ",
      "เหตุผลของ gas funding สำคัญ เพราะช่วยโยง suspect กับ victim wallet"
    ],
    completeText: "ผ่าน Q18-Q23 แล้ว ประตูไป Suspect Alley เปิด"
  },
  {
    code: "SCENE 06",
    name: "Suspect Alley",
    title: "Suspect Alley",
    floor: "#b89a78",
    wall: "#65462f",
    objective: "ตาม BEZOGE จาก failed tx ไป approve/swap/exchange endpoint",
    npc: { id: "suspect", name: "สายข่าว", char: "suspect", x: 10, y: 6 },
    player: { x: 3, y: 10 },
    clue: { x: 6, y: 5, label: "Swap Trace", evidence: "Google Form Q24-Q26: BEZOGE to WhiteBIT" },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "ลำดับหลักคือ failed transaction -> approve -> swap -> exchange endpoint",
      "อย่าเดาปลายทาง exchange จากชื่อ wallet ต้องมี routing evidence"
    ],
    completeText: "ผ่าน Q24-Q26 แล้ว ประตูไป VASP Request เปิด"
  },
  {
    code: "SCENE 07",
    name: "VASP Request",
    title: "VASP Request Desk",
    floor: "#697989",
    wall: "#303842",
    objective: "ใช้ผลตอบกลับจาก exchange เพื่อกรอก TX ID/date/from/to/value",
    npc: { id: "analyst", name: "เจ้าหน้าที่ VASP", char: "analyst", x: 13, y: 7 },
    player: { x: 3, y: 10 },
    clue: { x: 9, y: 4, label: "Request Packet", evidence: "Google Form Q27-Q32: exchange response transaction detail" },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "ในเกมนี้ถือว่าส่ง request form และได้รับ workbook กลับมาแล้ว",
      "เปิด Order History แล้วหา outbound candidate ที่ใช้ตอบ TX ID, Date, From, To และ Value"
    ],
    completeText: "ผ่าน Q27-Q32 แล้ว ประตูไป WhiteBIT Records เปิด"
  },
  {
    code: "SCENE 08",
    name: "WhiteBIT Records",
    title: "WhiteBIT Records",
    floor: "#b5c69a",
    wall: "#4b643e",
    objective: "วิเคราะห์ conversion ใน exchange report",
    npc: { id: "analyst", name: "นักวิเคราะห์ Exchange", char: "analyst", x: 11, y: 5 },
    player: { x: 3, y: 10 },
    clue: { x: 7, y: 7, label: "Order History", evidence: "Google Form Q33: converted asset and amount" },
    exits: [{ x: 18, y: 8 }],
    dialogue: [
      "คำตอบจาก VASP เป็น off-chain pivot ต้องระวัง PII และ attribution caveat",
      "ดู asset/direction ใน Order History แล้วเลือก conversion ที่ตรงกับโจทย์"
    ],
    completeText: "ผ่าน Q33 แล้ว ประตูไป War Room เปิด"
  },
  {
    code: "SCENE 09",
    name: "War Room",
    title: "Final Case Report",
    floor: "#dacb93",
    wall: "#806332",
    objective: "ยืนยันส่งคำตอบพร้อม caveat ว่า KYC เป็นเพียง pivot",
    npc: { id: "chief", name: "ผู้กำกับ", char: "chief", x: 11, y: 6 },
    player: { x: 3, y: 10 },
    clue: { x: 8, y: 5, label: "Submit Desk", evidence: "Google Form Q34: final confirmation" },
    exits: [],
    dialogue: [
      "คำตอบถูกอย่างเดียวยังไม่พอ รายงานต้องมี evidence map และข้อจำกัดของ attribution",
      "ถ้าหลักฐานครบ ให้ยืนยันส่ง final answer"
    ],
    completeText: "Case cleared. Final answer confirmed"
  }
];

const googleFormCaseFiles = [
  {
    title: "Google Form Q5-Q6: Binance Withdrawal",
    rows: [
      ["Starting BTC address", "bc1q8zu0zj8w8kfd4dp7vdg3ltxcw59qz50e3ux46q"],
      ["Binance trade", "2021-12-01 13:32:31 | BNBBTC | sold 0.00666383 BTC | bought 0.59617718 BNB"],
      ["Binance withdrawal", "2021-12-01 13:54:00 | amount 0.59567718 BNB | exchange fee 0.0005"],
      ["Address", "0x4ce9a5c772e6dd1a16363895a37b76a39fe7b15c"],
      ["TXID", "0xf4985003ac11aafe81de2a6f9d5ed5a367f5de349c150c91c4fb8d27b43c862d"],
      ["Task", "เปิด TXID บน explorer หลาย chain เพื่อหา chain และ network fee ที่ถูกต้อง"]
    ],
    questions: [
      {
        q: "Q5 ผู้ต้องสงสัยได้ทำการแปลง BTC เป็น BNB และย้ายไปที่ 0x4ce9...b15c การทำธุรกรรมนี้อยู่บนบล็อกเชนใด",
        choices: ["Ethereum", "Polygon (Matic)", "Binance Smart Chain"],
        answer: 2
      },
      {
        q: "Q6 ค่าธรรมเนียมในการทำธุรกรรมคือเท่าไหร่",
        choices: ["0.0005 ETH", "0.00021 BNB", "0.00021 ETH", "0.00005 BNB"],
        answer: 1
      }
    ]
  },
  {
    title: "Google Form Q7-Q10: BSC Swap Trail",
    rows: [
      ["Starting point", "ใช้ address 0x4ce9...b15c จาก Q5-Q6 เป็นจุดเริ่มต้น"],
      ["Explorer area", "ดู Normal Txns และ BEP-20 Token Txns หลังได้รับ BNB"],
      ["Task", "ระบุว่าเหรียญถูกนำไปทำอะไร, แปลงเป็น token ใด, ได้รับเท่าใด และ token website คืออะไร"],
      ["Evidence standard", "อ้างอิง tx/token page ได้ ไม่ใช่เดาจากชื่อ token"]
    ],
    questions: [
      {
        q: "Q7 หลังจากนั้น เหรียญดังกล่าวถูกนำไปทำอะไรต่อ",
        choices: ["ถูกโอนไปยัง Address อื่น", "ถูก Stake ไปที่ DeFI", "ถูก Swap โดยใช้ Pancake swap", "ถูก Swap โดยใช้ Sushi swap"],
        answer: 2
      },
      {
        q: "Q8 ได้แลกเปลี่ยน BNB เป็นโทเค็น BEP-20 ใดต่อ",
        choices: ["WBNB", "EGC", "BUSD", "PowNFT"],
        answer: 1
      },
      {
        q: "Q9 Address 0x4ce9...b15c ได้รับโทเค็นข้างต้นเป็นจำนวนเท่าใด",
        choices: ["258,000,000 EGC", "1.102754464971347428 BUSD", "0.400746867871036554 WBNB", "42,000,000 EGC", "96,816.55 PowNFT"],
        answer: 0
      },
      {
        q: "Q10 จากการหาข้อมูลโทเค็น BEP-20 เว็บไซต์ปัจจุบันสำหรับ Address นี้คืออะไร",
        choices: ["evergrowegc.com", "evergrow.com", "egc.com"],
        answer: 0
      }
    ]
  },
  {
    title: "Google Form Q11-Q15: Ethereum Approvals And Bridge",
    rows: [
      ["Starting point", "ค้นหา address 0x4ce9...b15c บน Ethereum blockchain"],
      ["Task 1", "หา ETH ที่รับโดยตรงจาก Coinbase"],
      ["Task 2", "รวม ETH ที่ใช้เป็น fee เฉพาะธุรกรรม approval"],
      ["Task 3", "ระบุ service ที่ได้รับอนุมัติให้โอน WETH และหา bridge deposit ไป Polygon"],
      ["Trap", "approval ไม่ใช่การโอนเงินออกจริง และไม่ควรรวม gas ของ swap เข้า approval total"]
    ],
    questions: [
      {
        q: "Q11 0x4CE9... ได้รับ ETH โดยตรงจาก Coinbase เป็นจำนวนเท่าใด",
        choices: ["6.32469104", "0.11919168", "0.183072622", "0.16603958"],
        answer: 1
      },
      {
        q: "Q12 โดยรวมแล้ว ETH ที่ใช้ไปสำหรับค่าธรรมเนียมของการทำธุรกรรมที่ \"อนุมัติ\" เป็นจำนวนเท่าใด",
        choices: ["0.14129128233", "0.014129128233", "0.027303762233", "0.27303762233"],
        answer: 2
      },
      {
        type: "multi",
        q: "Q13 บริการใด (2 รายการ) ที่ได้รับอนุมัติให้โอน WETH",
        choices: ["Pancakeswap", "Uniswap", "1nch", "Wyvern Token Transfer"],
        answers: [1, 3]
      },
      {
        q: "Q14 Address 0x4ce9...b15c ได้รับ ETH เท่าใดโดยการแลกเปลี่ยน Dai เป็น ETH",
        choices: ["516.484653463558376708", "0.112032975026878328", "0.012918659001355983", "0.11"],
        answer: 1
      },
      {
        q: "Q15 Txn Hash ใดที่เป็นการนำ ETH ไปฝากไว้บน Polygon (Matic)",
        choices: [
          "0xa7f73d14a1a8cbfb3b3e002039bfc73bf7cc38bce8e322ec1d79e878d5cec8d9",
          "0xA0c68C638235ee32657e8f720a23ceC1bFc77C77",
          "0x4ce9a5c772e6dd1a16363895a37b76a39fe7b15c",
          "0x7bae02afe2a67112c52cd1270f3c5e7387c2bba6ce6b4e7b658bb98167171838"
        ],
        answer: 3
      }
    ]
  },
  {
    title: "Google Form Q16-Q17: NFT Identity Clue",
    rows: [
      ["Starting point", "ตาม activity ของ address 0x4ce9...b15c บน Polygon ต่อจาก bridge"],
      ["Task", "เปิด NFT transaction/metadata แล้วตรวจ OpenSea profile ของ address"],
      ["Caveat", "NFT และ username เป็น OSINT pivot ไม่ใช่ legal attribution"]
    ],
    questions: [
      {
        q: "Q16 หลังจากที่ได้ตามบน chain ไปเรื่อย ๆ แล้ว Address 0x4ce9...b15c ได้ซื้อ NFT ใด",
        choices: ["A picture of Obi-Wan", "A picture of Nick Furneaux", "A picture of Anakin Skywalker", "ไม่ได้ซื้อ NFT"],
        answer: 2
      },
      {
        q: "Q17 ชื่อผู้ใช้ Twitter ของเจ้าของ Address 0x4ce9...b15c คืออะไร",
        choices: ["@NickFX", "@elonmusk", "@h2dajeffers", "Impossible to say"],
        answer: 2
      }
    ]
  },
  {
    title: "Google Form Q18-Q23: MetaMask Hack Reconstruction",
    rows: [
      ["Victim wallet", "0x95eeb3bae8d79e078ce23ac1c5580c4cec11b227"],
      ["Incident date", "17 พ.ย. 2021"],
      ["Chains", "Ethereum และ Polygon (Matic)"],
      ["Scope", "ธุรกรรมก่อนวันเกิดเหตุไม่เกี่ยวข้องกับโจทย์"],
      ["Task", "หา suspect address, เหรียญที่ถูกขโมย, เหตุผลของ gas funding และ amount/block ที่ถามในฟอร์ม"]
    ],
    questions: [
      {
        q: "Q18 Address ใดน่าจะเป็นของผู้ต้องสงสัยมากที่สุด",
        choices: [
          "0x3b794929566e3ba0f25e4263e1987828b5c87161",
          "0xdc349913d53b446485e98b76800b6254f43df695",
          "0xe89aa17517cc1e36b4eb0d0c69dafc455b77b2d5",
          "0x95eeb3bae8d79e078ce23ac1c5580c4cec11b227",
          "0xe89aa913d53b446485e98b76800b6254f43df695",
          "0xdc349913d53b4ba0f25e4263e1987828b5c87161"
        ],
        answer: 2
      },
      {
        type: "multi",
        q: "Q19 เหรียญอะไรที่ถูกขโมยจาก Address 0x95EeB บน Ethereum blockchain (เลือก 2 รายการ)",
        choices: ["ETH", "MATIC", "BEZOGE", "WETH", "EDGELON"],
        answers: [0, 2]
      },
      {
        type: "multi",
        q: "Q20 เหรียญใดบ้างที่ถูกนำออกจาก 0x95EeB ในวันที่เกิดเหตุบน Polygon (Matic) blockchain (เลือก 2 รายการ)",
        choices: ["ETH", "MATIC", "BEZOGE", "WETH", "EDGELON"],
        answers: [1, 4]
      },
      {
        q: "Q21 เหตุใดผู้ต้องสงสัยจึงฝาก ETH ไว้ใน Address 0x95EeB",
        choices: ["เพื่อชดเชยเหรียญที่เหยื่อสูญเสีย หรือเป็นค่าทำขวัญที่โดนขโมย", "เพื่อใช้เป็นค่า Gas fees", "ไม่มีเหตุผล"],
        answer: 1
      },
      {
        q: "Q22 จำนวน BEZOGE ในตอนแรกที่ผู้ต้องสงสัยพยายามจะย้ายแต่ล้มเหลวนั้นเป็นเท่าใด",
        choices: ["33,535,695,600,033.858473549", "32,864,981,688,033.181304079", "3353.5695600033858473549", "3286.4981688033181304079"],
        answer: 0
      },
      {
        q: "Q23 มี ETH จำนวนเท่าใดใน 0x95EeB ที่ block หมายเลข 13633926",
        choices: ["0.000880784131857", "0.0140476013238", "0.021605567809238915", "0.003041678389218"],
        answer: 2
      }
    ]
  },
  {
    title: "Google Form Q24-Q26: BEZOGE To Exchange",
    rows: [
      ["Starting point", "ใช้ suspect address จาก Q18"],
      ["Timeline", "failed BEZOGE tx -> approve -> swap -> exchange endpoint"],
      ["Task", "หา ETH ที่ได้จาก BEZOGE, approval block และ exchange ปลายทาง"]
    ],
    questions: [
      {
        q: "Q24 ผู้ต้องสงสัยได้รับ ETH เท่าไหร่จากการขโมย BEZOGE ไป",
        choices: ["24.856694615839375838", "35.63", "0.0966778125177607", "31,563,949,478,835.785511533"],
        answer: 0
      },
      {
        q: "Q25 0xe89aA ได้ทำการ Approve เพื่อ swap เหรียญ BEZOGE บน Uniswap ใน block หมายเลขใด",
        choices: ["13633971", "13634987", "13634997", "13635007", "13635357"],
        answer: 0
      },
      {
        q: "Q26 จงไล่ Transaction เพื่อหาว่าสุดท้ายแล้ว ETH ทั้งหมดถูกโอนไปที่ Exchange ใด",
        choices: ["Uniswap", "WhiteBIT", "0xb0697bE429224a914e9452c68D4D06c6B28389bb", "Binance"],
        answer: 1
      }
    ]
  },
  {
    title: "Google Form Q27-Q32: Exchange Response Detail",
    rows: [
      ["Q27 request", "ในเกมนี้ถือว่าส่งหนังสือขอข้อมูลและได้รับ report_04072023_RTP0026.277.xlsx กลับมาแล้ว"],
      ["Workbook", "ใช้ sheet Order History เพื่อตอบ TX ID, Date (UTC), From, To และ Value"],
      ["Target transaction", "ให้ตาม outbound candidate ที่เด่นที่สุดจาก exchange report"],
      ["PII guard", "ห้ามเผยแพร่ raw workbook หรือข้อมูล KYC ใน public build"]
    ],
    questions: [
      {
        q: "Q27 เงื่อนไขของไฟล์ที่ส่งเพื่อทำโจทย์ต่อไปคืออะไร",
        choices: ["ส่งเป็นไฟล์ PDF เท่านั้น", "ส่งเป็นไฟล์ภาพอะไรก็ได้", "ไม่ต้องส่งหนังสือขอข้อมูล"],
        answer: 0
      },
      {
        type: "text",
        q: "Q28 TX ID",
        placeholder: "0x...",
        answers: ["0x2b6856abb407033f30a9f182afb2d8c155463980a6ba8654e53b6bb9422b815e"]
      },
      {
        type: "text",
        q: "Q29 Date (UTC)",
        placeholder: "dd/mm/yyyy",
        answers: ["18/11/2021", "2021-11-18", "18-11-2021"]
      },
      {
        type: "text",
        q: "Q30 From",
        placeholder: "exchange/account/source",
        answers: ["WhiteBIT", "WhiteBIT user 10855559", "10855559", "Exchange account 10855559"]
      },
      {
        type: "text",
        q: "Q31 To",
        placeholder: "0x...",
        answers: ["0xa26e4573ef86157870f9500f41ca50a3e19c7b34"]
      },
      {
        type: "text",
        q: "Q32 Value",
        placeholder: "amount + asset",
        answers: ["22,445.48 USDT", "22445.48 USDT", "22445.48"]
      }
    ]
  },
  {
    title: "Google Form Q33: Exchange Conversion",
    rows: [
      ["Source", "report_04072023_RTP0026.277.xlsx"],
      ["Sheet", "Order History"],
      ["Task", "วิเคราะห์ข้อมูลที่ Exchange ให้มา แล้วหา conversion ที่ตรงกับคำถาม"],
      ["Caveat", "คำตอบนี้เป็น off-chain exchange record ต้องเก็บ PII ให้ปลอดภัย"]
    ],
    questions: [
      {
        q: "Q33 เมื่อวิเคราะห์ข้อมูลที่ Exchange ได้ให้มา ผู้ต้องสงสัยได้แปลงเหรียญเป็นเหรียญอะไร จำนวนเท่าใด",
        choices: ["2255 USDT", "555,042.008 HZM", "21891 DAI", "1063 MTO", "5,042.008 HZM", "27,401 DAI", "1963 MTO", "6855 USDT"],
        answer: 1
      }
    ]
  },
  {
    title: "Google Form Q34: Final Confirmation",
    rows: [
      ["Final action", "ยืนยันส่งคำตอบหลังตรวจ evidence map ครบ"],
      ["Report standard", "ต้องมี timeline, fund flow, evidence references และ attribution caveat"],
      ["Caveat", "KYC/VASP เป็น off-chain pivot ต้อง verify authenticity เพิ่มก่อนสรุปบุคคล"]
    ],
    questions: [
      {
        q: "Q34 ยืนยันส่งคำตอบ",
        choices: ["ยืนยัน"],
        answer: 0
      }
    ]
  }
];

scenes.splice(0, scenes.length, ...googleFormScenes);
caseFiles.splice(0, caseFiles.length, ...googleFormCaseFiles);

const defaultRoom = { x: 2, y: 2, w: 16, h: 11 };
const roomSpawns = {
  default: { x: 10, y: 9, dir: "up" },
  fromPrev: { x: 3, y: 7, dir: "right" },
  fromNext: { x: 16, y: 7, dir: "left" }
};

const assetPropSprites = {
  assetBookshelf: { sx: 32, sy: 0, sw: 64, sh: 32 },
  assetWideShelf: { sx: 32, sy: 64, sw: 96, sh: 48, dy: -8 },
  assetCabinet: { sx: 320, sy: 32, sw: 64, sh: 48, dy: -6 },
  assetComputer: { sx: 320, sy: 80, sw: 32, sh: 64, dy: -16 },
  assetPlantA: { sx: 384, sy: 0, sw: 32, sh: 48, dy: -16 },
  assetPlantB: { sx: 416, sy: 0, sw: 24, sh: 48, dx: 4, dy: -16 },
  assetWhiteTable: { sx: 288, sy: 80, sw: 64, sh: 32 },
  assetRedSofa: { sx: 288, sy: 112, sw: 64, sh: 32 },
  assetTallLocker: { sx: 352, sy: 80, sw: 32, sh: 64, dy: -16 },
  assetWallFrame: { sx: 288, sy: 0, sw: 32, sh: 32 },
  assetPhotoFrame: { sx: 320, sy: 0, sw: 32, sh: 32 },
  assetModernBed: { sx: 96, sy: 112, sw: 96, sh: 48 },
  assetStairs: { sx: 128, sy: 160, sw: 64, sh: 96, dy: -24 },
  assetTrashBin: { sx: 96, sy: 160, sw: 32, sh: 32 },
  assetKitchenBlock: { sx: 288, sy: 32, sw: 64, sh: 48, dy: -6 },
  assetLongCounter: { sx: 192, sy: 128, sw: 96, sh: 32 },
  assetSmallCabinet: { sx: 160, sy: 192, sw: 64, sh: 64, dy: -16 },
  assetWoodCabinet: { sx: 224, sy: 32, sw: 32, sh: 48, dy: -8 }
};

const sceneText = [
  {
    name: "Lead Office",
    title: "Binance Lead",
    objective: "Read the initial lead file, then identify the chain and on-chain fee.",
    dialogue: ["The chief has handed you the first lead.", "Find your own evidence before answering the checkpoint."],
    completeText: "Initial lead cleared."
  },
  {
    name: "Market Room",
    title: "Market Room",
    objective: "Follow the funds after the Binance withdrawal and identify what happened next.",
    dialogue: ["Continue from the destination wallet in the previous file.", "Verify the trail yourself before answering."],
    completeText: "BSC trail cleared."
  },
  {
    name: "Chain Station",
    title: "Ethereum Station",
    objective: "Check the same wallet on Ethereum and separate transfers, approvals, swaps, and bridges.",
    dialogue: ["Use the same wallet, but investigate it on Ethereum.", "Keep transfers, approvals, swaps, and bridge deposits separate."],
    completeText: "Ethereum file cleared."
  },
  {
    name: "Harbor Gallery",
    title: "Polygon Harbor",
    objective: "Follow the Polygon trail and extract the NFT/profile clue.",
    dialogue: ["The NFT and profile are investigation leads.", "Do not turn a profile clue into a final attribution claim."],
    completeText: "NFT/profile file cleared."
  },
  {
    name: "Victim Room",
    title: "Victim Apartment",
    objective: "Reconstruct the MetaMask hack from the victim wallet and incident date.",
    dialogue: ["The case file contains the starting facts.", "Filter out transactions outside the incident scope first."],
    completeText: "Victim file cleared."
  },
  {
    name: "Suspect Route",
    title: "Suspect Alley",
    objective: "Trace the stolen asset route from the suspect wallet to the endpoint.",
    dialogue: ["There is no answer key in this room.", "Build the route from the relevant transactions."],
    completeText: "Suspect route cleared."
  },
  {
    name: "VASP Desk",
    title: "VASP Request Desk",
    objective: "Use the exchange response to fill in TX ID, Date, From, To, and Value.",
    dialogue: ["Assume the exchange has returned the requested records.", "Read the record carefully before filling each field."],
    completeText: "Exchange request file cleared."
  },
  {
    name: "Exchange Records",
    title: "Exchange Records",
    objective: "Analyze the exchange records and identify the converted asset and amount.",
    dialogue: ["This room depends on the exchange records.", "Choose the answer only after checking the data."],
    completeText: "Exchange record cleared."
  },
  {
    name: "War Room",
    title: "Final Case Report",
    objective: "Review the evidence map and submit the final answer.",
    dialogue: ["Review every checkpoint before confirming.", "Once confirmed, the case is closed."],
    completeText: "Case cleared. Final answer submitted."
  }
];

const formOnlyRows = [
  [
    ["Initial lead", "Bitcoin address bc1q8zu0zj8w8kfd4dp7vdg3ltxcw59qz50e3ux46q sent BTC to Binance."],
    ["Binance trade record", "2021-12-01 13:32:31 | Pair BNBBTC | Sold 0.00666383 BTC | Bought 0.59617718 BNB | Rate 1 BTC = 89.46464 BNB"],
    ["Binance withdrawal record", "2021-12-01 13:54:00 | Asset BNB | Amount 0.59567718 | Binance-reported fee 0.0005"],
    ["Destination wallet", "0x4ce9a5c772e6dd1a16363895a37b76a39fe7b15c"],
    ["Transaction ID to inspect", "0xf4985003ac11aafe81de2a6f9d5ed5a367f5de349c150c91c4fb8d27b43c862d"]
  ],
  [
    ["Starting point", "Continue from destination wallet 0x4ce9...b15c."],
    ["Next action to identify", "Determine what happened to the BNB after it arrived."],
    ["Token to identify", "Find which BEP-20 token the BNB was exchanged into."],
    ["Amount to verify", "Determine how much of that token wallet 0x4ce9...b15c received."],
    ["Supporting detail", "Check the token page for its current website."]
  ],
  [
    ["Starting point", "Check wallet 0x4ce9...b15c on Ethereum."],
    ["Inbound ETH to find", "Find the amount received directly from Coinbase."],
    ["Fee total to calculate", "Sum the ETH spent as fees for approval transactions."],
    ["Approvals to identify", "Identify the two services approved to transfer WETH."],
    ["Bridge trail to verify", "Find the ETH received from swapping Dai to ETH and the transaction hash for the Polygon deposit."]
  ],
  [
    ["Starting point", "Continue following wallet 0x4ce9...b15c on Polygon."],
    ["NFT clue to identify", "Find which NFT the wallet bought later in the trail."],
    ["OSINT lead", "Find the Twitter/profile username connected to the wallet owner."]
  ],
  [
    ["New case", "A MetaMask wallet was hacked. Investigate suspicious transactions and trace the stolen funds."],
    ["Victim wallet", "0x95eeb3bae8d79e078ce23ac1c5580c4cec11b227"],
    ["Incident date", "17 Nov 2021"],
    ["Relevant chains", "Ethereum and Polygon (Matic)"],
    ["Investigation scope", "Transactions before the incident date are out of scope."],
    ["Findings to produce", "Suspect wallet, stolen assets, gas-funding reason, and the requested values."]
  ],
  [
    ["Starting point", "Use the suspect wallet identified in the previous file."],
    ["ETH amount to find", "Determine how much ETH the suspect received from BEZOGE."],
    ["Approval block to identify", "Find the block where BEZOGE was approved for swapping on Uniswap."],
    ["Endpoint to conclude", "Identify the exchange where the ETH was ultimately sent."]
  ],
  [
    ["Request task", "Prepare a data request for the identified exchange, then use the returned file for the next step."],
    ["Template file", "Request_form.docx"],
    ["Submission rule", "Submit as PDF only."],
    ["Exchange response file", "report_04072023_RTP0026.277.xlsx"],
    ["Fields to fill", "TX ID, Date (UTC), From, To, Value"]
  ],
  [
    ["Source file", "report_04072023_RTP0026.277.xlsx"],
    ["Finding to report", "After analyzing the exchange data, identify which asset the suspect converted into and the amount."]
  ],
  [
    ["Final step", "Confirm the answer submission."],
    ["Before confirming", "Make sure every checkpoint answer is backed by evidence that can be checked again."]
  ]
];

const formOnlyTitles = [
  "Initial Lead File",
  "BSC Trail File",
  "Ethereum Activity File",
  "NFT/Profile Lead File",
  "Victim Wallet File",
  "Suspect Route File",
  "Exchange Request File",
  "Exchange Records File",
  "Final Submission File"
];

const playerQuestionText = [
  [
    "The suspect converted BTC to BNB and moved it to wallet 0x4ce9...b15c. Which blockchain is this transaction on?",
    "What is the on-chain transaction fee?"
  ],
  [
    "After the BNB arrived, what was it used for next?",
    "Which BEP-20 token was the BNB exchanged into?",
    "How many of that token did wallet 0x4ce9...b15c receive?",
    "What is the current website for this token?"
  ],
  [
    "How much ETH did wallet 0x4ce9...b15c receive directly from Coinbase?",
    "What is the total ETH spent on fees for approval transactions?",
    "Which two services were approved to transfer WETH?",
    "How much ETH did wallet 0x4ce9...b15c receive from swapping Dai to ETH?",
    "Which transaction hash is the ETH deposit to Polygon (Matic)?"
  ],
  [
    "After following the on-chain trail, which NFT did wallet 0x4ce9...b15c buy?",
    "What is the Twitter username of the owner of wallet 0x4ce9...b15c?"
  ],
  [
    "Which wallet is most likely controlled by the suspect?",
    "Which assets were stolen from wallet 0x95EeB on Ethereum? Select two.",
    "Which assets were moved out of 0x95EeB on Polygon (Matic) on the incident date? Select two.",
    "Why did the suspect deposit ETH into wallet 0x95EeB?",
    "What was the BEZOGE amount in the suspect's first failed transfer attempt?",
    "How much ETH was in 0x95EeB at block 13633926?"
  ],
  [
    "How much ETH did the suspect receive from the stolen BEZOGE?",
    "At which block did 0xe89aA approve BEZOGE for swapping on Uniswap?",
    "After tracing the transactions, which exchange did the ETH ultimately go to?"
  ],
  [
    "What is the required file format for the exchange request submission?",
    "TX ID",
    "Date (UTC)",
    "From",
    "To",
    "Value"
  ],
  [
    "After analyzing the exchange data, what asset did the suspect convert into and how much?"
  ],
  [
    "Confirm final answer submission"
  ]
];

const playerChoiceText = {
  "1.0": ["Transferred to another wallet", "Staked in DeFi", "Swapped using PancakeSwap", "Swapped using SushiSwap"],
  "3.0": ["A picture of Obi-Wan", "A picture of Nick Furneaux", "A picture of Anakin Skywalker", "Did not buy an NFT"],
  "4.3": ["To compensate the victim or as an apology payment", "To pay gas fees", "No reason"],
  "6.0": ["PDF file only", "Any image file", "No request form needed"],
  "8.0": ["Confirm"]
};

const npcNames = [
  "Chief Inspector",
  "Binance Clerk",
  "Ethereum Analyst",
  "NFT Curator",
  "Victim",
  "Field Informant",
  "VASP Officer",
  "Exchange Analyst",
  "Chief Inspector"
];

const roomLayouts = [
  {
    player: { x: 10, y: 9, dir: "up" },
    npc: { x: 10, y: 5 },
    clue: { x: 4, y: 5 },
    props: [
      { type: "rug", x: 7, y: 7, w: 6, h: 3, block: false, color: "#8e4f45" },
      { type: "desk", x: 8, y: 6, w: 4, h: 1 },
      { type: "bookcase", x: 3, y: 3, w: 2, h: 1 },
      { type: "cabinet", x: 14, y: 3, w: 2, h: 1 },
      { type: "board", x: 13, y: 6, w: 3, h: 1, block: false },
      { type: "plant", x: 4, y: 10, w: 1, h: 1 }
    ]
  },
  {
    player: { x: 3, y: 7, dir: "right" },
    npc: { x: 12, y: 5 },
    clue: { x: 7, y: 6 },
    props: [
      { type: "rug", x: 5, y: 8, w: 6, h: 2, block: false, color: "#4d7f86" },
      { type: "counter", x: 5, y: 4, w: 7, h: 1 },
      { type: "terminal", x: 6, y: 5, w: 1, h: 1 },
      { type: "terminal", x: 9, y: 5, w: 1, h: 1 },
      { type: "server", x: 14, y: 4, w: 1, h: 3 },
      { type: "crate", x: 13, y: 10, w: 2, h: 1 }
    ]
  },
  {
    player: { x: 3, y: 7, dir: "right" },
    npc: { x: 12, y: 6 },
    clue: { x: 8, y: 5 },
    props: [
      { type: "rug", x: 6, y: 6, w: 5, h: 3, block: false, color: "#9d7841" },
      { type: "terminal", x: 5, y: 4, w: 1, h: 1 },
      { type: "terminal", x: 11, y: 4, w: 1, h: 1 },
      { type: "gate", x: 7, y: 9, w: 4, h: 1 },
      { type: "server", x: 14, y: 5, w: 1, h: 3 },
      { type: "board", x: 4, y: 10, w: 2, h: 1, block: false }
    ]
  },
  {
    player: { x: 3, y: 7, dir: "right" },
    npc: { x: 11, y: 5 },
    clue: { x: 8, y: 8 },
    props: [
      { type: "water", x: 3, y: 10, w: 13, h: 1, block: false },
      { type: "frame", x: 4, y: 4, w: 1, h: 1 },
      { type: "frame", x: 7, y: 4, w: 1, h: 1 },
      { type: "frame", x: 10, y: 4, w: 1, h: 1 },
      { type: "terminal", x: 13, y: 7, w: 1, h: 1 },
      { type: "plant", x: 15, y: 5, w: 1, h: 1 }
    ]
  },
  {
    player: { x: 3, y: 7, dir: "right" },
    npc: { x: 11, y: 6 },
    clue: { x: 6, y: 5 },
    props: [
      { type: "rug", x: 7, y: 7, w: 5, h: 3, block: false, color: "#7f6b57" },
      { type: "bed", x: 4, y: 9, w: 3, h: 2 },
      { type: "desk", x: 9, y: 4, w: 3, h: 1 },
      { type: "terminal", x: 12, y: 4, w: 1, h: 1 },
      { type: "cabinet", x: 14, y: 8, w: 2, h: 1 },
      { type: "box", x: 4, y: 4, w: 1, h: 1 }
    ]
  },
  {
    player: { x: 3, y: 7, dir: "right" },
    npc: { x: 12, y: 8 },
    clue: { x: 8, y: 5 },
    props: [
      { type: "street", x: 3, y: 8, w: 13, h: 2, block: false },
      { type: "crate", x: 4, y: 4, w: 2, h: 1 },
      { type: "crate", x: 13, y: 4, w: 2, h: 1 },
      { type: "barrel", x: 5, y: 10, w: 1, h: 1 },
      { type: "barrel", x: 14, y: 10, w: 1, h: 1 },
      { type: "sign", x: 9, y: 3, w: 2, h: 1, block: false }
    ]
  },
  {
    player: { x: 3, y: 7, dir: "right" },
    npc: { x: 12, y: 5 },
    clue: { x: 7, y: 7 },
    props: [
      { type: "desk", x: 5, y: 4, w: 4, h: 1 },
      { type: "desk", x: 10, y: 8, w: 4, h: 1 },
      { type: "folder", x: 6, y: 5, w: 1, h: 1 },
      { type: "folder", x: 11, y: 7, w: 1, h: 1 },
      { type: "cabinet", x: 14, y: 4, w: 2, h: 1 },
      { type: "plant", x: 4, y: 10, w: 1, h: 1 }
    ]
  },
  {
    player: { x: 3, y: 7, dir: "right" },
    npc: { x: 11, y: 5 },
    clue: { x: 8, y: 7 },
    props: [
      { type: "server", x: 4, y: 4, w: 1, h: 3 },
      { type: "server", x: 14, y: 4, w: 1, h: 3 },
      { type: "terminal", x: 7, y: 4, w: 1, h: 1 },
      { type: "terminal", x: 11, y: 8, w: 1, h: 1 },
      { type: "archive", x: 5, y: 10, w: 4, h: 1 },
      { type: "archive", x: 11, y: 10, w: 4, h: 1 }
    ]
  },
  {
    player: { x: 3, y: 7, dir: "right" },
    npc: { x: 11, y: 5 },
    clue: { x: 8, y: 8 },
    props: [
      { type: "rug", x: 6, y: 6, w: 7, h: 4, block: false, color: "#a68d4e" },
      { type: "warTable", x: 7, y: 6, w: 5, h: 2 },
      { type: "board", x: 4, y: 4, w: 3, h: 1, block: false },
      { type: "board", x: 13, y: 4, w: 2, h: 1, block: false },
      { type: "cabinet", x: 14, y: 9, w: 2, h: 1 }
    ]
  }
];

sceneText.forEach((text, index) => {
  Object.assign(scenes[index], text);
});

formOnlyRows.forEach((rows, index) => {
  caseFiles[index].rows = rows;
  caseFiles[index].title = formOnlyTitles[index];
  scenes[index].clue.evidence = formOnlyTitles[index];
  scenes[index].npc.name = npcNames[index];
  caseFiles[index].questions.forEach((question, questionIndex) => {
    question.q = playerQuestionText[index][questionIndex];
    const choiceKey = `${index}.${questionIndex}`;
    if (playerChoiceText[choiceKey]) question.choices = playerChoiceText[choiceKey];
  });
});

roomLayouts.forEach((layout, index) => {
  const scene = scenes[index];
  scene.room = { ...defaultRoom };
  scene.player = layout.player;
  scene.npc = { ...scene.npc, ...layout.npc };
  scene.clue = { ...scene.clue, ...layout.clue };
  scene.props = layout.props;
  scene.spawns = {
    default: layout.player,
    fromPrev: roomSpawns.fromPrev,
    fromNext: roomSpawns.fromNext
  };
});

const extraRoomProps = [
  [
    { type: "chair", x: 8, y: 7, w: 1, h: 1, block: false },
    { type: "paper", x: 12, y: 8, w: 1, h: 1, block: false },
    { type: "lamp", x: 15, y: 10, w: 1, h: 1, block: false },
    { type: "evidenceTape", x: 5, y: 4, w: 3, h: 1, block: false }
  ],
  [
    { type: "chair", x: 6, y: 6, w: 1, h: 1, block: false },
    { type: "scanner", x: 11, y: 6, w: 1, h: 1, block: false },
    { type: "fileStack", x: 13, y: 5, w: 1, h: 1, block: false },
    { type: "poster", x: 4, y: 3, w: 2, h: 1, block: false }
  ],
  [
    { type: "stall", x: 4, y: 6, w: 2, h: 1, block: false },
    { type: "coinPile", x: 12, y: 7, w: 1, h: 1, block: false },
    { type: "banner", x: 7, y: 3, w: 4, h: 1, block: false },
    { type: "crate", x: 15, y: 10, w: 1, h: 1 }
  ],
  [
    { type: "cable", x: 5, y: 6, w: 4, h: 1, block: false },
    { type: "router", x: 12, y: 8, w: 1, h: 1, block: false },
    { type: "stationLight", x: 15, y: 3, w: 1, h: 1, block: false },
    { type: "paper", x: 6, y: 9, w: 1, h: 1, block: false }
  ],
  [
    { type: "statue", x: 5, y: 7, w: 1, h: 1, block: false },
    { type: "rope", x: 6, y: 7, w: 4, h: 1, block: false },
    { type: "spotlight", x: 13, y: 5, w: 1, h: 1, block: false },
    { type: "poster", x: 15, y: 8, w: 1, h: 2, block: false }
  ],
  [
    { type: "sofa", x: 8, y: 10, w: 3, h: 1, block: false },
    { type: "brokenPhone", x: 13, y: 6, w: 1, h: 1, block: false },
    { type: "paper", x: 5, y: 7, w: 1, h: 1, block: false },
    { type: "lamp", x: 15, y: 4, w: 1, h: 1, block: false }
  ],
  [
    { type: "neon", x: 7, y: 4, w: 3, h: 1, block: false },
    { type: "trash", x: 15, y: 7, w: 1, h: 1, block: false },
    { type: "puddle", x: 10, y: 10, w: 2, h: 1, block: false },
    { type: "chainPost", x: 4, y: 6, w: 1, h: 1, block: false }
  ],
  [
    { type: "fileStack", x: 8, y: 8, w: 1, h: 1, block: false },
    { type: "stamp", x: 12, y: 6, w: 1, h: 1, block: false },
    { type: "safe", x: 15, y: 10, w: 1, h: 1 },
    { type: "paper", x: 5, y: 6, w: 1, h: 1, block: false }
  ],
  [
    { type: "chart", x: 6, y: 5, w: 2, h: 1, block: false },
    { type: "fileStack", x: 12, y: 5, w: 1, h: 1, block: false },
    { type: "terminal", x: 9, y: 10, w: 1, h: 1 },
    { type: "paper", x: 10, y: 7, w: 1, h: 1, block: false }
  ],
  [
    { type: "pinLine", x: 5, y: 5, w: 4, h: 1, block: false },
    { type: "evidenceTape", x: 12, y: 8, w: 3, h: 1, block: false },
    { type: "fileStack", x: 5, y: 10, w: 1, h: 1, block: false },
    { type: "lamp", x: 15, y: 10, w: 1, h: 1, block: false }
  ]
];

extraRoomProps.forEach((props, index) => {
  if (scenes[index]) scenes[index].props.push(...props);
});

const sceneDetailProps = [
  [
    { type: "chart", x: 13, y: 5, w: 2, h: 1, block: false },
    { type: "fileStack", x: 4, y: 9, w: 1, h: 1, block: false },
    { type: "pinLine", x: 5, y: 10, w: 3, h: 1, block: false },
    { type: "assetBookshelf", x: 3, y: 3, w: 2, h: 1, block: false },
    { type: "assetPlantA", x: 15, y: 10, w: 1, h: 1, block: false },
    { type: "assetWallFrame", x: 13, y: 4, w: 1, h: 1, block: false }
  ],
  [
    { type: "coinPile", x: 10, y: 7, w: 1, h: 1, block: false },
    { type: "banner", x: 5, y: 3, w: 5, h: 1, block: false },
    { type: "paper", x: 12, y: 4, w: 1, h: 1, block: false },
    { type: "scanner", x: 14, y: 6, w: 1, h: 1, block: false },
    { type: "assetKitchenBlock", x: 13, y: 5, w: 2, h: 2, block: false },
    { type: "assetWhiteTable", x: 5, y: 9, w: 2, h: 1, block: false },
    { type: "assetPlantB", x: 15, y: 9, w: 1, h: 1, block: false }
  ],
  [
    { type: "cable", x: 6, y: 8, w: 5, h: 1, block: false },
    { type: "stationLight", x: 15, y: 4, w: 1, h: 1, block: false },
    { type: "router", x: 5, y: 7, w: 1, h: 1, block: false },
    { type: "paper", x: 13, y: 9, w: 1, h: 1, block: false },
    { type: "assetComputer", x: 14, y: 5, w: 1, h: 2, block: false },
    { type: "assetLongCounter", x: 7, y: 10, w: 3, h: 1, block: false },
    { type: "assetCabinet", x: 4, y: 4, w: 2, h: 2, block: false }
  ],
  [
    { type: "spotlight", x: 5, y: 5, w: 1, h: 1, block: false },
    { type: "rope", x: 4, y: 8, w: 3, h: 1, block: false },
    { type: "statue", x: 14, y: 8, w: 1, h: 1, block: false },
    { type: "poster", x: 12, y: 3, w: 2, h: 1, block: false },
    { type: "assetPhotoFrame", x: 4, y: 4, w: 1, h: 1, block: false },
    { type: "assetPhotoFrame", x: 10, y: 4, w: 1, h: 1, block: false },
    { type: "assetPlantA", x: 15, y: 5, w: 1, h: 1, block: false }
  ],
  [
    { type: "brokenPhone", x: 13, y: 6, w: 1, h: 1, block: false },
    { type: "paper", x: 8, y: 5, w: 1, h: 1, block: false },
    { type: "lamp", x: 15, y: 4, w: 1, h: 1, block: false },
    { type: "fileStack", x: 5, y: 7, w: 1, h: 1, block: false },
    { type: "assetModernBed", x: 4, y: 9, w: 3, h: 2, block: false },
    { type: "assetSmallCabinet", x: 13, y: 8, w: 2, h: 2, block: false },
    { type: "assetTrashBin", x: 4, y: 4, w: 1, h: 1, block: false }
  ],
  [
    { type: "neon", x: 6, y: 4, w: 4, h: 1, block: false },
    { type: "puddle", x: 10, y: 10, w: 2, h: 1, block: false },
    { type: "trash", x: 15, y: 7, w: 1, h: 1, block: false },
    { type: "chainPost", x: 4, y: 6, w: 1, h: 1, block: false },
    { type: "assetTallLocker", x: 14, y: 5, w: 1, h: 2, block: false },
    { type: "assetRedSofa", x: 7, y: 10, w: 2, h: 1, block: false },
    { type: "assetPlantB", x: 5, y: 10, w: 1, h: 1, block: false }
  ],
  [
    { type: "stamp", x: 12, y: 6, w: 1, h: 1, block: false },
    { type: "safe", x: 15, y: 10, w: 1, h: 1, block: false },
    { type: "fileStack", x: 8, y: 8, w: 1, h: 1, block: false },
    { type: "paper", x: 5, y: 6, w: 1, h: 1, block: false },
    { type: "assetCabinet", x: 14, y: 4, w: 2, h: 2, block: false },
    { type: "assetWhiteTable", x: 5, y: 9, w: 2, h: 1, block: false },
    { type: "assetBookshelf", x: 4, y: 3, w: 2, h: 1, block: false }
  ],
  [
    { type: "chart", x: 6, y: 5, w: 2, h: 1, block: false },
    { type: "fileStack", x: 12, y: 5, w: 1, h: 1, block: false },
    { type: "terminal", x: 9, y: 10, w: 1, h: 1, block: false },
    { type: "paper", x: 10, y: 7, w: 1, h: 1, block: false },
    { type: "assetComputer", x: 14, y: 5, w: 1, h: 2, block: false },
    { type: "assetWideShelf", x: 5, y: 10, w: 3, h: 2, block: false },
    { type: "assetWoodCabinet", x: 12, y: 8, w: 1, h: 2, block: false }
  ],
  [
    { type: "pinLine", x: 5, y: 5, w: 4, h: 1, block: false },
    { type: "evidenceTape", x: 12, y: 8, w: 3, h: 1, block: false },
    { type: "fileStack", x: 5, y: 10, w: 1, h: 1, block: false },
    { type: "lamp", x: 15, y: 10, w: 1, h: 1, block: false },
    { type: "assetRedSofa", x: 6, y: 10, w: 2, h: 1, block: false },
    { type: "assetBookshelf", x: 13, y: 4, w: 2, h: 1, block: false },
    { type: "assetPlantA", x: 4, y: 9, w: 1, h: 1, block: false }
  ]
];

sceneDetailProps.forEach((props, index) => {
  scenes[index].props.push(...props);
});

const q28to32 = caseFiles[6].questions;
q28to32[1].placeholder = "";
q28to32[2].placeholder = "dd/mm/yyyy ex. 31/12/2020";
q28to32[3].placeholder = "";
q28to32[4].placeholder = "";
q28to32[5].placeholder = "";

const thaiSceneCopy = [
  {
    name: "ห้องเบาะแส",
    title: "เบาะแส Binance",
    objective: "อ่านแฟ้มเบาะแสตั้งต้น แล้วพิสูจน์ chain กับค่าธรรมเนียมบนบล็อกเชน",
    dialogue: ["ผู้กำกับส่งข้อมูลตั้งต้นมาให้แล้ว", "หาหลักฐานเองก่อนตอบ checkpoint"],
    completeText: "ผ่านแฟ้มเบาะแสตั้งต้นแล้ว"
  },
  {
    name: "ห้องตลาด",
    title: "ห้องตลาด BSC",
    objective: "ตามเหรียญหลังออกจาก Binance แล้วสรุปว่าเกิดอะไรต่อ",
    dialogue: ["ใช้กระเป๋าปลายทางจากแฟ้มก่อนหน้าเป็นจุดเริ่มต้น", "ตรวจหลักฐานเองก่อนตอบ checkpoint"],
    completeText: "ผ่านแฟ้มเส้นทางบน BSC แล้ว"
  },
  {
    name: "สถานี Chain",
    title: "สถานี Ethereum",
    objective: "ตรวจ activity ของกระเป๋าเดียวกันบน Ethereum",
    dialogue: ["ใช้กระเป๋าเดิม แต่เปลี่ยนมาดูบน Ethereum", "แยก transfer, approval, swap และ bridge ให้ชัด"],
    completeText: "ผ่านแฟ้ม Ethereum แล้ว"
  },
  {
    name: "แกลเลอรี",
    title: "ท่าเรือ Polygon",
    objective: "ตามร่องรอยบน Polygon แล้วหาเบาะแสจาก NFT/Profile",
    dialogue: ["NFT และ profile เป็นเบาะแสสำหรับไล่ต่อ", "อย่าใช้ profile clue เป็นข้อสรุปตัวบุคคลทันที"],
    completeText: "ผ่านแฟ้ม NFT/Profile แล้ว"
  },
  {
    name: "ห้องเหยื่อ",
    title: "ห้องเหยื่อ MetaMask",
    objective: "สืบเคส MetaMask hack จากกระเป๋าเหยื่อและวันเกิดเหตุ",
    dialogue: ["ข้อมูลตั้งต้นอยู่ในแฟ้มคดี", "ตัดธุรกรรมที่อยู่นอกช่วงเหตุการณ์ออกก่อน"],
    completeText: "ผ่านแฟ้มเหยื่อแล้ว"
  },
  {
    name: "เส้นทางผู้ต้องสงสัย",
    title: "ซอยผู้ต้องสงสัย",
    objective: "ตามเส้นทางทรัพย์สินจากผู้ต้องสงสัยไปยังปลายทาง",
    dialogue: ["ไม่มีเฉลยในห้องนี้", "ต้องไล่หลักฐานเองจากธุรกรรมที่เกี่ยวข้อง"],
    completeText: "ผ่านแฟ้มผู้ต้องสงสัยแล้ว"
  },
  {
    name: "โต๊ะ VASP",
    title: "โต๊ะคำขอข้อมูล Exchange",
    objective: "ใช้ข้อมูลตอบกลับจาก Exchange เพื่อกรอก TX ID, Date, From, To, Value",
    dialogue: ["ถือว่าได้รับข้อมูลตอบกลับจาก Exchange แล้ว", "อ่าน record ให้ตรง field ก่อนกรอก"],
    completeText: "ผ่านแฟ้มคำขอข้อมูลแล้ว"
  },
  {
    name: "บันทึก Exchange",
    title: "บันทึก Exchange",
    objective: "วิเคราะห์รายการใน Exchange แล้วหาเหรียญที่ถูกแปลง",
    dialogue: ["ห้องนี้ต้องอ่าน record ของ Exchange", "เลือกคำตอบตามข้อมูลที่ตรวจเอง"],
    completeText: "ผ่านแฟ้ม Exchange แล้ว"
  },
  {
    name: "ห้องสรุปคดี",
    title: "รายงานปิดคดี",
    objective: "ตรวจหลักฐานครบ แล้วส่งคำตอบสุดท้าย",
    dialogue: ["ตรวจทุก checkpoint ก่อนยืนยัน", "ยืนยันแล้วถือว่าปิดเคส"],
    completeText: "Case cleared. ยืนยันส่งคำตอบแล้ว"
  }
];

const thaiFileTitles = [
  "แฟ้มเบาะแสตั้งต้น",
  "แฟ้มเส้นทางบน BSC",
  "แฟ้ม Ethereum",
  "แฟ้ม NFT/Profile",
  "แฟ้มเหยื่อ MetaMask",
  "แฟ้มผู้ต้องสงสัย",
  "แฟ้มคำขอข้อมูล Exchange",
  "แฟ้มข้อมูล Exchange",
  "แฟ้มส่งคำตอบสุดท้าย"
];

const thaiEvidenceRows = [
  [
    ["Initial lead", "พบว่าแอดเดรส Bitcoin bc1q8zu0zj8w8kfd4dp7vdg3ltxcw59qz50e3ux46q ส่ง BTC ไปยัง Binance"],
    ["Binance trade record", "วันที่ 2021-12-01 13:32:31 | คู่เทรด BNBBTC | ขาย 0.00666383 BTC | ซื้อ 0.59617718 BNB | ราคา 1 BTC = 89.46464 BNB"],
    ["Binance withdrawal record", "วันที่ 2021-12-01 13:54:00 | เหรียญ BNB | จำนวน 0.59567718 | ค่าธรรมเนียมที่ Binance แจ้ง 0.0005"],
    ["Destination wallet", "0x4ce9a5c772e6dd1a16363895a37b76a39fe7b15c"],
    ["Transaction ID to inspect", "0xf4985003ac11aafe81de2a6f9d5ed5a367f5de349c150c91c4fb8d27b43c862d"]
  ],
  [
    ["Starting point", "ใช้กระเป๋าปลายทาง 0x4ce9...b15c จากแฟ้มก่อนหน้า"],
    ["Next action to identify", "หลังจากได้รับ BNB แล้ว เหรียญถูกนำไปทำอะไรต่อ"],
    ["Token to identify", "ถูกแลกเป็นโทเค็น BEP-20 ใด"],
    ["Amount to verify", "กระเป๋า 0x4ce9...b15c ได้รับโทเค็นดังกล่าวจำนวนเท่าใด"],
    ["Supporting detail", "ตรวจเว็บไซต์ปัจจุบันของโทเค็นนั้นจากหน้าข้อมูลโทเค็น"]
  ],
  [
    ["Starting point", "นำกระเป๋า 0x4ce9...b15c ไปตรวจบน Ethereum blockchain"],
    ["Inbound ETH to find", "จำนวน ETH ที่ได้รับโดยตรงจาก Coinbase"],
    ["Fee total to calculate", "ETH รวมที่ใช้เป็นค่าธรรมเนียมของธุรกรรมประเภทอนุมัติ"],
    ["Approvals to identify", "บริการ 2 รายการที่ได้รับอนุมัติให้โอน WETH"],
    ["Bridge trail to verify", "ETH ที่ได้รับจากการแลก Dai เป็น ETH และรหัสธุรกรรมที่ฝาก ETH ไป Polygon"]
  ],
  [
    ["Starting point", "ตาม activity ของกระเป๋า 0x4ce9...b15c ต่อบน Polygon"],
    ["NFT clue to identify", "NFT ที่กระเป๋านี้ซื้อหลังจากตามเส้นทางบน chain"],
    ["OSINT lead", "ชื่อผู้ใช้ Twitter หรือ profile ที่เชื่อมกับเจ้าของกระเป๋า"]
  ],
  [
    ["New case", "เหตุ Hack กระเป๋า MetaMask ให้สืบธุรกรรมที่น่าสงสัยและติดตามเงินที่ถูกขโมย"],
    ["Victim wallet", "0x95eeb3bae8d79e078ce23ac1c5580c4cec11b227"],
    ["Incident date", "17 พ.ย. 2021"],
    ["Relevant chains", "Ethereum และ Polygon (matic)"],
    ["Investigation scope", "ธุรกรรมใด ๆ ก่อนวันที่เกิดเหตุไม่มีส่วนเกี่ยวข้องกับโจทย์"],
    ["Findings to produce", "กระเป๋าผู้ต้องสงสัย เหรียญที่ถูกขโมย เหตุผลของ gas funding และค่าที่โจทย์ถาม"]
  ],
  [
    ["Starting point", "ใช้กระเป๋าผู้ต้องสงสัยจากแฟ้มก่อนหน้า"],
    ["ETH amount to find", "ETH ที่ผู้ต้องสงสัยได้รับจาก BEZOGE"],
    ["Approval block to identify", "หมายเลข block ที่มีการอนุมัติเพื่อ swap BEZOGE บน Uniswap"],
    ["Endpoint to conclude", "Exchange ที่ ETH ถูกโอนไปในท้ายที่สุด"]
  ],
  [
    ["Request task", "ให้ทำหนังสือขอข้อมูลจาก Exchange ที่พบ แล้วใช้ไฟล์ตอบกลับทำโจทย์ต่อไป"],
    ["Template file", "Request_form.docx"],
    ["Submission rule", "ส่งเป็นไฟล์ PDF เท่านั้น"],
    ["Exchange response file", "report_04072023_RTP0026.277.xlsx"],
    ["Fields to fill", "TX ID, Date (UTC), From, To, Value"]
  ],
  [
    ["Source file", "report_04072023_RTP0026.277.xlsx"],
    ["Finding to report", "เมื่อวิเคราะห์ข้อมูลที่ Exchange ให้มา ผู้ต้องสงสัยได้แปลงเหรียญเป็นเหรียญอะไร และจำนวนเท่าใด"]
  ],
  [
    ["Final step", "ยืนยันการส่งคำตอบ"],
    ["Before confirming", "ตรวจว่าคำตอบทุก checkpoint มาจากหลักฐานที่ตรวจซ้ำได้"]
  ]
];

const thaiQuestions = [
  [
    "ผู้ต้องสงสัยแปลง BTC เป็น BNB และย้ายไปที่กระเป๋า 0x4ce9...b15c ธุรกรรมนี้อยู่บนบล็อกเชนใด",
    "ค่าธรรมเนียมของธุรกรรมบนบล็อกเชนคือเท่าไหร่"
  ],
  [
    "หลังจากได้รับ BNB แล้ว เหรียญดังกล่าวถูกนำไปทำอะไรต่อ",
    "BNB ถูกแลกเปลี่ยนเป็นโทเค็น BEP-20 ใด",
    "กระเป๋า 0x4ce9...b15c ได้รับโทเค็นดังกล่าวเป็นจำนวนเท่าใด",
    "เว็บไซต์ปัจจุบันของโทเค็นนี้คืออะไร"
  ],
  [
    "กระเป๋า 0x4ce9...b15c ได้รับ ETH โดยตรงจาก Coinbase เป็นจำนวนเท่าใด",
    "รวมแล้ว ETH ที่ใช้เป็นค่าธรรมเนียมของธุรกรรมประเภทอนุมัติเป็นจำนวนเท่าใด",
    "บริการใด 2 รายการที่ได้รับอนุมัติให้โอน WETH",
    "กระเป๋า 0x4ce9...b15c ได้รับ ETH เท่าใดจากการแลก Dai เป็น ETH",
    "Txn Hash ใดเป็นธุรกรรมฝาก ETH ไปยัง Polygon (Matic)"
  ],
  [
    "หลังจากตามเส้นทางบน chain แล้ว กระเป๋า 0x4ce9...b15c ซื้อ NFT ใด",
    "ชื่อผู้ใช้ Twitter ของเจ้าของกระเป๋า 0x4ce9...b15c คืออะไร"
  ],
  [
    "กระเป๋าใดน่าจะเป็นของผู้ต้องสงสัยมากที่สุด",
    "เหรียญอะไรถูกขโมยจากกระเป๋า 0x95EeB บน Ethereum blockchain (เลือก 2 รายการ)",
    "เหรียญใดถูกนำออกจาก 0x95EeB ในวันที่เกิดเหตุบน Polygon (Matic) blockchain (เลือก 2 รายการ)",
    "เหตุใดผู้ต้องสงสัยจึงฝาก ETH ไว้ในกระเป๋า 0x95EeB",
    "จำนวน BEZOGE ในธุรกรรมแรกที่ผู้ต้องสงสัยพยายามย้ายแต่ล้มเหลวคือเท่าใด",
    "มี ETH จำนวนเท่าใดใน 0x95EeB ที่ block หมายเลข 13633926"
  ],
  [
    "ผู้ต้องสงสัยได้รับ ETH เท่าไหร่จากการขโมย BEZOGE",
    "0xe89aA ทำการ Approve เพื่อ swap เหรียญ BEZOGE บน Uniswap ใน block หมายเลขใด",
    "เมื่อตามธุรกรรมต่อไป สุดท้ายแล้ว ETH ทั้งหมดถูกโอนไปที่ Exchange ใด"
  ],
  [
    "เงื่อนไขของไฟล์ที่ต้องส่งเพื่อทำโจทย์ต่อไปคืออะไร",
    "TX ID",
    "Date (UTC)",
    "From",
    "To",
    "Value"
  ],
  [
    "เมื่อวิเคราะห์ข้อมูลที่ Exchange ให้มา ผู้ต้องสงสัยได้แปลงเหรียญเป็นเหรียญอะไร จำนวนเท่าใด"
  ],
  [
    "ยืนยันส่งคำตอบ"
  ]
];

const thaiChoiceText = {
  "1.0": ["ถูกโอนไปยังกระเป๋าอื่น", "ถูก Stake ไปที่ DeFi", "ถูก Swap โดยใช้ PancakeSwap", "ถูก Swap โดยใช้ SushiSwap"],
  "3.0": ["A picture of Obi-Wan", "A picture of Nick Furneaux", "A picture of Anakin Skywalker", "ไม่ได้ซื้อ NFT"],
  "4.3": ["เพื่อชดเชยเหรียญที่เหยื่อสูญเสีย หรือเป็นค่าทำขวัญ", "เพื่อใช้เป็นค่า Gas fees", "ไม่มีเหตุผล"],
  "6.0": ["ส่งเป็นไฟล์ PDF เท่านั้น", "ส่งเป็นไฟล์ภาพอะไรก็ได้", "ไม่ต้องส่งหนังสือขอข้อมูล"],
  "8.0": ["ยืนยัน"]
};

const thaiNpcNames = [
  "ผู้กำกับ",
  "เจ้าหน้าที่ Binance",
  "นักวิเคราะห์ Ethereum",
  "ภัณฑารักษ์ NFT",
  "เหยื่อ",
  "สายข่าว",
  "เจ้าหน้าที่ VASP",
  "นักวิเคราะห์ Exchange",
  "ผู้กำกับ"
];

const languagePacks = {
  en: {
    sceneCopy: sceneText,
    fileTitles: formOnlyTitles,
    evidenceRows: formOnlyRows,
    questions: playerQuestionText,
    choices: playerChoiceText,
    npcNames
  },
  th: {
    sceneCopy: thaiSceneCopy,
    fileTitles: thaiFileTitles,
    evidenceRows: thaiEvidenceRows,
    questions: thaiQuestions,
    choices: thaiChoiceText,
    npcNames: thaiNpcNames
  }
};

const uiText = {
  th: {
    htmlLang: "th",
    langToggle: "ไทย / ENG",
    logoSubtitle: "เกมสืบสวนเส้นทางเงิน",
    guideKicker: "คู่มือภาคสนาม",
    manualButton: "คู่มือ",
    guideTitle: "Crypto Detective: Chain Trail",
    manualTitle: "คู่มือการเล่น",
    startButton: "เริ่มสืบสวน",
    closeManual: "ปิดคู่มือ",
    sceneLabel: "ด่าน",
    evidenceLabel: "หลักฐาน",
    objectiveLabel: "เป้าหมาย",
    evidenceLogKicker: "Evidence Log",
    close: "ปิด",
    next: "ต่อไป",
    interactButton: "ACT",
    guideSections: [
      ["จุดมุ่งหมาย", "ไล่เส้นทางเงินจากเบาะแสแรกไปจนถึงปลายทาง เก็บ Evidence File ในแต่ละห้อง แล้วตอบ Checkpoint ให้ผ่านก่อนเปิดประตูไปห้องถัดไป"],
      ["ปุ่มควบคุม", "<kbd>WASD</kbd> / <kbd>Arrow</kbd> เดิน<br><kbd>E</kbd> / <kbd>Enter</kbd> / <kbd>Space</kbd> คุย ตรวจหลักฐาน หรือเลื่อนบทสนทนา<br><kbd>M</kbd> หรือปุ่ม <kbd>MAP</kbd> เปิดแผนที่"],
      ["ต้องกดตรงไหน", "เดินไปใกล้ NPC หรือแฟ้มหลักฐานที่มีป้ายชื่อ แล้วกด <kbd>E</kbd>, <kbd>Enter</kbd> หรือ <kbd>Space</kbd> เพื่อคุยหรือเปิด Evidence File"],
      ["การผ่านด่าน", "ตอบ Checkpoint ให้ถูกทุกข้อ ประตูขวาจะเปิดเพื่อไปห้องถัดไป ประตูซ้ายใช้เดินย้อนกลับไปห้องก่อนหน้า"]
    ],
    controlsHtml: `
      <h2>Controls</h2>
      <p><kbd>WASD</kbd> / <kbd>Arrow</kbd> เดิน</p>
      <p><kbd>E</kbd> / <kbd>Enter</kbd> / <kbd>Space</kbd> คุย / ตรวจหลักฐาน / เลื่อนบทสนทนา</p>
      <p><kbd>M</kbd> เปิดแผนที่</p>
    `,
    evidenceDockTitle: "หลักฐานที่เก็บแล้ว",
    checkpointHeading: "คำถาม Checkpoint",
    submit: "SUBMIT",
    noEvidence: "ยังไม่มีหลักฐาน",
    checkpointPassed: "ผ่าน checkpoint แล้ว ประตูเปิด",
    answerEveryQuestion: "ตอบให้ถูกทุกข้อเพื่อเปิดประตู",
    evidenceStatusDone: "Checkpoint ผ่านแล้ว",
    evidenceStatusOpen: "เปิดดูรายละเอียด / ตอบ checkpoint",
    stageDone: "Done",
    stageEvidence: "Evidence",
    stageActive: "Active",
    stageLocked: "Locked route",
    objectiveClearedFinal: "Case cleared. รายงานปิดคดีถูกส่งแล้ว",
    objectiveCleared: "Checkpoint ผ่านแล้ว เดินไปประตูห้องถัดไป",
    objectiveCollected: "เปิด Evidence Log แล้วตอบ checkpoint ให้ผ่าน",
    noInteract: "ไม่มีอะไรให้ตรวจตรงนี้",
    savedEvidence: "บันทึก evidence แล้ว เปิดแฟ้มเพื่อตอบ checkpoint",
    reopenEvidence: "เปิด evidence detail อีกครั้ง",
    checkpointBlocked: "ต้องตอบ checkpoint ให้ผ่านก่อน",
    evidenceBlocked: "ต้องเก็บ evidence ก่อน",
    entering: "เข้าสู่",
    mapOpen: "เปิดแผนที่: กด M, E, Enter หรือ Space เพื่อปิด",
    mapClosed: "ปิดแผนที่",
    wrongPrefix: "ยังไม่ผ่าน: ตรวจข้อ",
    wrongSuffix: "อีกครั้ง",
    startToast: "กด E, Enter หรือ Space เพื่อคุยหรือตรวจหลักฐาน กด M เพื่อเปิดแผนที่",
    languageChanged: "เปลี่ยนภาษาแล้ว",
    mapTitle: "CASE MAP",
    mapHelp: "M/E/Enter/Space ปิดแผนที่  |  ประตูซ้ายย้อนกลับ  |  ประตูขวาไปต่อเมื่อผ่าน checkpoint",
    npcTag: "NPC",
    evidenceTag: "แฟ้ม"
  },
  en: {
    htmlLang: "en",
    langToggle: "ENG / ไทย",
    logoSubtitle: "Chain Trail Prototype",
    guideKicker: "Field Manual",
    manualButton: "Manual",
    guideTitle: "Crypto Detective: Chain Trail",
    manualTitle: "Field Manual",
    startButton: "Start Investigation",
    closeManual: "Close Manual",
    sceneLabel: "Scene",
    evidenceLabel: "Evidence",
    objectiveLabel: "Objective",
    evidenceLogKicker: "Evidence Log",
    close: "Close",
    next: "Next",
    interactButton: "ACT",
    guideSections: [
      ["Objective", "Trace the money route from the first lead to the endpoint. Collect an Evidence File in each room, then pass the checkpoint before the next door opens."],
      ["Controls", "<kbd>WASD</kbd> / <kbd>Arrow</kbd> Move<br><kbd>E</kbd> / <kbd>Enter</kbd> / <kbd>Space</kbd> Talk, inspect evidence, or advance dialogue<br><kbd>M</kbd> or <kbd>MAP</kbd> Open map"],
      ["Where To Interact", "Walk near an NPC or the labeled evidence file, then press <kbd>E</kbd>, <kbd>Enter</kbd>, or <kbd>Space</kbd> to talk or open the Evidence File."],
      ["Clear A Room", "Answer every checkpoint correctly. The right door opens to the next room, and the left door lets you backtrack."]
    ],
    controlsHtml: `
      <h2>Controls</h2>
      <p><kbd>WASD</kbd> / <kbd>Arrow</kbd> Move</p>
      <p><kbd>E</kbd> / <kbd>Enter</kbd> / <kbd>Space</kbd> Talk / inspect / advance dialogue</p>
      <p><kbd>M</kbd> Open map</p>
    `,
    evidenceDockTitle: "Collected Evidence",
    checkpointHeading: "Checkpoint Questions",
    submit: "SUBMIT",
    noEvidence: "No evidence collected",
    checkpointPassed: "Checkpoint passed. Door unlocked.",
    answerEveryQuestion: "Answer every question correctly to unlock the door.",
    evidenceStatusDone: "Checkpoint passed",
    evidenceStatusOpen: "Open detail / answer checkpoint",
    stageDone: "Done",
    stageEvidence: "Evidence",
    stageActive: "Active",
    stageLocked: "Locked route",
    objectiveClearedFinal: "Case cleared. Final report submitted.",
    objectiveCleared: "Checkpoint passed. Walk to the next door.",
    objectiveCollected: "Open the Evidence Log and pass the checkpoint.",
    noInteract: "Nothing to inspect here.",
    savedEvidence: "Evidence recorded. Open the file and answer the checkpoint.",
    reopenEvidence: "Opening evidence detail again.",
    checkpointBlocked: "Pass the checkpoint first.",
    evidenceBlocked: "Collect the evidence first.",
    entering: "Entering",
    mapOpen: "Map open: press M, E, Enter, or Space to close",
    mapClosed: "Map closed",
    wrongPrefix: "Not yet: check question",
    wrongSuffix: "again",
    startToast: "Press E, Enter, or Space to talk/inspect. Press M for map.",
    languageChanged: "Language changed",
    mapTitle: "CASE MAP",
    mapHelp: "M/E/Enter/Space close map  |  left door backtracks  |  right door opens after checkpoint",
    npcTag: "NPC",
    evidenceTag: "EVIDENCE"
  }
};

let currentLanguage = localStorage.getItem("crypto-detective-language") || "th";
let guideMode = "intro";

function text(key) {
  return uiText[currentLanguage][key];
}

function applyLanguage(language, options = {}) {
  currentLanguage = languagePacks[language] ? language : "th";
  localStorage.setItem("crypto-detective-language", currentLanguage);
  const pack = languagePacks[currentLanguage];

  pack.sceneCopy.forEach((copy, index) => {
    Object.assign(scenes[index], copy);
    scenes[index].npc.name = pack.npcNames[index];
    scenes[index].clue.label = pack.fileTitles[index];
    scenes[index].clue.evidence = pack.fileTitles[index];
    caseFiles[index].title = pack.fileTitles[index];
    caseFiles[index].rows = pack.evidenceRows[index];
    caseFiles[index].questions.forEach((question, questionIndex) => {
      question.q = pack.questions[index][questionIndex];
      const choiceKey = `${index}.${questionIndex}`;
      if (pack.choices[choiceKey]) question.choices = pack.choices[choiceKey];
    });
  });

  updateUiLanguage();
  if (options.render !== false) {
    if (!dossier.hidden && state.activeDossier !== null) openDossier(state.activeDossier);
    if (!dialogue.hidden) {
      const scene = scenes[state.scene];
      state.dialogueLines = scene.dialogue;
      dialogueSpeaker.textContent = scene.npc.name;
      dialogueText.textContent = state.dialogueLines[state.dialogueIndex] || "";
    }
    renderHud();
    showToast(text("languageChanged"));
  }
}

function updateUiLanguage() {
  document.documentElement.lang = text("htmlLang");
  languageToggle.textContent = text("langToggle");
  guideLanguageToggle.textContent = text("langToggle");
  guideKicker.textContent = text("guideKicker");
  logoSubtitle.textContent = text("logoSubtitle");
  sceneStatLabel.textContent = text("sceneLabel");
  evidenceStatLabel.textContent = text("evidenceLabel");
  objectiveLabel.textContent = text("objectiveLabel");
  evidenceLogKicker.textContent = text("evidenceLogKicker");
  manualToggle.textContent = text("manualButton");
  controlsPanel.innerHTML = text("controlsHtml");
  evidenceDetailHeading.textContent = "Evidence Detail";
  checkpointHeading.textContent = text("checkpointHeading");
  checkpointSubmit.textContent = text("submit");
  closeDossier.textContent = text("close").toUpperCase();
  dialogueNext.textContent = text("next").toUpperCase();
  touchInteract.textContent = text("interactButton");
  document.querySelector(".evidence-dock h3").textContent = text("evidenceDockTitle");
  renderGuide();
}

function renderGuide() {
  guideTitle.textContent = guideMode === "manual" ? text("manualTitle") : text("guideTitle");
  guidePrimary.textContent = guideMode === "manual" ? text("closeManual") : text("startButton");
  guideGrid.innerHTML = text("guideSections").map(([title, body]) => `
    <section>
      <h3>${title}</h3>
      <p>${body}</p>
    </section>
  `).join("");
}

const state = {
  scene: 0,
  completed: new Set(),
  collected: new Set(),
  keys: new Set(),
  player: { x: 0, y: 0, px: 0, py: 0, dir: "down", frame: 1, moving: false },
  lastMove: 0,
  mapOpen: false,
  activeDossier: null,
  dialogueLines: [],
  dialogueIndex: 0
};

applyLanguage(currentLanguage, { render: false });

function resetPlayer(spawn = "default") {
  const scene = scenes[state.scene];
  const start = scene.spawns?.[spawn] || scene.player;
  state.player.x = start.x;
  state.player.y = start.y;
  state.player.px = start.x * TILE;
  state.player.py = start.y * TILE;
  state.player.dir = start.dir || "down";
  state.player.frame = 1;
  state.lastMove = 0;
}

function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
  ctx.strokeStyle = "rgba(17,25,35,0.12)";
  ctx.strokeRect(x * TILE, y * TILE, TILE, TILE);
}

function drawScene() {
  const scene = scenes[state.scene];
  const room = scene.room || defaultRoom;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < 15; y += 1) {
    for (let x = 0; x < 20; x += 1) {
      const inside = x >= room.x && x < room.x + room.w && y >= room.y && y < room.y + room.h;
      const wall = x === room.x || x === room.x + room.w - 1 || y === room.y || y === room.y + room.h - 1;
      drawTile(x, y, inside ? (wall && !isDoorTile(x, y, scene) ? scene.wall : scene.floor) : "#0e1721");
    }
  }

  drawProps(scene);
  drawClue(scene.clue);
  drawNpc(scene.npc);
  drawPlayer();
  drawEntityTags(scene);
  if (state.mapOpen) drawWorldMap();
}

function drawProps(scene) {
  drawDoors(scene);
  (scene.props || []).forEach(drawProp);
}

function drawRectTile(x, y, w, h, fill, stroke = "#17212b", line = 4) {
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = line;
  ctx.fillRect(x * TILE, y * TILE, w * TILE, h * TILE);
  ctx.strokeRect(x * TILE + 2, y * TILE + 2, w * TILE - 4, h * TILE - 4);
}

function drawAssetProp(prop) {
  const sprite = assetPropSprites[prop.type];
  if (!sprite) return false;
  if (!propsSheet.complete || !propsSheet.naturalWidth) return true;
  const targetW = sprite.dw || prop.w * TILE;
  const targetH = sprite.dh || prop.h * TILE;
  const x = prop.x * TILE + (sprite.dx || 0);
  const y = prop.y * TILE + (sprite.dy || 0);
  ctx.drawImage(propsSheet, sprite.sx, sprite.sy, sprite.sw, sprite.sh, x, y, targetW, targetH);
  return true;
}

function drawProp(prop) {
  if (drawAssetProp(prop)) return;

  const base = {
    desk: "#e8dfb0",
    counter: "#d9c480",
    terminal: "#c7d9d6",
    server: "#70808c",
    bookcase: "#8c6b43",
    cabinet: "#9b875f",
    board: "#263445",
    plant: "#4f7d4b",
    crate: "#a77742",
    box: "#b79758",
    bed: "#d9d2b0",
    gate: "#7b8794",
    frame: "#e8dfb0",
    water: "#315f9b",
    street: "#4c5963",
    barrel: "#6f5660",
    sign: "#f4cb5f",
    folder: "#f4cb5f",
    archive: "#8c9270",
    warTable: "#d9c480",
    chair: "#6f5660",
    paper: "#fffaf0",
    lamp: "#f4cb5f",
    evidenceTape: "#f4cb5f",
    scanner: "#9fe0dd",
    fileStack: "#f8efc8",
    poster: "#e8dfb0",
    stall: "#d9c480",
    coinPile: "#f4cb5f",
    banner: "#dd5f4d",
    cable: "#17212b",
    router: "#70808c",
    stationLight: "#9fe0dd",
    statue: "#8c9270",
    rope: "#806332",
    spotlight: "#f4cb5f",
    sofa: "#8e4f45",
    brokenPhone: "#263445",
    neon: "#315f9b",
    trash: "#4c5963",
    puddle: "#315f9b",
    chainPost: "#7b8794",
    stamp: "#dd5f4d",
    safe: "#4c5963",
    chart: "#fffaf0",
    pinLine: "#fffaf0",
    rug: prop.color || "#8e4f45"
  }[prop.type] || "#e8dfb0";

  drawRectTile(prop.x, prop.y, prop.w, prop.h, base, prop.block === false ? "rgba(23,33,43,0.45)" : "#17212b", prop.block === false ? 2 : 4);

  const px = prop.x * TILE;
  const py = prop.y * TILE;
  if (prop.type === "terminal") {
    ctx.fillStyle = "#6bd17d";
    ctx.fillRect(px + 8, py + 7, TILE - 16, 10);
    ctx.fillStyle = "#17212b";
    ctx.fillRect(px + 11, py + 21, TILE - 22, 4);
  }
  if (prop.type === "server") {
    ctx.fillStyle = "#9fe0dd";
    for (let i = 0; i < prop.h; i += 1) {
      ctx.fillRect(px + 7, py + i * TILE + 7, 6, 6);
      ctx.fillRect(px + 18, py + i * TILE + 7, 6, 6);
    }
  }
  if (prop.type === "bookcase" || prop.type === "archive") {
    ctx.fillStyle = "#f4cb5f";
    for (let i = 0; i < prop.w; i += 1) {
      ctx.fillRect(px + i * TILE + 6, py + 7, 5, TILE - 14);
      ctx.fillRect(px + i * TILE + 16, py + 7, 5, TILE - 14);
    }
  }
  if (prop.type === "board") {
    ctx.fillStyle = "#f4cb5f";
    ctx.fillRect(px + 8, py + 9, prop.w * TILE - 16, 4);
    ctx.fillRect(px + 8, py + 18, prop.w * TILE - 32, 4);
  }
  if (prop.type === "frame") {
    ctx.fillStyle = "#315f9b";
    ctx.fillRect(px + 8, py + 8, TILE - 16, TILE - 16);
    ctx.fillStyle = "#f4cb5f";
    ctx.fillRect(px + 13, py + 13, 6, 6);
  }
  if (prop.type === "plant") {
    ctx.fillStyle = "#77b96c";
    ctx.fillRect(px + 10, py + 6, 12, 15);
    ctx.fillStyle = "#806332";
    ctx.fillRect(px + 12, py + 20, 8, 8);
  }
  if (prop.type === "sign") {
    ctx.fillStyle = "#17212b";
    ctx.fillRect(px + 8, py + 10, prop.w * TILE - 16, 4);
    ctx.fillRect(px + 8, py + 20, prop.w * TILE - 26, 4);
  }
  if (prop.type === "chair") {
    ctx.fillStyle = "#17212b";
    ctx.fillRect(px + 8, py + 8, 16, 5);
    ctx.fillRect(px + 7, py + 19, 18, 5);
    ctx.fillRect(px + 9, py + 13, 4, 9);
    ctx.fillRect(px + 20, py + 13, 4, 9);
  }
  if (prop.type === "paper") {
    ctx.fillStyle = "#17212b";
    ctx.fillRect(px + 9, py + 11, 14, 2);
    ctx.fillRect(px + 9, py + 17, 11, 2);
    ctx.fillRect(px + 9, py + 23, 9, 2);
  }
  if (prop.type === "lamp" || prop.type === "stationLight" || prop.type === "spotlight") {
    ctx.fillStyle = "#fff8db";
    ctx.fillRect(px + 10, py + 7, 12, 9);
    ctx.fillStyle = "#17212b";
    ctx.fillRect(px + 14, py + 16, 4, 10);
    ctx.fillRect(px + 9, py + 26, 14, 3);
  }
  if (prop.type === "evidenceTape" || prop.type === "banner") {
    ctx.fillStyle = prop.type === "banner" ? "#fff8db" : "#17212b";
    for (let i = 0; i < prop.w; i += 1) {
      ctx.fillRect(px + i * TILE + 5, py + 12, 10, 4);
      ctx.fillRect(px + i * TILE + 18, py + 18, 9, 4);
    }
  }
  if (prop.type === "scanner" || prop.type === "router") {
    ctx.fillStyle = "#17212b";
    ctx.fillRect(px + 7, py + 12, 18, 9);
    ctx.fillStyle = "#6bd17d";
    ctx.fillRect(px + 10, py + 8, 12, 4);
  }
  if (prop.type === "fileStack") {
    ctx.fillStyle = "#315f9b";
    ctx.fillRect(px + 7, py + 10, 18, 4);
    ctx.fillStyle = "#dd5f4d";
    ctx.fillRect(px + 9, py + 16, 16, 4);
    ctx.fillStyle = "#f4cb5f";
    ctx.fillRect(px + 6, py + 22, 19, 4);
  }
  if (prop.type === "poster" || prop.type === "chart") {
    ctx.fillStyle = "#315f9b";
    ctx.fillRect(px + 8, py + 8, prop.w * TILE - 16, 4);
    ctx.fillStyle = "#dd5f4d";
    ctx.fillRect(px + 8, py + 17, prop.w * TILE - 24, 4);
  }
  if (prop.type === "stall") {
    ctx.fillStyle = "#dd5f4d";
    ctx.fillRect(px + 2, py + 5, prop.w * TILE - 4, 7);
    ctx.fillStyle = "#fff8db";
    for (let i = 0; i < prop.w; i += 1) ctx.fillRect(px + i * TILE + 8, py + 18, 12, 8);
  }
  if (prop.type === "coinPile") {
    ctx.fillStyle = "#fff8db";
    ctx.fillRect(px + 8, py + 18, 7, 5);
    ctx.fillRect(px + 15, py + 12, 7, 5);
    ctx.fillRect(px + 18, py + 21, 7, 5);
  }
  if (prop.type === "cable" || prop.type === "rope" || prop.type === "pinLine") {
    ctx.strokeStyle = prop.type === "pinLine" ? "#dd5f4d" : "#17212b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px + 8, py + 18);
    ctx.lineTo(px + prop.w * TILE - 8, py + 14);
    ctx.stroke();
    if (prop.type === "pinLine") {
      ctx.fillStyle = "#f4cb5f";
      ctx.fillRect(px + 7, py + 11, 6, 6);
      ctx.fillRect(px + prop.w * TILE - 14, py + 9, 6, 6);
    }
  }
  if (prop.type === "statue" || prop.type === "chainPost") {
    ctx.fillStyle = "#17212b";
    ctx.fillRect(px + 13, py + 8, 6, 14);
    ctx.fillRect(px + 8, py + 22, 16, 5);
  }
  if (prop.type === "sofa") {
    ctx.fillStyle = "#17212b";
    ctx.fillRect(px + 7, py + 9, prop.w * TILE - 14, 5);
    ctx.fillRect(px + 5, py + 18, prop.w * TILE - 10, 8);
  }
  if (prop.type === "brokenPhone") {
    ctx.fillStyle = "#9fe0dd";
    ctx.fillRect(px + 11, py + 8, 10, 16);
    ctx.strokeStyle = "#dd5f4d";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px + 12, py + 10);
    ctx.lineTo(px + 20, py + 22);
    ctx.stroke();
  }
  if (prop.type === "neon") {
    ctx.fillStyle = "#f4cb5f";
    ctx.fillRect(px + 8, py + 9, prop.w * TILE - 16, 5);
    ctx.fillStyle = "#9fe0dd";
    ctx.fillRect(px + 12, py + 19, prop.w * TILE - 30, 4);
  }
  if (prop.type === "trash" || prop.type === "safe") {
    ctx.fillStyle = "#17212b";
    ctx.fillRect(px + 9, py + 9, 14, 16);
    ctx.fillStyle = prop.type === "safe" ? "#f4cb5f" : "#70808c";
    ctx.fillRect(px + 13, py + 13, 6, 6);
  }
  if (prop.type === "puddle") {
    ctx.fillStyle = "rgba(159, 224, 221, 0.65)";
    ctx.fillRect(px + 6, py + 13, prop.w * TILE - 12, 8);
    ctx.fillRect(px + 15, py + 21, prop.w * TILE - 28, 4);
  }
  if (prop.type === "stamp") {
    ctx.fillStyle = "#17212b";
    ctx.fillRect(px + 12, py + 8, 8, 10);
    ctx.fillStyle = "#dd5f4d";
    ctx.fillRect(px + 8, py + 20, 16, 5);
  }
}

function sceneDoors(scene) {
  const room = scene.room || defaultRoom;
  const doors = [];
  if (state.scene > 0) doors.push({ kind: "prev", x: room.x, y: room.y + Math.floor(room.h / 2), w: 1, h: 2 });
  if (state.scene < scenes.length - 1) doors.push({ kind: "next", x: room.x + room.w - 1, y: room.y + Math.floor(room.h / 2), w: 1, h: 2 });
  return doors;
}

function drawDoors(scene) {
  sceneDoors(scene).forEach((door) => {
    const unlocked = door.kind === "prev" || state.completed.has(state.scene);
    const active = door.kind === "next" && state.collected.has(state.scene) && !state.completed.has(state.scene);
    ctx.fillStyle = unlocked ? "#f4cb5f" : active ? "#315f9b" : "#58606a";
    ctx.strokeStyle = "#17212b";
    ctx.lineWidth = 4;
    ctx.fillRect(door.x * TILE, door.y * TILE, door.w * TILE, door.h * TILE);
    ctx.strokeRect(door.x * TILE + 2, door.y * TILE + 2, door.w * TILE - 4, door.h * TILE - 4);
    ctx.fillStyle = "#17212b";
    ctx.fillRect(door.x * TILE + 12, door.y * TILE + 24, 8, 8);
  });
}

function isDoorTile(x, y, scene) {
  return sceneDoors(scene).some((door) =>
    x >= door.x && x < door.x + door.w && y >= door.y && y < door.y + door.h
  );
}

function drawClue(clue) {
  ctx.fillStyle = state.collected.has(state.scene) ? "#4f7d4b" : "#f4cb5f";
  ctx.strokeStyle = "#17212b";
  ctx.lineWidth = 4;
  ctx.fillRect(clue.x * TILE + 5, clue.y * TILE + 5, TILE - 10, TILE - 10);
  ctx.strokeRect(clue.x * TILE + 5, clue.y * TILE + 5, TILE - 10, TILE - 10);
}

function drawNpc(npc) {
  drawSprite(npc.char, "down", 1, npc.x * TILE + 4, npc.y * TILE);
}

function truncateTag(value, limit = 18) {
  return value.length > limit ? `${value.slice(0, limit - 1)}...` : value;
}

function drawTag(tileX, tileY, label, variant) {
  const tagText = truncateTag(label);
  ctx.save();
  ctx.font = "700 11px IBM Plex Sans Thai, sans-serif";
  const paddingX = 6;
  const width = Math.min(154, Math.max(60, ctx.measureText(tagText).width + paddingX * 2));
  const height = 22;
  const x = Math.max(6, Math.min(canvas.width - width - 6, tileX * TILE + TILE / 2 - width / 2));
  const y = Math.max(6, tileY * TILE - 24);
  ctx.fillStyle = variant === "evidence" ? "#f4cb5f" : "#fff8db";
  ctx.strokeStyle = "#17212b";
  ctx.lineWidth = 3;
  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);
  ctx.fillStyle = "#111923";
  ctx.fillText(tagText, x + paddingX, y + 15);
  ctx.restore();
}

function drawEntityTags(scene) {
  drawTag(scene.npc.x, scene.npc.y, `${text("npcTag")}: ${scene.npc.name}`, "npc");
  drawTag(scene.clue.x, scene.clue.y, `${text("evidenceTag")}: ${scene.clue.label}`, "evidence");
}

function drawPlayer() {
  const p = state.player;
  drawSprite("detective", p.dir, p.frame, p.px + 4, p.py);
}

function drawSprite(char, dir, frame, x, y) {
  const sx = (dirCols[dir] * 3 + frame) * 24;
  const sy = charRows[char] * 32;
  ctx.drawImage(sprites, sx, sy, 24, 32, x, y, 24, 32);
}

function blocked(x, y) {
  const scene = scenes[state.scene];
  const room = scene.room || defaultRoom;
  const inside = x >= room.x && x < room.x + room.w && y >= room.y && y < room.y + room.h;
  const wall = x === room.x || x === room.x + room.w - 1 || y === room.y || y === room.y + room.h - 1;
  if (!inside || (wall && !isDoorTile(x, y, scene))) return true;
  if (x === scene.npc.x && y === scene.npc.y) return true;
  if ((scene.props || []).some((prop) =>
    prop.block !== false &&
    x >= prop.x && x < prop.x + prop.w &&
    y >= prop.y && y < prop.y + prop.h
  )) return true;
  return false;
}

function activeDirection() {
  if (state.keys.has("up")) return [0, -1, "up"];
  if (state.keys.has("down")) return [0, 1, "down"];
  if (state.keys.has("left")) return [-1, 0, "left"];
  if (state.keys.has("right")) return [1, 0, "right"];
  return [0, 0, state.player.dir];
}

function movePlayer(now, force = false, direction = null) {
  if (!dialogue.hidden || !dossier.hidden || !guideOverlay.hidden || state.mapOpen) return;
  if (!force && now - state.lastMove < 125) return;
  const p = state.player;
  const [dx, dy, dir] = direction || activeDirection();

  if (dx || dy) {
    p.dir = dir;
    const nx = p.x + dx;
    const ny = p.y + dy;
    if (!blocked(nx, ny)) {
      state.lastMove = now;
      p.x = nx;
      p.y = ny;
      p.px = nx * TILE;
      p.py = ny * TILE;
      p.frame = (p.frame + 1) % 3;
      maybeExit();
    }
  } else {
    p.frame = 1;
  }
}

function updatePlayer(now) {
  movePlayer(now, false);
}

function near(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) <= 2;
}

function interact() {
  if (!guideOverlay.hidden) return;
  if (state.mapOpen) {
    toggleMap();
    return;
  }
  if (!dossier.hidden) return;
  if (!dialogue.hidden) {
    nextDialogue();
    return;
  }
  const scene = scenes[state.scene];
  const p = state.player;
  if (near(p, scene.npc)) {
    openDialogue(scene.npc.name, scene.dialogue);
    return;
  }
  if (near(p, scene.clue)) {
    collectEvidence(scene);
    return;
  }
  showToast(text("noInteract"));
}

function openDialogue(speaker, lines) {
  state.dialogueLines = lines;
  state.dialogueIndex = 0;
  dialogueSpeaker.textContent = speaker;
  dialogueText.textContent = lines[0];
  dialogue.hidden = false;
}

function nextDialogue() {
  state.dialogueIndex += 1;
  if (state.dialogueIndex >= state.dialogueLines.length) {
    dialogue.hidden = true;
    return;
  }
  dialogueText.textContent = state.dialogueLines[state.dialogueIndex];
}

function collectEvidence(scene) {
  if (!state.collected.has(state.scene)) {
    state.collected.add(state.scene);
    showToast(text("savedEvidence"));
  } else {
    showToast(text("reopenEvidence"));
  }
  renderHud();
  openDossier(state.scene);
}

function maybeExit() {
  const scene = scenes[state.scene];
  const door = sceneDoors(scene).find((item) =>
    state.player.x >= item.x && state.player.x < item.x + item.w &&
    state.player.y >= item.y && state.player.y < item.y + item.h
  );
  if (!door) return;

  if (door.kind === "prev") {
    enterScene(state.scene - 1, "fromNext");
    return;
  }

  if (!state.completed.has(state.scene)) {
      if (state.collected.has(state.scene)) {
        showToast(text("checkpointBlocked"));
        openDossier(state.scene);
      } else {
        showToast(text("evidenceBlocked"));
      }
      state.player.x = door.x - 1;
      state.player.px = state.player.x * TILE;
      return;
  }
  enterScene(state.scene + 1, "fromPrev");
}

function enterScene(sceneIndex, spawn) {
  state.scene = Math.max(0, Math.min(sceneIndex, scenes.length - 1));
  resetPlayer(spawn);
  showToast(`${text("entering")} ${scenes[state.scene].title}`);
  renderHud();
}

function toggleMap() {
  if (!dialogue.hidden || !dossier.hidden || !guideOverlay.hidden) return;
  state.mapOpen = !state.mapOpen;
  showToast(state.mapOpen ? text("mapOpen") : text("mapClosed"));
}

function openManual() {
  guideMode = "manual";
  renderGuide();
  guideOverlay.hidden = false;
}

function closeGuide() {
  guideOverlay.hidden = true;
  manualToggle.hidden = false;
  guideMode = "intro";
  renderGuide();
  canvas.focus();
}

function drawWorldMap() {
  ctx.fillStyle = "rgba(17, 25, 35, 0.88)";
  ctx.fillRect(28, 38, canvas.width - 56, canvas.height - 76);
  ctx.strokeStyle = "#f4cb5f";
  ctx.lineWidth = 5;
  ctx.strokeRect(28, 38, canvas.width - 56, canvas.height - 76);

  ctx.fillStyle = "#fff8db";
  ctx.font = "700 20px IBM Plex Sans Thai, sans-serif";
  ctx.fillText(text("mapTitle"), 54, 76);
  ctx.font = "500 14px IBM Plex Sans Thai, sans-serif";
  ctx.fillText(text("mapHelp"), 54, 102);

  const startX = 70;
  const startY = 150;
  const gapX = 170;
  const gapY = 92;
  scenes.forEach((scene, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = startX + col * gapX;
    const y = startY + row * gapY;
    const completed = state.completed.has(index);
    const collected = state.collected.has(index);
    const current = index === state.scene;
    ctx.fillStyle = current ? "#f4cb5f" : completed ? "#4f7d4b" : collected ? "#315f9b" : "#263445";
    ctx.strokeStyle = current ? "#fff8db" : "#111923";
    ctx.lineWidth = 4;
    ctx.fillRect(x, y, 132, 54);
    ctx.strokeRect(x, y, 132, 54);
    if (index < scenes.length - 1 && col < 2) {
      ctx.fillStyle = state.completed.has(index) ? "#f4cb5f" : "#58606a";
      ctx.fillRect(x + 132, y + 24, gapX - 132, 6);
    }
    ctx.fillStyle = current ? "#111923" : "#fff8db";
    ctx.font = "700 12px IBM Plex Sans Thai, sans-serif";
    ctx.fillText(`${index + 1}. ${scene.name}`, x + 8, y + 20);
    ctx.font = "500 11px IBM Plex Sans Thai, sans-serif";
    ctx.fillText(completed ? text("stageDone") : collected ? text("stageEvidence") : current ? text("stageActive") : text("stageLocked"), x + 8, y + 40);
  });
}

let toastTimer = 0;
function showToast(text) {
  toast.textContent = text;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

function openDossier(sceneIndex) {
  const scene = scenes[sceneIndex];
  const file = caseFiles[sceneIndex];
  state.activeDossier = sceneIndex;
  dossierCode.textContent = scene.code;
  dossierTitle.textContent = file.title;
  evidenceDetail.innerHTML = file.rows.map(([label, value]) => `
    <div class="evidence-row">
      <strong>${label}</strong>
      <span>${value}</span>
    </div>
  `).join("");
  checkpointForm.innerHTML = file.questions.map((question, qIndex) => renderQuestion(question, qIndex, sceneIndex)).join("");
  checkpointResult.className = state.completed.has(sceneIndex) ? "ok" : "";
  checkpointResult.textContent = state.completed.has(sceneIndex)
    ? text("checkpointPassed")
    : text("answerEveryQuestion");
  dossier.hidden = false;
}

function closeDossierPanel() {
  dossier.hidden = true;
  state.activeDossier = null;
  canvas.focus();
}

function questionType(question) {
  return question.type || "single";
}

function isCompletedAnswer(question, cIndex) {
  if (questionType(question) === "multi") return question.answers.includes(cIndex);
  return cIndex === question.answer;
}

function renderQuestion(question, qIndex, sceneIndex) {
  const type = questionType(question);
  if (type === "text") {
    return `
      <fieldset class="checkpoint-question">
        <legend>${qIndex + 1}. ${question.q}</legend>
        <input class="checkpoint-text" type="text" name="q${qIndex}" value="" placeholder="${question.placeholder || ""}" autocomplete="off" required>
      </fieldset>
    `;
  }

  const inputType = type === "multi" ? "checkbox" : "radio";
  return `
    <fieldset class="checkpoint-question">
      <legend>${qIndex + 1}. ${question.q}</legend>
      ${question.choices.map((choice, cIndex) => `
        <label class="checkpoint-choice">
          <input type="${inputType}" name="q${qIndex}" value="${cIndex}" ${type === "single" ? "required" : ""}>
          <span>${choice}</span>
        </label>
      `).join("")}
    </fieldset>
  `;
}

function normalizeAnswer(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function textAnswerMatches(question, value) {
  const normalizedValue = normalizeAnswer(value);
  if (!normalizedValue) return false;
  return question.answers.some((answer) => {
    const normalizedAnswer = normalizeAnswer(answer);
    return normalizedValue === normalizedAnswer || normalizedValue.includes(normalizedAnswer);
  });
}

function checkpointAnswerIsCorrect(question, index, data) {
  const type = questionType(question);
  if (type === "text") return textAnswerMatches(question, data.get(`q${index}`));
  if (type === "multi") {
    const selected = data.getAll(`q${index}`).map(Number).sort((a, b) => a - b);
    const expected = [...question.answers].sort((a, b) => a - b);
    return selected.length === expected.length && selected.every((value, i) => value === expected[i]);
  }
  const selected = data.get(`q${index}`);
  return selected !== null && Number(selected) === question.answer;
}

function submitCheckpoint(event) {
  event.preventDefault();
  const sceneIndex = state.activeDossier;
  if (sceneIndex === null) return;
  const file = caseFiles[sceneIndex];
  const data = new FormData(checkpointForm);
  const wrong = [];
  file.questions.forEach((question, index) => {
    if (!checkpointAnswerIsCorrect(question, index, data)) wrong.push(index + 1);
  });
  if (wrong.length) {
    checkpointResult.className = "bad";
    checkpointResult.textContent = `${text("wrongPrefix")} ${wrong.join(", ")} ${text("wrongSuffix")}`;
    return;
  }
  state.completed.add(sceneIndex);
  clearCheckpointInputs();
  checkpointResult.className = "ok";
  checkpointResult.textContent = scenes[sceneIndex].completeText;
  showToast(scenes[sceneIndex].completeText);
  renderHud();
}

function clearCheckpointInputs() {
  checkpointForm.querySelectorAll("input").forEach((input) => {
    if (input.type === "radio" || input.type === "checkbox") {
      input.checked = false;
      return;
    }
    input.value = "";
  });
}

function isFormControlTarget(event) {
  const tagName = event.target?.tagName;
  return event.target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(tagName);
}

function inputName(event) {
  const codeMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    KeyW: "up",
    KeyS: "down",
    KeyA: "left",
    KeyD: "right",
    KeyE: "interact",
    KeyM: "map",
    Enter: "interact",
    NumpadEnter: "interact",
    Space: "interact"
  };
  if (codeMap[event.code]) return codeMap[event.code];
  const key = event.key.toLowerCase();
  const keyMap = {
    w: "up",
    s: "down",
    a: "left",
    d: "right",
    e: "interact",
    m: "map",
    enter: "interact",
    " ": "interact",
    spacebar: "interact",
    arrowup: "up",
    arrowdown: "down",
    arrowleft: "left",
    arrowright: "right"
  };
  return keyMap[key] || "";
}

function directionTuple(name) {
  if (name === "up") return [0, -1, "up"];
  if (name === "down") return [0, 1, "down"];
  if (name === "left") return [-1, 0, "left"];
  if (name === "right") return [1, 0, "right"];
  return null;
}

function renderHud() {
  const scene = scenes[state.scene];
  sceneStat.textContent = `${state.scene + 1}/${scenes.length}`;
  evidenceStat.textContent = String(state.collected.size);
  sceneCode.textContent = scene.code;
  sceneTitle.textContent = scene.title;
  objectiveText.textContent = state.completed.has(state.scene)
    ? state.scene === scenes.length - 1
      ? text("objectiveClearedFinal")
      : text("objectiveCleared")
    : state.collected.has(state.scene)
      ? text("objectiveCollected")
      : scene.objective;
  const collectedIndexes = [...state.collected].sort((a, b) => a - b);
  evidenceLog.innerHTML = collectedIndexes.length
    ? collectedIndexes.map((sceneIndex) => `
      <li>
        <button class="evidence-item ${state.completed.has(sceneIndex) ? "done" : ""}" type="button" data-evidence="${sceneIndex}">
          ${caseFiles[sceneIndex].title}<br>
          ${state.completed.has(sceneIndex) ? text("evidenceStatusDone") : text("evidenceStatusOpen")}
        </button>
      </li>
    `).join("")
    : `<li>${text("noEvidence")}</li>`;
  document.querySelectorAll("[data-evidence]").forEach((button) => {
    button.addEventListener("click", () => openDossier(Number(button.dataset.evidence)));
  });
  stageList.innerHTML = scenes.map((item, index) => {
    const done = state.completed.has(index);
    const collected = state.collected.has(index);
    const active = index === state.scene;
    return `<div class="stage-chip ${active ? "active" : ""} ${done ? "done" : ""}">
      <span>${index + 1}</span>
      <span>${item.name}<br>${done ? text("stageDone") : collected ? text("stageEvidence") : active ? text("stageActive") : text("stageLocked")}</span>
    </div>`;
  }).join("");
}

function loop(now) {
  updatePlayer(now || 0);
  drawScene();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  if (isFormControlTarget(event)) return;
  const key = inputName(event);
  if (key === "interact" && !guideOverlay.hidden) {
    event.preventDefault();
    closeGuide();
    return;
  }
  const direction = directionTuple(key);
  if (direction) {
    event.preventDefault();
    state.keys.add(key);
    movePlayer(performance.now(), !event.repeat, direction);
  }
  if (key === "interact") {
    event.preventDefault();
    interact();
  }
  if (key === "map") {
    event.preventDefault();
    toggleMap();
  }
  if (event.code === "Escape" && state.mapOpen) {
    state.mapOpen = false;
    showToast(text("mapClosed"));
  }
  if (event.code === "Escape" && !guideOverlay.hidden && !manualToggle.hidden) {
    closeGuide();
  }
  if (event.code === "Escape" && !dossier.hidden) {
    closeDossierPanel();
  }
});

window.addEventListener("keyup", (event) => {
  const key = inputName(event);
  if (key) state.keys.delete(key);
});

dialogueNext.addEventListener("click", nextDialogue);
closeDossier.addEventListener("click", closeDossierPanel);
checkpointForm.addEventListener("submit", submitCheckpoint);
consoleEl.addEventListener("pointerdown", () => canvas.focus());
guidePrimary.addEventListener("click", closeGuide);
manualToggle.addEventListener("click", openManual);
languageToggle.addEventListener("click", () => {
  applyLanguage(currentLanguage === "th" ? "en" : "th");
});
guideLanguageToggle.addEventListener("click", () => {
  applyLanguage(currentLanguage === "th" ? "en" : "th");
});

document.querySelectorAll("[data-control]").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    canvas.focus();
    const action = button.dataset.control;
    const direction = directionTuple(action);
    if (direction) {
      movePlayer(performance.now(), true, direction);
      return;
    }
    if (action === "interact") interact();
    if (action === "map") toggleMap();
  });
});

function startGame() {
  resetPlayer();
  renderHud();
  showToast(text("startToast"));
  if (guideOverlay.hidden) canvas.focus();
  loop();
}

if (sprites.complete) {
  startGame();
} else {
  sprites.addEventListener("load", startGame, { once: true });
}
