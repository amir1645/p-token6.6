const contractAddress = "0x5Bf4F9E5B09B8bE4078fcC4Ca778A5Cb51E67035";
const creatorAddress = "0xYourCreatorAddressHere";

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

let provider = null;
let signer = null;
let contract = null;
let userAccount = null;
let walletProvider = "metamask";
let isInWalletApp = false;

function detectWalletApp() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("metamask") || userAgent.includes("coinbase") || userAgent.includes("trust")) {
    isInWalletApp = true;
  }
}

const translations = {
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
    errorNetwork: "Please switch to Polygon Mainnet.",
    errorBalance: "Insufficient balance. At least 350 MATIC + gas fee required.",
    installMetaMask: "Please install a wallet or use the wallet's built-in browser!",
    invalidUpline: "Error: Upline address is invalid",
    noTree: "No tree to display.",
    adRestricted: "Only the DApp creator can add advertisements!",
    balanceDebt: "Balance Debt",
    sixHourBalance: "6-Hour Balance",
    corsError: "CORS Error: Please use a local server (e.g., live-server) to run this DApp."
  },
  fa: {
    title: "PToken دی‌اپ",
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
    errorNetwork: "لطفاً شبکه را به Polygon Mainnet تغییر دهید.",
    errorBalance: "موجودی کافی نیست. حداقل ۳۵۰ MATIC + هزینه گس نیاز است.",
    installMetaMask: "لطفاً کیف پول را نصب کنید یا از مرورگر داخلی کیف پول استفاده کنید!",
    invalidUpline: "خطا: آدرس آپلاین نامعتبر است",
    noTree: "درختی برای نمایش وجود ندارد.",
    adRestricted: "فقط سازنده DApp می‌تواند تبلیغ بگذارد!",
    balanceDebt: "طلب تعادل",
    sixHourBalance: "تعادل ۶ ساعته",
    corsError: "خطای CORS: لطفاً از یک سرور محلی (مثل live-server) برای اجرای این DApp استفاده کنید."
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
    errorNetwork: "يرجى التبديل إلى شبكة Polygon Mainnet.",
    errorBalance: "الرصيد غير كافٍ. مطلوب ٣٥٠ MATIC + رسوم الغاز على الأقل.",
    installMetaMask: "يرجى تثبيت المحفظة أو استخدام متصفح المحفظة الداخلي!",
    invalidUpline: "خطأ: عنوان الراعي غير صالح",
    noTree: "لا يوجد شجرة للعرض.",
    adRestricted: "فقط مبدع التطبيق يمكنه وضع الإعلانات!",
    balanceDebt: "دين الرصيد",
    sixHourBalance: "رصيد ٦ ساعات",
    corsError: "خطأ CORS: يرجى استخدام خادوم محلي (مثل live-server) لتشغيل هذا التطبيق."
  },
  tr: {
    title: "PToken DApp",
    connect: "Cüzdana Bağlan",
    disconnect: "Cüzdanı Kes",
    account: "Adresiniz: ",
    registerTitle: "Kayıt Ol",
    leftLabel: "Sol Taraf",
    rightLabel: "Sağ Taraf",
    userInfoTitle: "Kullanıcı Bilgileri",
    treeTitle: "Ağaç Yapısı",
    adTitle: "Reklamlar",
    adLinkPlaceholder: "Reklam Linki",
    adDescPlaceholder: "Reklam Açıklaması",
    saveAd: "Reklamı Kaydet",
    successRegister: "Başarılı: Kayıt tamamlandı",
    errorConnection: "Hata: ",
    errorRegister: "Hata: ",
    errorUserInfo: "Bilgi alınırken hata: ",
    errorTree: "Ağaç görüntülenirken hata: ",
    errorNetwork: "Lütfen Polygon Mainnet ağına geçin.",
    errorBalance: "Yetersiz bakiye. En az 350 MATIC + gaz ücreti gerekli.",
    installMetaMask: "Lütfen bir cüzdan kurun veya cüzdanın yerleşik tarayıcısını kullanın!",
    invalidUpline: "Hata: Üst referans adresi geçersiz",
    noTree: "Görüntülenecek ağaç yok.",
    adRestricted: "Yalnızca DApp yaratıcısı reklam verebilir!",
    balanceDebt: "Bakiye Borcu",
    sixHourBalance: "6 Saatlik Bakiye",
    corsError: "CORS Hatası: Lütfen bu DApp'i çalıştırmak için yerel bir sunucu (örneğin live-server) kullanın."
  },
  ru: {
    title: "PToken DApp",
    connect: "Подключить кошелек",
    disconnect: "Отключить кошелек",
    account: "Ваш адрес: ",
    registerTitle: "Регистрация",
    leftLabel: "Левая сторона",
    rightLabel: "Правая сторона",
    userInfoTitle: "Информация о пользователе",
    treeTitle: "Древовидная структура",
    adTitle: "Реклама",
    adLinkPlaceholder: "Ссылка на рекламу",
    adDescPlaceholder: "Описание рекламы",
    saveAd: "Сохранить рекламу",
    successRegister: "Успех: Регистрация завершена",
    errorConnection: "Ошибка: ",
    errorRegister: "Ошибка: ",
    errorUserInfo: "Ошибка при получении информации: ",
    errorTree: "Ошибка отображения дерева: ",
    errorNetwork: "Пожалуйста, переключитесь на сеть Polygon Mainnet.",
    errorBalance: "Недостаточный баланс. Требуется минимум 350 MATIC + комиссия за газ.",
    installMetaMask: "Пожалуйста, установите кошелек или используйте встроенный браузер кошелька!",
    invalidUpline: "Ошибка: Неверный адрес спонсора",
    noTree: "Нет дерева для отображения.",
    adRestricted: "Только создатель DApp может размещать рекламу!",
    balanceDebt: "Долг баланса",
    sixHourBalance: "Баланс за 6 часов",
    corsError: "Ошибка CORS: Пожалуйста, используйте локальный сервер (например, live-server) для запуска этого DApp."
  },
  zh: {
    title: "PToken DApp",
    connect: "连接钱包",
    disconnect: "断开钱包",
    account: "您的地址：",
    registerTitle: "注册",
    leftLabel: "左侧",
    rightLabel: "右侧",
    userInfoTitle: "用户信息",
    treeTitle: "树形结构",
    adTitle: "广告",
    adLinkPlaceholder: "广告链接",
    adDescPlaceholder: "广告描述",
    saveAd: "保存广告",
    successRegister: "成功：注册完成",
    errorConnection: "错误：",
    errorRegister: "错误：",
    errorUserInfo: "获取信息时出错：",
    errorTree: "显示树时出错：",
    errorNetwork: "请切换到Polygon Mainnet网络。",
    errorBalance: "余额不足。至少需要350 MATIC +燃气费。",
    installMetaMask: "请安装钱包或使用钱包内置浏览器！",
    invalidUpline: "错误：上线地址无效",
    noTree: "没有可显示的树。",
    adRestricted: "只有DApp创建者可以添加广告！",
    balanceDebt: "余额债务",
    sixHourBalance: "6小时余额",
    corsError: "CORS错误：请使用本地服务器（如live-server）运行此DApp。"
  }
};

