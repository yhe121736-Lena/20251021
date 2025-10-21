let forms = [];
let reStart = 60 * 5;
let toggle = 0;
let bgCol;
let fillCol;

// --- Menu Variables (Modified for sliding) ---
let menuOpen = false;
let menuWidth = 200;
let menuOptions = ["Work 1: Grid Grow", "Work 2: Spiral In", "Work 3: Wiggle"];
let selectedWork = 0;

// --- Menu Animation Variables (New) ---
let menuX = -menuWidth; // 初始位置在畫布左側外面
let menuTargetX = -menuWidth; // 目標位置

// --- Emoji Variables (New) ---
let currentEmoji = 0; 
// 索引 0: 開始的符號; 索引 1: 變化的符號
const emojis = ["(」・ω・)ノ", "(／・ω・)／"]; 

// --- 連結 URL ---
const WORK1_URL = "https://hackmd.io/@TFaNVhq_RxaTjbIlxMP6ww/Bkvxtu13gg";
const WORK2_URL = "https://yhe121736-lena.github.io/20251014/"; 

// --- 新增 IFRAME 容器變數 (用於子母畫面) ---
let iframeContainer;
// ------------------------------------------

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);

  // --- 創建 IFRAME 容器 (子母畫面) ---
  // 使用 p5.dom 函式創建 <iframe> HTML 元素
  iframeContainer = createElement('iframe');
  
  // 設定 CSS 樣式
  iframeContainer.style('position', 'absolute');
  iframeContainer.style('border', '5px solid #FFCC00'); // 邊框
  iframeContainer.style('border-radius', '10px');
  iframeContainer.style('width', '80%'); // 佔畫布寬度 80%
  iframeContainer.style('height', '80%'); // 佔畫布高度 80%
  iframeContainer.style('background-color', 'white');
  iframeContainer.style('z-index', '999'); // 確保在畫布和選單之上
  iframeContainer.attribute('allow', 'fullscreen'); // 允許全螢幕（如果內容支援）
  
  // 預設隱藏
  iframeContainer.hide();
  // ------------------------------------

  newForms();
}

function draw() {
  // --- Emoji Toggle (New 0.5s cycle) ---
  let periodFrame = frameCount % 60;
  if (periodFrame < 30) {
    currentEmoji = 0; // 顯示 (」・ω・)ノ
  } else {
    currentEmoji = 1; // 顯示 (／・ω・)／
  }

  // --- Color Toggle ---
  if (toggle == 0) {
    bgCol = color(0);
    fillCol = color(255);
  } else {
    bgCol = color(255);
    fillCol = color(0);
  }
  background(bgCol);

  // --- Animation Loop ---
  for (let i = 0; i < forms.length; i++) {
    forms[i].show();
    forms[i].move();
  }

  // --- Restart & Toggle ---
  if (frameCount % reStart == 0) {
    newForms();
    toggle = 1 - toggle;
  }
  
  // --- Menu Control and Animation (Sliding Effect) ---
  if (mouseX < 100) {
    menuOpen = true;
    menuTargetX = 0; // 滑入
  } else if (mouseX >= menuWidth + 20) {
    menuOpen = false;
    menuTargetX = -menuWidth; // 滑出
  }
  
  // Smoothly move the menu
  menuX = lerp(menuX, menuTargetX, 0.1); 
  
  // --- Draw Menu ---
  if (menuX > -menuWidth + 1) { // Only draw if the menu is visible
    drawMenu();
  }

  // --- 更新 IFRAME 位置 (維持在畫布中央) ---
  // left/top 都是畫布尺寸的 10% (因為 IFRAME 寬高為 80%)
  iframeContainer.position(width * 0.1, height * 0.1);
}

