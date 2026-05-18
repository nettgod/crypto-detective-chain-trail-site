const questions = [
  {
    q: "ถ้าได้รับ transaction hash แล้วเปิดบน Etherscan ไม่เจอ ควรทำอะไรก่อนสรุปว่า tx ไม่มีจริง?",
    choices: ["ลองเปิดบน explorer ของ chain อื่น", "เปลี่ยน address ใหม่ทันที", "สรุปว่า hash ปลอม", "ดูเฉพาะ Twitter/OSINT"],
    answer: 0,
    explain: "TX hash ต้องเปิดบน explorer ของ chain ที่ถูกต้อง เช่น BscScan, Etherscan, PolygonScan"
  },
  {
    q: "หลักฐานขั้นต่ำของคำตอบเชิง transaction ควรมีอะไร?",
    choices: ["ชื่อเหรียญอย่างเดียว", "chain, tx hash, block, value และ reasoning", "screenshot อย่างเดียว", "ชื่อ exchange อย่างเดียว"],
    answer: 1,
    explain: "งาน investigation ต้องตรวจซ้ำได้ จึงต้องมีข้อมูลอ้างอิงครบ"
  },
  {
    q: "Gas fee โดยทั่วไปคำนวณจากอะไร?",
    choices: ["token amount x token price", "gas used x gas price", "block number x nonce", "address balance x fee rate"],
    answer: 1,
    explain: "บน EVM chain ค่า fee มาจาก gas used คูณ gas price หรือ effective gas price"
  },
  {
    q: "Approval transaction หมายถึงอะไร?",
    choices: ["เงินถูกโอนออกแล้วเสมอ", "การอนุญาตให้ contract ใช้ token ภายใต้เงื่อนไข", "การสร้าง wallet ใหม่", "การยืนยัน KYC"],
    answer: 1,
    explain: "approve เป็น permission ไม่ใช่ token transfer จริงโดยตัวมันเอง"
  },
  {
    q: "ถ้าดูเฉพาะ native balance เช่น ETH/BNB อาจพลาดอะไร?",
    choices: ["ERC-20/BEP-20 token transfers", "block timestamp", "gas price", "chain name"],
    answer: 0,
    explain: "asset จำนวนมากอยู่ใน token transfer tab ไม่ใช่ native balance"
  },
  {
    q: "DEX swap trail ควรดูอะไรประกอบ?",
    choices: ["router/service, token in/out และ event logs", "สีของเว็บไซต์", "จำนวน follower", "เฉพาะ wallet name"],
    answer: 0,
    explain: "การยืนยัน swap ต้องดู service/router และ token movement"
  },
  {
    q: "Bridge transaction ใช้บอกอะไรในคดีนี้?",
    choices: ["การเปลี่ยน device", "การเคลื่อน flow ข้าม chain", "การยืนยันตัวตน", "การยกเลิก transaction"],
    answer: 1,
    explain: "bridge คือ clue สำคัญเมื่อเงินหรือ asset ย้ายจาก chain หนึ่งไปอีก chain"
  },
  {
    q: "NFT/OpenSea username ควรถูกใช้เป็นหลักฐานแบบใด?",
    choices: ["proof ระบุตัวบุคคลทันที", "OSINT clue หรือ pivot", "หลักฐาน KYC ที่สมบูรณ์", "แทน transaction hash ได้"],
    answer: 1,
    explain: "username เป็น clue ไม่ใช่ legal attribution"
  },
  {
    q: "ในคดี hack ทำไม suspect อาจฝาก ETH เข้า victim wallet ก่อน?",
    choices: ["เพื่อเพิ่มราคาตลาด", "เพื่อใช้เป็น gas fees สำหรับ transaction ต่อ", "เพื่อปิด wallet", "เพื่อเปลี่ยน chain id"],
    answer: 1,
    explain: "ถ้า victim wallet ไม่มี gas คนร้ายอาจเติม gas เพื่อให้ทำ approve/transfer/swap ได้"
  },
  {
    q: "เมื่อตาม asset หลัง incident date ควรระวังอะไร?",
    choices: ["เอาธุรกรรมก่อน incident มาปนโดยไม่แยก scope", "ดูเฉพาะธุรกรรม failed", "ไม่ต้องดูเวลา", "ไม่ต้องดู block"],
    answer: 0,
    explain: "timeline scope สำคัญมาก ต้องแยกก่อน/หลังเหตุการณ์"
  },
  {
    q: "VASP response ช่วยเพิ่มหลักฐานด้านใด?",
    choices: ["off-chain account/KYC/order history pivot", "block mining difficulty", "NFT image quality", "browser cookie"],
    answer: 0,
    explain: "VASP report ช่วยเชื่อม on-chain flow กับ account activity นอก chain"
  },
  {
    q: "ทำไมไม่ควรสรุปทันทีว่า KYC name คือคนร้าย?",
    choices: ["KYC อาจเป็น stolen identity หรือ mule account", "KYC ไม่มีประโยชน์เลย", "เพราะ blockchain ไม่มี timestamp", "เพราะ token transfer ไม่ตรวจได้"],
    answer: 0,
    explain: "ต้อง verify authenticity เพิ่มก่อน attribution ต่อบุคคล"
  },
  {
    q: "ถ้าคำตอบถูกแต่ไม่มี evidence link ควรให้คะแนนอย่างไรตามแนว workshop?",
    choices: ["เต็มคะแนน", "ไม่เกินครึ่งคะแนน", "เพิ่มคะแนนพิเศษ", "ไม่ต้องตรวจ reasoning"],
    answer: 1,
    explain: "หลัก evidence-first คือไม่มีหลักฐานต้อง cap คะแนน"
  },
  {
    q: "Exchange destination ควรยืนยันจากอะไร?",
    choices: ["เดาจากชื่อ wallet", "routing/deposit address/evidence ที่ตรวจซ้ำได้", "โลโก้บนเว็บ", "ชื่อ token อย่างเดียว"],
    answer: 1,
    explain: "ปลายทาง exchange ต้องยืนยันด้วยเส้นทางและ evidence"
  },
  {
    q: "Final report ที่ดีควรทำอะไรได้?",
    choices: ["ทำให้ reviewer เปิดหลักฐานตรวจซ้ำได้", "เล่าเฉพาะคำตอบสุดท้าย", "ซ่อน tx hash เพื่อกันโกง", "ใช้ screenshot อย่างเดียว"],
    answer: 0,
    explain: "รายงานปิดคดีต้องมี timeline, evidence map, reasoning และ caveat"
  }
];