let currentLanguage = 'en';
function changeLanguage() {
  if (document.getElementById("language")) {
    currentLanguage = document.getElementById("language").value;
    updateTexts();
  }
}

function updateTexts() {
  const t = translations[currentLanguage];
  const elements = {
    title: document.querySelector(".title"),
    connectBtn: document.getElementById("connect-btn"),
    disconnectBtn: document.getElementById("disconnect-btn"),
    registerTitle: document.getElementById("register-title"),
    leftLabel: document.getElementById("left-label"),
    rightLabel: document.getElementById("right-label"),
    userInfoTitle: document.getElementById("user-info-title"),
    treeTitle: document.getElementById("tree-title"),
    adTitle: document.getElementById("ad-title"),
    adLink: document.getElementById("ad-link"),
    adDescription: document.getElementById("ad-description"),
    saveAdBtn: document.getElementById("save-ad-btn"),
    balanceDebt: document.getElementById("balance-debt")?.previousSibling,
    sixHourBalance: document.getElementById("six-hour-balance")?.previousSibling
  };
  if (elements.title) elements.title.textContent = t.title;
  if (elements.connectBtn) elements.connectBtn.textContent = t.connect;
  if (elements.disconnectBtn) elements.disconnectBtn.textContent = t.disconnect;
  if (elements.registerTitle) elements.registerTitle.textContent = t.registerTitle;
  if (elements.leftLabel) elements.leftLabel.textContent = t.leftLabel;
  if (elements.rightLabel) elements.rightLabel.textContent = t.rightLabel;
  if (elements.userInfoTitle) elements.userInfoTitle.textContent = t.userInfoTitle;
  if (elements.treeTitle) elements.treeTitle.textContent = t.treeTitle;
  if (elements.adTitle) elements.adTitle.textContent = t.adTitle;
  if (elements.adLink) elements.adLink.placeholder = t.adLinkPlaceholder;
  if (elements.adDescription) elements.adDescription.placeholder = t.adDescPlaceholder;
  if (elements.saveAdBtn) elements.saveAdBtn.textContent = t.saveAd;
  if (elements.balanceDebt) elements.balanceDebt.textContent = t.balanceDebt + ": ";
  if (elements.sixHourBalance) elements.sixHourBalance.textContent = t.sixHourBalance + ": ";
}

