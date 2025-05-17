// آدرس قرارداد و آدرس سازنده
const contractAddress = "0x5Bf4F9E5B09B8bE4078fcC4Ca778A5Cb51E67035";
const creatorAddress = "0xYourCreatorAddressHere"; // آدرس خودت رو اینجا بذار

// ABI قرارداد
const contractAbi = [
  {
    "inputs": [{"internalType": "address", "name": "_starter", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "upline", "type": "address"},
      {"indexed": false, "internalType": "bool", "name": "placeOnLeft", "type": "bool"}
    ],
    "name": "Registered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "cycleId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "caller", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "Withdrawn",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "acceptOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentCycleId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentCycleDuration",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPoolBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "userAddress", "type": "address"}],
    "name": "getUser",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "address", "name": "wallet", "type": "address"},
      {"internalType": "address", "name": "upline", "type": "address"},
      {"internalType": "address", "name": "left", "type": "address"},
      {"internalType": "address", "name": "right", "type": "address"},
      {"internalType": "uint256", "name": "balanceCount", "type": "uint256"},
      {"internalType": "uint256", "name": "lastBalanceReset", "type": "uint256"},
      {"internalType": "uint256", "name": "cycleBalanceCount", "type": "uint256"},
      {"internalType": "uint256", "name": "savedBalanceCount", "type": "uint256"},
      {"internalType": "uint256", "name": "leftCount", "type": "uint256"},
      {"internalType": "uint256", "name": "rightCount", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "upline", "type": "address"},
      {"internalType": "bool", "name": "placeOnLeft", "type": "bool"}
    ],
    "name": "register",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "cycleId", "type": "uint256"}],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// متغیرهای گلوبال
let provider;
let signer;
let contract;
let userAccount;
let walletProvider;
let isInWalletApp = false;

// تشخیص محیط اپلیکیشن کیف پول
function detectWalletApp() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("metamask") || userAgent.includes("coinbase") || userAgent.includes("trust")) {
    isInWalletApp = true;
  }
}

// متن‌ها برای زبان‌ها
const translations = {
  fa: {
    title: "PToken DApp",
    connect: "اتصال به کیف پول",
    disconnect: "قطع اتصال",
    account: "آدرس شما: ",
    registerTitle: "ثبت‌نام",
    leftLabel: "سمت چپ",
    rightLabel: "سمت راست",
    userInfoTitle: "اطلاعات کاربر",
    treeTitle: "ساختار درختی",
    adTitle: "تبلیغات",
    adLinkPlaceholder: "لینک تبلیغ",
    adDescPlaceholder: "توضیحات تبلیغ",
    saveAd: "ذخیره تبلیغ",
    successRegister: "موفقیت: ثبت‌نام انجام شد",
    errorConnection: "خطا: ",
    errorRegister: "خطا: ",
    errorUserInfo: "خطا در گرفتن اطلاعات: ",
    errorTree: "خطا در نمایش درخت: ",
    installMetaMask: "لطفاً کیف پول را نصب کنید یا از مرورگر داخلی کیف پول استفاده کنید!",
    invalidUpline: "خطا: آدرس آپلاین نامعتبر است",
    noTree: "درختی برای نمایش وجود ندارد.",
    adRestricted: "فقط سازنده DApp می‌تواند تبلیغ بگذارد!"
  },
  ar: {
    title: "تطبيق PToken",
    connect: "توصيل بالمحفظة",
    disconnect: "فصل المحفظة",
    account: "عنوانك: ",
    registerTitle: "التسجيل",
    leftLabel: "الجانب الأيسر",
    rightLabel: "الجانب الأيمن",
    userInfoTitle: "معلومات المستخدم",
    treeTitle: "الهيكل الشجري",
    adTitle: "الإعلانات",
    adLinkPlaceholder: "رابط الإعلان",
    adDescPlaceholder: "وصف الإعلان",
    saveAd: "حفظ الإعلان",
    successRegister: "نجاح: تم التسجيل",
    errorConnection: "خطأ: ",
    errorRegister: "خطأ: ",
    errorUserInfo: "خطأ في جلب المعلومات: ",
    errorTree: "خطأ في عرض الشجرة: ",
    installMetaMask: "يرجى تثبيت المحفظة أو استخدام متصفح المحفظة الداخلي!",
    invalidUpline: "خطأ: عنوان الراعي غير صالح",
    noTree: "لا يوجد شجرة للعرض.",
    adRestricted: "فقط مبدع التطبيق يمكنه وضع الإعلانات!"
  },
  en: {
    title: "PToken DApp",
    connect: "Connect Wallet",
    disconnect: "Disconnect Wallet",
    account: "Your address: ",
    registerTitle: "Register",
    leftLabel: "Left Side",
    rightLabel: "Right Side",
    userInfoTitle: "User Information",
    treeTitle: "Tree Structure",
    adTitle: "Advertisements",
    adLinkPlaceholder: "Ad Link",
    adDescPlaceholder: "Ad Description",
    saveAd: "Save Ad",
    successRegister: "Success: Registration completed",
    errorConnection: "Error: ",
    errorRegister: "Error: ",
    errorUserInfo: "Error fetching information: ",
    errorTree: "Error displaying tree: ",
    installMetaMask: "Please install a wallet or use the wallet's built-in browser!",
    invalidUpline: "Error: Upline address is invalid",
    noTree: "No tree to display.",
    adRestricted: "Only the DApp creator can add advertisements!"
  }
};