const startQuizBtn = document.getElementById("startQuizBtn");
const quizPanel = document.getElementById("quizPanel");
const quizForm = document.getElementById("quizForm");
const template = document.getElementById("questionTemplate");
const liveScore = document.getElementById("liveScore");
const resultPanel = document.getElementById("resultPanel");
const gameUnlock = document.getElementById("gameUnlock");
const resetQuizBtn = document.getElementById("resetQuizBtn");

function renderQuiz() {
  quizForm.innerHTML = "";
  questions.forEach((question, index) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.dataset.index = String(index);
    card.querySelector("legend").textContent = `${index + 1}. ${question.q}`;
    const choices = card.querySelector(".choices");
    choices.innerHTML = question.choices.map((choice, choiceIndex) => `
      <label class="choice">
        <input type="radio" name="q${index}" value="${choiceIndex}" required>
        <span>${choice}</span>
      </label>
    `).join("");
    card.querySelector(".explain").textContent = question.explain;
    quizForm.appendChild(card);
  });
}

function gradeQuiz(event) {
  event.preventDefault();
  let score = 0;
  questions.forEach((question, index) => {
    const value = Number(new FormData(quizForm).get(`q${index}`));
    const card = quizForm.querySelector(`[data-index="${index}"]`);
    const explain = card.querySelector(".explain");
    const ok = value === question.answer;
    if (ok) score += 1;
    card.classList.toggle("correct", ok);
    card.classList.toggle("wrong", !ok);
    explain.hidden = false;
  });
  liveScore.textContent = `${score}/${questions.length}`;
  resultPanel.hidden = false;
  const passed = score >= 12;
  resultPanel.innerHTML = passed
    ? `<strong>ผ่าน ${score}/${questions.length}</strong><br>ปลดล็อกเกมสืบสวนแล้ว`
    : `<strong>ยังไม่ผ่าน ${score}/${questions.length}</strong><br>ทบทวนข้อที่ผิดแล้วลองใหม่ เป้าหมายขั้นต่ำคือ 12/15`;
  gameUnlock.hidden = !passed;
  if (passed) gameUnlock.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetQuiz() {
  quizForm.reset();
  liveScore.textContent = `0/${questions.length}`;
  resultPanel.hidden = true;
  gameUnlock.hidden = true;
  document.querySelectorAll(".question-card").forEach((card) => {
    card.classList.remove("correct", "wrong");
    card.querySelector(".explain").hidden = true;
  });
}

startQuizBtn.addEventListener("click", () => {
  quizPanel.hidden = false;
  quizPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

quizForm.addEventListener("submit", gradeQuiz);
resetQuizBtn.addEventListener("click", resetQuiz);

renderQuiz();