function selectWalletProvider() {
  if (document.getElementById("wallet-provider")) {
    walletProvider = document.getElementById("wallet-provider").value;
    document.getElementById("message").innerText = `Selected wallet: ${walletProvider}`;
  }
}

async function connectWallet() {
  if (typeof window.ethers === 'undefined') {
    if (document.getElementById("message")) document.getElementById("message").innerText = translations[currentLanguage].errorConnection + translations[currentLanguage].corsError;
    return;
  }

  try {
    if (provider && walletProvider === "walletconnect") {
      await provider.provider.disconnect();
    }
    provider = null;
    signer = null;

    if (walletProvider === "metamask") {
      if (!window.ethereum) {
        if (document.getElementById("message")) document.getElementById("message").innerText = translations[currentLanguage].installMetaMask;
        return;
      }
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
    } else if (walletProvider === "walletconnect") {
      const WalletConnectProvider = window.WalletConnectProvider.default;
      if (!WalletConnectProvider) {
        if (document.getElementById("message")) document.getElementById("message").innerText = translations[currentLanguage].errorConnection + "WalletConnect not loaded.";
        return;
      }
      const wcProvider = new WalletConnectProvider({
        infuraId: "YOUR_INFURA_ID", // Replace with your Infura ID
        rpc: {
          137: "https://polygon-rpc.com",
        },
      });
      provider = new ethers.providers.Web3Provider(wcProvider);
      await provider.send("eth_requestAccounts", []);
    } else if (walletProvider === "coinbase") {
      const CoinbaseWalletSDK = window.CoinbaseWalletSDK;
      if (!CoinbaseWalletSDK) {
        if (document.getElementById("message")) document.getElementById("message").innerText = translations[currentLanguage].installMetaMask;
        return;
      }
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: "PToken DApp",
        appLogoUrl: "https://yourdomain.com/logo.png",
      });
      provider = new ethers.providers.Web3Provider(coinbaseWallet.makeWeb3Provider());
      await provider.send("eth_requestAccounts", []);
    } else {
      if (document.getElementById("message")) document.getElementById("message").innerText = translations[currentLanguage].installMetaMask;
      return;
    }

    signer = provider.getSigner();
    userAccount = await signer.getAddress();
    if (document.getElementById("account")) document.getElementById("account").innerText = translations[currentLanguage].account + userAccount;
    if (document.getElementById("connect-btn")) document.getElementById("connect-btn").style.display = "none";
    if (document.getElementById("disconnect-btn")) document.getElementById("disconnect-btn").style.display = "inline-block";
    if (document.getElementById("register-section")) document.getElementById("register-section").style.display = "block";
    if (document.getElementById("ad-section")) document.getElementById("ad-section").style.display = "block";
    if (document.getElementById("save-ad-btn")) document.getElementById("save-ad-btn").style.display = userAccount.toLowerCase() === creatorAddress.toLowerCase() ? "inline-block" : "none";

    contract = new ethers.Contract(contractAddress, contractAbi, signer);
    await fetchUserInfo();
    await displayTree();
    if (document.getElementById("wallet-section")) document.getElementById("wallet-section").classList.add("connected");
  } catch (err) {
    if (document.getElementById("message")) document.getElementById("message").innerText = translations[currentLanguage].errorConnection + (err.message || "Connection failed");
  }
}