// --- Menu Functions ---
function drawMenu() {
  let menuY = 0;
  let optionHeight = 40;
  let padding = 10;
  let textX = menuX + padding;
  
  // Menu Background
  fill(0, 0, 0, 200);
  rectMode(CORNER);
  rect(menuX, menuY, menuWidth, height);
  rectMode(CENTER);

  textSize(16);
  textAlign(LEFT, CENTER);
  
  let textY = menuY + padding + optionHeight / 2 + 5;
  
  // 1. Draw Menu Options
  for (let i = 0; i < menuOptions.length; i++) {
    let optionY = menuY + i * optionHeight;
    
    // Check for mouse hover
    if (mouseX > menuX && mouseX < menuX + menuWidth && mouseY > optionY && mouseY < optionY + optionHeight) {
      fill(50, 50, 50); 
      rectMode(CORNER);
      rect(menuX, optionY, menuWidth, optionHeight);
      rectMode(CENTER);
    }
    
    // Highlight selected work
    if (i === selectedWork) {
      fill(255, 255, 0); 
    } else {
      fill(255); 
    }
    
    text(menuOptions[i], textX, textY + i * optionHeight);
  }

  // 2. Draw Dynamic Emoji
  let displayEmoji = emojis[currentEmoji];

  let menuHeight = menuOptions.length * optionHeight;
  let emojiY = menuHeight + 50; 
  
  textSize(24); 
  textAlign(CENTER, CENTER);
  fill(255); 

  text(displayEmoji, menuX + menuWidth / 2, emojiY);
  
  textAlign(LEFT, CENTER);
}

function mousePressed() {
  // 1. 處理選單點擊
  if (menuOpen && mouseX > menuX && mouseX < menuX + menuWidth) {
    let optionHeight = 40;
    let clickedOption = floor(mouseY / optionHeight);
    
    if (clickedOption >= 0 && clickedOption < menuOptions.length) {
      selectedWork = clickedOption;
      
      console.log("Selected Work: " + menuOptions[selectedWork]);
      
      // --- 啟動子母畫面的 IFRAME 邏輯 ---
      if (selectedWork === 0) { // Work 1: HackMD
        iframeContainer.attribute('src', WORK1_URL); // 設定來源
        iframeContainer.show(); // 顯示 IFRAME
      } else if (selectedWork === 1) { // Work 2: GitHub Page
        iframeContainer.attribute('src', WORK2_URL); // 設定來源
        iframeContainer.show(); // 顯示 IFRAME
      } else { // Work 3 或其他選項
        iframeContainer.hide(); // 隱藏 IFRAME
        iframeContainer.attribute('src', ''); // 清空 src
      }
      // ------------------------------------
      
      newForms(); 
      toggle = 0; 
      reStart = 60 * 5; 

      // 關閉選單
      menuOpen = false;
      menuTargetX = -menuWidth;
    }
  } 
  // 2. 處理點擊畫布空白處 (關閉子母畫面)
  else if (iframeContainer.elt.style.display !== 'none') {
    // 如果子母畫面是打開的，點擊畫布上的任何地方（除了選單）就關閉它
    iframeContainer.hide();
    iframeContainer.attribute('src', ''); // 清空 src
  }
}


// --- Form Generation Functions (Unchanged) ---
function tile() {
  let wc = int(random(1, 10));
  let hc = int(random(1, 10));
  let w = width / wc;
  let h = height / hc;

  for (let j = 0; j < hc; j++) {
    for (let i = 0; i < wc; i++) {
      forms.push(new Form(i * w + w / 2, j * h + h / 2, w + 1, h + 1));
    }
  }
}

function newForms() {
  forms.length = 0;
  tile();
}

// --- Form Class (Unchanged) ---
class Form {
  constructor(x, y, w, h) {
    this.tgtx = x;
    this.tgty = y;
    this.tgtw = w;
    this.tgth = h;
    this.sttx = random(width);
    this.stty = random(height);
    this.sttw = 0;
    this.stth = 0;
    this.px = 0;
    this.py = 0;
    this.pw = 0;
    this.ph = 0;
    this.t = -int(random(50, 150));
    this.endt = 100;
    this.tStep = 1;
  }

  show() {
    noStroke();
    fill(fillCol);
    rect(this.px, this.py, this.pw, this.ph);
  }

  move() {
    let mp = map(this.t, 0, this.endt, 0, 1);
    let easing = mp * 2 - sq(mp);
    
    if (mp > 1) {
        easing = 1;
    }

    if (this.t > 0) {
      this.px = lerp(this.sttx, this.tgtx, easing);
      this.py = lerp(this.stty, this.tgty, easing);
      this.pw = lerp(this.sttw, this.tgtw, easing);
      this.ph = lerp(this.stth, this.tgth, easing);
    } else {
      this.px = this.sttx;
      this.py = this.stty;
      this.pw = this.sttw;
      this.ph = this.stth;
    }

    if (this.t < this.endt) {
      this.t += this.tStep;
    }
  }
}