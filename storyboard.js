const scenes = [
  {
    code: "SCENE 01",
    title: "ห้องผู้กำกับ: คำสั่งคดี Chain Trail",
    world: "office",
    goal: "ผู้กำกับเรียกตัวผู้เล่นเข้าห้อง หลังได้รับแจ้งว่ามีเงินต้องสงสัยถูกโยกผ่านหลาย chain และอาจโยงกับ VASP",
    dialog: "ผู้กำกับ: เริ่มจาก BTC address และ Binance withdrawal TXID นี้ ตามเส้นทางให้ถึงปลายทาง พร้อมหลักฐานที่ตรวจซ้ำได้",
    actions: ["รับ Case File", "เปิด evidence board", "รับ TXID และ address ตั้งต้น"],
    checkpoint: "เริ่ม Stage 1 ด้วย Binance withdrawal TXID",
    unlock: "ปลดล็อกหน้าด่าน Binance Counter",
    props: [
      ["prop", 12, 14, 150, 88],
      ["prop", 55, 28, 132, 64],
      ["npc", 62, 48],
      ["player", 47, 70],
      ["clue-node", 24, 50]
    ]
  },
  {
    code: "SCENE 02",
    title: "Binance Counter: TXID ข้าม chain",
    world: "exchange",
    goal: "ผู้เล่นคุยกับเจ้าหน้าที่ exchange NPC เพื่อยืนยันว่า TXID อยู่บน chain ไหน และ fee เท่าไร",
    dialog: "เจ้าหน้าที่: TXID เดียวกันเปิดผิด explorer แล้วจะเหมือนไม่พบธุรกรรม เลือก chain ให้ถูกก่อน",
    actions: ["ลองเปิด TXID บน explorer หลาย chain", "ระบุ BNB Smart Chain", "บันทึก fee, receiving address, block"],
    checkpoint: "Chain = BNB Smart Chain, Fee = 0.00021 BNB, To = 0x4ce9...",
    unlock: "ประตูไป BSC Market เปิด",
    props: [
      ["prop", 10, 20, 185, 84],
      ["prop", 62, 16, 95, 132],
      ["npc", 68, 42],
      ["player", 44, 66],
      ["clue-node", 26, 38]
    ]
  },
  {
    code: "SCENE 03",
    title: "BSC Market: ร้าน PancakeSwap",
    world: "market",
    goal: "ผู้เล่นเดินเข้า market map เพื่อดู BEP-20 token activity และค้นหา token ที่ถูก swap",
    dialog: "แม่ค้า DEX: ถ้าดูแค่ BNB balance จะพลาด token trail ดู BEP-20 Token Txns ด้วย",
    actions: ["คุยกับ DEX NPC", "เปิด token page", "ระบุ EGC / EverGrow Coin และจำนวน"],
    checkpoint: "Service = PancakeSwap, Token = EGC, Amount = 258,000,000 EGC",
    unlock: "ได้ Transit Pass ไป Ethereum Station",
    props: [
      ["prop", 14, 20, 105, 96],
      ["prop", 58, 22, 120, 92],
      ["npc", 61, 53],
      ["player", 35, 70],
      ["clue-node", 79, 38]
    ]
  },
  {
    code: "SCENE 04",
    title: "Ethereum Station: Approval Gate",
    world: "station",
    goal: "สถานีนี้สอนแยก approve, swap, bridge ผู้เล่นต้องอ่าน method และ sum gas เฉพาะ approval",
    dialog: "นายสถานี: Approval ไม่ใช่เงินออกจริง แต่เป็นประตูที่อนุญาตให้ contract ขยับ asset ได้",
    actions: ["หา ETH จาก Coinbase", "รวม approval gas", "ตาม bridge deposit ไป Polygon"],
    checkpoint: "Coinbase ETH, approval gas total, WETH approvals, Polygon bridge TX",
    unlock: "ขึ้นเรือไป Polygon Harbor",
    props: [
      ["prop", 20, 18, 220, 48],
      ["prop", 22, 45, 76, 100],
      ["npc", 30, 52],
      ["player", 48, 70],
      ["clue-node", 74, 40]
    ]
  },
  {
    code: "SCENE 05",
    title: "Polygon Harbor: NFT Gallery",
    world: "harbor",
    goal: "ผู้เล่นสำรวจท่าเรือ Polygon และเข้า NFT Gallery เพื่อหา identity clue จาก OpenSea profile",
    dialog: "ภัณฑารักษ์: รูป NFT เป็น clue ได้ แต่ยังไม่ใช่ตัวตนตามกฎหมาย อย่า overclaim",
    actions: ["เปิด metadata/image", "ระบุ Anakin Skywalker image", "หา OpenSea username"],
    checkpoint: "NFT clue = Anakin Skywalker, Username = h2dajeffers",
    unlock: "เปิดแผนที่ไป Victim Apartment",
    props: [
      ["prop", 16, 20, 96, 96],
      ["prop", 58, 18, 116, 122],
      ["npc", 62, 55],
      ["player", 38, 72],
      ["clue-node", 24, 36]
    ]
  },
  {
    code: "SCENE 06",
    title: "Victim Apartment: คืนเกิดเหตุ",
    world: "apartment",
    goal: "ผู้เล่นตรวจ timeline หลัง 17 Nov 2021 เพื่อแยกธุรกรรมก่อน/หลัง incident และหา suspect",
    dialog: "เหยื่อ: มี ETH ถูกฝากเข้ามานิดหนึ่งก่อน asset จะถูกดึงออกไป เหมือนคนร้ายเติม gas ให้ wallet",
    actions: ["แยก timeline", "หา suspect address", "ระบุ ETH/BEZOGE/MATIC/EDGELON", "อ่าน failed BEZOGE amount"],
    checkpoint: "Suspect = 0xe89a..., assets และ failed BEZOGE amount ถูกต้อง",
    unlock: "ตามรอยไป Suspect Alley",
    props: [
      ["prop", 18, 18, 120, 80],
      ["prop", 62, 58, 110, 70],
      ["npc", 25, 54],
      ["player", 50, 72],
      ["clue-node", 77, 44]
    ]
  },
  {
    code: "SCENE 07",
    title: "Suspect Alley: BEZOGE Swap",
    world: "hideout",
    goal: "ผู้เล่นไล่ลำดับ failed → approve → swap → outbound เพื่อหา exchange destination",
    dialog: "สายข่าว: ถ้าจับลำดับผิด จะเห็นเหมือนเงินหายไปเฉย ๆ ต้องดู block และ tx ต่อเนื่องกัน",
    actions: ["หา BEZOGE approval block", "อ่าน swap ETH received", "ตาม outbound ถึง WhiteBIT"],
    checkpoint: "Approval block = 13633971, swap = 24.856694615839375838 ETH, exchange = WhiteBIT",
    unlock: "ขอหมายค้นข้อมูล VASP Records Office",
    props: [
      ["prop", 15, 26, 88, 118],
      ["prop", 65, 18, 120, 96],
      ["npc", 70, 54],
      ["player", 38, 72],
      ["clue-node", 58, 38]
    ]
  },
  {
    code: "SCENE 08",
    title: "VASP Records Office: Off-chain Pivot",
    world: "records",
    goal: "ผู้เล่นวิเคราะห์ exchange response เพื่อเชื่อม on-chain suspect กับ account identity โดยมี PII guard",
    dialog: "เจ้าหน้าที่ VASP: อ่าน Customer Information, KYC Documents และ Order History แต่อย่าฟันธงตัวบุคคลโดยไม่มี verification เพิ่ม",
    actions: ["อ่าน User ID/KYC", "สรุป ETH/USDT in-out", "หา USDT outbound 2 ก้อนใหญ่", "เขียน caveat"],
    checkpoint: "User ID, activity window, ETH/USDT totals, top USDT outbounds, caveat ครบ",
    unlock: "กลับสำนักงานเพื่อเขียน Final Case Report",
    props: [
      ["prop", 14, 16, 210, 70],
      ["prop", 20, 55, 80, 98],
      ["npc", 74, 48],
      ["player", 44, 72],
      ["clue-node", 28, 36]
    ]
  },
  {
    code: "SCENE 09",
    title: "War Room: Final Case Report",
    world: "court",
    goal: "ฉากจบ ผู้เล่นเรียงหลักฐานเป็น timeline และรายงานปิดคดีต่อผู้กำกับ/ทีม review",
    dialog: "ผู้กำกับ: คำตอบถูกยังไม่พอ รายงานต้องทำให้คนอื่นเปิดหลักฐานตรวจซ้ำได้ทุกจุด",
    actions: ["สรุป timeline", "ทำ evidence map", "แยก on-chain proof/off-chain pivot", "เสนอ next action"],
    checkpoint: "ส่ง final report ได้ 150 คะแนนเต็มเมื่อ evidence, reasoning และ caveat ครบ",
    unlock: "End screen: Case cleared / Needs review ตามคะแนน",
    props: [
      ["prop", 12, 18, 210, 82],
      ["prop", 54, 52, 120, 74],
      ["npc", 62, 46],
      ["player", 45, 72],
      ["clue-node", 78, 30]
    ]
  }
];