function disconnectWallet() {
  if (document.getElementById("wallet-section")) {
    document.getElementById("wallet-section").classList.remove("connected");
    document.getElementById("wallet-section").classList.add("disconnected");
  }
  setTimeout(() => {
    if (provider && walletProvider === "walletconnect") {
      provider.provider.disconnect().catch(() => {});
    }
    provider = null;
    signer = null;
    contract = null;
    userAccount = null;
    if (document.getElementById("account")) document.getElementById("account").innerText = "";
    if (document.getElementById("connect-btn")) document.getElementById("connect-btn").style.display = "inline-block";
    if (document.getElementById("disconnect-btn")) document.getElementById("disconnect-btn").style.display = "none";
    if (document.getElementById("register-section")) document.getElementById("register-section").style.display = "none";
    if (document.getElementById("user-info")) document.getElementById("user-info").style.display = "none";
    if (document.getElementById("tree-section")) document.getElementById("tree-section").style.display = "none";
    if (document.getElementById("ad-section")) document.getElementById("ad-section").style.display = "none";
    if (document.getElementById("save-ad-btn")) document.getElementById("save-ad-btn").style.display = "none";
    if (document.getElementById("message")) document.getElementById("message").innerText = "";
    if (document.getElementById("tree")) document.getElementById("tree").innerHTML = "";
    if (document.getElementById("ad-display")) document.getElementById("ad-display").innerHTML = "";
    if (document.getElementById("wallet-section")) document.getElementById("wallet-section").classList.remove("disconnected");
    walletProvider = document.getElementById("wallet-provider") ? document.getElementById("wallet-provider").value : "metamask";
  }, 500);
}

async function fetchUserInfo() {
  if (contract && userAccount && document.getElementById("user-info")) {
    try {
      const user = await contract.getUser(userAccount);
      document.getElementById("user-info").style.display = "block";
      document.getElementById("user-id").innerText = ethers.BigNumber.from(user.id).toString();
      document.getElementById("user-upline").innerText = user.upline;
      document.getElementById("left-count").innerText = ethers.BigNumber.from(user.leftCount).toString();
      document.getElementById("right-count").innerText = ethers.BigNumber.from(user.rightCount).toString();
      document.getElementById("balance-count").innerText = ethers.BigNumber.from(user.balanceCount).toString();
      document.getElementById("saved-balance-count").innerText = ethers.BigNumber.from(user.savedBalanceCount).toString();
      const balanceDebt = ethers.BigNumber.from(user.leftCount).sub(ethers.BigNumber.from(user.rightCount));
      document.getElementById("balance-debt").innerText = balanceDebt.gte(0) ? `${balanceDebt.toString()} (Left heavier)` : `${balanceDebt.abs().toString()} (Right heavier)`;
      document.getElementById("six-hour-balance").innerText = ethers.BigNumber.from(user.cycleBalanceCount).toString();
    } catch (err) {
      if (document.getElementById("message")) document.getElementById("message").innerText = translations[currentLanguage].errorUserInfo + err.message;
    }
  }
}