// تنظیم زبان پیش‌فرض
let currentLanguage = 'fa';
function changeLanguage() {
  currentLanguage = document.getElementById("language").value;
  updateTexts();
}

function updateTexts() {
  const t = translations[currentLanguage];
  document.querySelector(".title").textContent = t.title;
  document.getElementById("connect-btn").textContent = t.connect;
  document.getElementById("disconnect-btn").textContent = t.disconnect;
  document.getElementById("register-title").textContent = t.registerTitle;
  document.getElementById("left-label").textContent = t.leftLabel;
  document.getElementById("right-label").textContent = t.rightLabel;
  document.getElementById("user-info-title").textContent = t.userInfoTitle;
  document.getElementById("tree-title").textContent = t.treeTitle;
  document.getElementById("ad-title").textContent = t.adTitle;
  document.getElementById("ad-link").placeholder = t.adLinkPlaceholder;
  document.getElementById("ad-description").placeholder = t.adDescPlaceholder;
  document.getElementById("save-ad-btn").textContent = t.saveAd;
}

// انتخاب کیف پول
function selectWalletProvider() {
  walletProvider = document.getElementById("wallet-provider").value;
}

// تابع اتصال به کیف پول
async function connectWallet() {
  if (typeof window.ethers === 'undefined') {
    document.getElementById("message").innerText = translations[currentLanguage].errorConnection + "ethers.js لود نشده است.";
    return;
  }

  if (walletProvider === "metamask" && window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
  } else if (walletProvider === "walletconnect") {
    const WalletConnectProvider = window.WalletConnectProvider.default;
    provider = new ethers.providers.Web3Provider(new WalletConnectProvider({ infuraId: "YOUR_INFURA_ID" }));
    await provider.send("eth_requestAccounts", []);
  } else if (walletProvider === "coinbase" && window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
  } else {
    document.getElementById("message").innerText = translations[currentLanguage].installMetaMask;
    return;
  }

  signer = provider.getSigner();
  userAccount = await signer.getAddress();
  document.getElementById("account").innerText = translations[currentLanguage].account + userAccount;
  document.getElementById("connect-btn").style.display = "none";
  document.getElementById("disconnect-btn").style.display = "inline-block";
  document.getElementById("register-section").style.display = "block";
  document.getElementById("ad-section").style.display = "block";
  document.getElementById("save-ad-btn").style.display = userAccount.toLowerCase() === creatorAddress.toLowerCase() ? "inline-block" : "none";

  contract = new ethers.Contract(contractAddress, contractAbi, signer);
  await fetchUserInfo();
  await displayTree();
  document.getElementById("wallet-section").classList.add("connected");
}

// تابع قطع اتصال
function disconnectWallet() {
  document.getElementById("wallet-section").classList.remove("connected");
  document.getElementById("wallet-section").classList.add("disconnected");
  setTimeout(() => {
    provider = null;
    signer = null;
    contract = null;
    userAccount = null;
    document.getElementById("account").innerText = "";
    document.getElementById("connect-btn").style.display = "inline-block";
    document.getElementById("disconnect-btn").style.display = "none";
    document.getElementById("register-section").style.display = "none";
    document.getElementById("user-info").style.display = "none";
    document.getElementById("tree-section").style.display = "none";
    document.getElementById("ad-section").style.display = "none";
    document.getElementById("save-ad-btn").style.display = "none";
    document.getElementById("message").innerText = "";
    document.getElementById("tree").innerHTML = "";
    document.getElementById("ad-display").innerHTML = "";
    document.getElementById("wallet-section").classList.remove("disconnected");
  }, 500);
}