const world = document.getElementById("pixelWorld");
const dialog = document.getElementById("sceneDialog");
const code = document.getElementById("sceneCode");
const title = document.getElementById("sceneTitle");
const goal = document.getElementById("sceneGoal");
const actions = document.getElementById("sceneActions");
const checkpoint = document.getElementById("sceneCheckpoint");
const unlock = document.getElementById("sceneUnlock");
const chapters = [...document.querySelectorAll(".chapter")];
const cardGrid = document.getElementById("cardGrid");

function renderScene(index) {
  const scene = scenes[index];
  world.className = `pixel-world ${scene.world}`;
  world.innerHTML = "";
  scene.props.forEach(([kind, x, y, w, h]) => {
    const el = document.createElement("div");
    el.className = kind;
    el.style.left = `${x}%`;
    el.style.top = `${y}%`;
    if (w) el.style.width = `${w}px`;
    if (h) el.style.height = `${h}px`;
    world.appendChild(el);
  });
  dialog.innerHTML = `<strong>${scene.code}</strong><br>${scene.dialog}`;
  code.textContent = scene.code;
  title.textContent = scene.title;
  goal.textContent = scene.goal;
  actions.innerHTML = scene.actions.map((item) => `<li>${item}</li>`).join("");
  checkpoint.textContent = scene.checkpoint;
  unlock.textContent = scene.unlock;
  chapters.forEach((button, i) => button.classList.toggle("active", i === index));
}

function renderCards() {
  cardGrid.innerHTML = scenes.map((scene, index) => `
    <article class="story-card">
      <div class="mini-screen ${scene.world}">
        <div class="player" style="left:34%;top:56%"></div>
        <div class="npc" style="left:58%;top:36%"></div>
        <div class="clue-node" style="left:72%;top:62%"></div>
      </div>
      <span class="pixel-label">${scene.code}</span>
      <h3>${scene.title}</h3>
      <p>${scene.goal}</p>
      <button class="chapter" data-card-scene="${index}">VIEW SCENE</button>
    </article>
  `).join("");
  document.querySelectorAll("[data-card-scene]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.cardScene);
      renderScene(index);
      document.querySelector(".scene-reader").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

chapters.forEach((button) => {
  button.addEventListener("click", () => renderScene(Number(button.dataset.scene)));
});

renderScene(0);
renderCards();