async function register() {
  const uplineAddress = document.getElementById("upline-address") ? document.getElementById("upline-address").value : "";
  const placeOnLeft = document.querySelector('input[name="place"]:checked') ? document.querySelector('input[name="place"]:checked').value === "left" : false;

  if (!ethers.utils.isAddress(uplineAddress)) {
    if (document.getElementById("message")) document.getElementById("message").innerText = translations[currentLanguage].invalidUpline;
    return;
  }

  try {
    const network = await provider.getNetwork();
    if (network.chainId !== 137) {
      if (document.getElementById("message")) document.getElementById("message").innerText = translations[currentLanguage].errorNetwork;
      return;
    }

    const registrationFee = ethers.utils.parseEther("350");
    const balance = await provider.getBalance(userAccount);
    const gasPrice = (await provider.getGasPrice()).mul(ethers.BigNumber.from("50"));
    const gasLimit = ethers.BigNumber.from("2000000");
    const estimatedGasCost = gasPrice.mul(gasLimit);
    const totalRequired = registrationFee.add(estimatedGasCost);

    if (balance.lt(totalRequired)) {
      if (document.getElementById("message")) document.getElementById("message").innerText = translations[currentLanguage].errorBalance;
      return;
    }

    const tx = await contract.register(uplineAddress, placeOnLeft, {
      value: registrationFee,
      gasLimit: gasLimit,
      gasPrice: gasPrice
    });
    await tx.wait();
    if (document.getElementById("message")) document.getElementById("message").innerText = translations[currentLanguage].successRegister;
    await fetchUserInfo();
    await displayTree();
  } catch (err) {
    if (document.getElementById("message")) document.getElementById("message").innerText = translations[currentLanguage].errorRegister + (err.reason || err.message || "Transaction failed");
  }
}

async function displayTree() {
  if (!contract || !userAccount || !document.getElementById("tree-section")) return;

  document.getElementById("tree-section").style.display = "block";
  const treeDiv = document.getElementById("tree");
  treeDiv.innerHTML = "";

  async function buildBinaryTree(userAddress, depth = 0) {
    if (!userAddress || userAddress === "0x0000000000000000000000000000000000000000") return "";

    try {
      const user = await contract.getUser(userAddress);
      let treeHTML = `<div class="tree-node" style="animation-delay: ${depth * 0.3}s;">
        <div class="node-box">
          <span class="node-address">Address: ${userAddress}</span>
          <span class="node-id">ID: ${ethers.BigNumber.from(user.id).toString()}</span>
        </div>
        <div class="tree-branches">
          <div class="tree-branch left">
            ${await buildBinaryTree(user.left, depth + 1)}
          </div>
          <div class="tree-branch right">
            ${await buildBinaryTree(user.right, depth + 1)}
          </div>
        </div>
      </div>`;
      return treeHTML;
    } catch (err) {
      return "";
    }
  }

  try {
    const treeHTML = await buildBinaryTree(userAccount);
    treeDiv.innerHTML = treeHTML || translations[currentLanguage].noTree;
  } catch (err) {
    treeDiv.innerHTML = translations[currentLanguage].errorTree + err.message;
  }
}

function saveAd() {
  if (userAccount && document.getElementById("message")) {
    if (userAccount.toLowerCase() !== creatorAddress.toLowerCase()) {
      document.getElementById("message").innerText = translations[currentLanguage].adRestricted;
      return;
    }

    const adLink = document.getElementById("ad-link") ? document.getElementById("ad-link").value : "";
    const adDesc = document.getElementById("ad-description") ? document.getElementById("ad-description").value : "";
    if (adLink && adDesc) {
      if (document.getElementById("ad-display")) document.getElementById("ad-display").innerHTML = `<a href="${adLink}" target="_blank">${adDesc}</a>`;
      if (document.getElementById("ad-link")) document.getElementById("ad-link").value = "";
      if (document.getElementById("ad-description")) document.getElementById("ad-description").value = "";
      document.getElementById("message").innerText = "";
    }
  }
}

detectWalletApp();
updateTexts();

// Check if ethers is loaded after a short delay
setTimeout(() => {
  if (typeof window.ethers === 'undefined') {
    if (document.getElementById("message")) document.getElementById("message").innerText = translations[currentLanguage].errorConnection + translations[currentLanguage].corsError;
  }
}, 1000);