// تابع گرفتن اطلاعات کاربر
async function fetchUserInfo() {
  if (contract && userAccount) {
    const user = await contract.getUser(userAccount);
    document.getElementById("user-info").style.display = "block";
    document.getElementById("user-id").innerText = user.id.toString();
    document.getElementById("user-upline").innerText = user.upline;
    document.getElementById("left-count").innerText = user.leftCount.toString();
    document.getElementById("right-count").innerText = user.rightCount.toString();
    document.getElementById("balance-count").innerText = user.balanceCount.toString();
    document.getElementById("saved-balance-count").innerText = user.savedBalanceCount.toString();
  }
}

// تابع ثبت‌نام
async function register() {
  const uplineAddress = document.getElementById("upline-address").value;
  const placeOnLeft = document.querySelector('input[name="place"]:checked').value === "left";

  if (!ethers.utils.isAddress(uplineAddress)) {
    document.getElementById("message").innerText = translations[currentLanguage].invalidUpline;
    return;
  }

  try {
    const tx = await contract.register(uplineAddress, placeOnLeft, {
      value: ethers.utils.parseEther("350"),
      gasLimit: 300000
    });
    await tx.wait();
    document.getElementById("message").innerText = translations[currentLanguage].successRegister;
    await fetchUserInfo();
    await displayTree();
  } catch (err) {
    document.getElementById("message").innerText = translations[currentLanguage].errorRegister + (err.message || "تراکنش رد شد");
  }
}

// تابع نمایش ساختار درختی باینری
async function displayTree() {
  if (!contract || !userAccount) return;

  document.getElementById("tree-section").style.display = "block";
  const treeDiv = document.getElementById("tree");
  treeDiv.innerHTML = "";

  async function buildBinaryTree(userAddress, depth = 0) {
    if (!userAddress || userAddress === "0x0000000000000000000000000000000000000000") return "";

    const user = await contract.getUser(userAddress);
    const indent = " ".repeat(depth * 4);
    let treeHTML = `${indent}<div class="tree-node">`;
    treeHTML += `${indent}  <span class="node-address">آدرس: ${userAddress}</span><br>`;
    treeHTML += `${indent}  <span class="node-id">شناسه: ${user.id.toString()}</span><br>`;
    treeHTML += `${indent}  <span class="node-upline">آپلاین: ${user.upline}</span><br>`;

    treeHTML += `${indent}  <div class="tree-branch left">`;
    treeHTML += `${indent}    <span class="branch-label">سمت چپ:</span><br>`;
    treeHTML += await buildBinaryTree(user.left, depth + 1);
    treeHTML += `${indent}  </div>`;

    treeHTML += `${indent}  <div class="tree-branch right">`;
    treeHTML += `${indent}    <span class="branch-label">سمت راست:</span><br>`;
    treeHTML += await buildBinaryTree(user.right, depth + 1);
    treeHTML += `${indent}  </div>`;

    treeHTML += `${indent}</div>`;
    return treeHTML;
  }

  try {
    const treeHTML = await buildBinaryTree(userAccount);
    treeDiv.innerHTML = treeHTML || translations[currentLanguage].noTree;
  } catch (err) {
    treeDiv.innerHTML = translations[currentLanguage].errorTree + err.message;
  }
}

// تابع ذخیره تبلیغ
function saveAd() {
  if (userAccount.toLowerCase() !== creatorAddress.toLowerCase()) {
    document.getElementById("message").innerText = translations[currentLanguage].adRestricted;
    return;
  }

  const adLink = document.getElementById("ad-link").value;
  const adDesc = document.getElementById("ad-description").value;
  if (adLink && adDesc) {
    document.getElementById("ad-display").innerHTML = `<a href="${adLink}" target="_blank">${adDesc}</a>`;
    document.getElementById("ad-link").value = "";
    document.getElementById("ad-description").value = "";
    document.getElementById("message").innerText = "";
  }
}

// بارگذاری اولیه
detectWalletApp();
updateTexts();