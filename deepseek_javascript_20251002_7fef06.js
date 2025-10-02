// تنظیمات DApp
const CONFIG = {
    CONTRACT_ADDRESS: "0x166dd205590240c90ca4e0e545ad69db47d8f22f",
    CREATOR_ADDRESS: "0xYourCreatorAddressHere",
    NETWORK: {
        chainId: "0x89",
        chainName: "Polygon Mainnet",
        rpcUrls: ["https://polygon-rpc.com"],
        blockExplorerUrls: ["https://polygonscan.com"],
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        }
    },
    WALLET_CONNECT: {
        infuraId: "YOUR_INFURA_ID"
    },
    DAPP: {
        name: "PToken DApp",
        description: "A beautiful PToken DApp with miner features",
        version: "1.0.0"
    }
};

// ABI قرارداد
const CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [{"indexed": false, "internalType": "string", "name": "message", "type": "string"}],
        "name": "DebugMessage",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{"indexed": false, "internalType": "uint256", "name": "newFee", "type": "uint256"}],
        "name": "EntryFeeUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
        {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
        {"indexed": false, "internalType": "string", "name": "poolType", "type": "string"},
        {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "ManualWithdraw",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
        {"indexed": true, "internalType": "address", "name": "contributor", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "MinerPoolContribution",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
        {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
        {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "name": "MinerTokensBought",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{"indexed": false, "internalType": "string", "name": "poolType", "type": "string"}],
        "name": "NoEligibleUsers",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
        {"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"},
        {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
        {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
        {"indexed": true, "internalType": "address", "name": "upline", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"},
        {"indexed": false, "internalType": "bool", "name": "placeOnLeft", "type": "bool"}
        ],
        "name": "Registered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
        {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"}
        ],
        "name": "UserMigrated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "CYCLE_DURATION",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ENTRY_FEE",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAX_CYCLE_BALANCES",
        "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MINER_BUY_INTERVAL",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PTOKEN_CONTRACT",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "userId", "type": "uint256"}],
        "name": "_getSpecialUserInfoForMigrateToNewFork",
        "outputs": [
        {"internalType": "uint256", "name": "id", "type": "uint256"},
        {"internalType": "address", "name": "userAddress", "type": "address"},
        {"internalType": "uint256", "name": "leftCount", "type": "uint256"},
        {"internalType": "uint256", "name": "rightCount", "type": "uint256"},
        {"internalType": "uint256", "name": "saveLeft", "type": "uint256"},
        {"internalType": "uint256", "name": "saveRight", "type": "uint256"},
        {"internalType": "uint256", "name": "balanceCount", "type": "uint256"},
        {"internalType": "address", "name": "upline", "type": "address"},
        {"internalType": "uint256", "name": "specialBalanceCount", "type": "uint256"},
        {"internalType": "uint256", "name": "totalMinerRewards", "type": "uint256"},
        {"internalType": "uint256", "name": "entryPrice", "type": "uint256"},
        {"internalType": "bool", "name": "isMiner", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "buyMinerTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contributeToMinerPool",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "distributeMinerTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "eligiblePoolUserCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "eligibleSpecialUserCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMinerStats",
        "outputs": [
        {"internalType": "uint256", "name": "checkedOutPaidCount", "type": "uint256"},
        {"internalType": "uint256", "name": "eligibleInProgressCount", "type": "uint256"},
        {"internalType": "uint256", "name": "totalRemain", "type": "uint256"},
        {"internalType": "uint256", "name": "networkerCount", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "percent", "type": "uint256"}],
        "name": "getMinerStatsByPercent",
        "outputs": [
        {"internalType": "uint256", "name": "usersAbovePercent", "type": "uint256"},
        {"internalType": "uint256", "name": "totalRemaining", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getSpecialPoolParticipants",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTokenPrice",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "userId", "type": "uint256"}],
        "name": "getUserDirects",
        "outputs": [
        {"internalType": "uint256", "name": "leftId", "type": "uint256"},
        {"internalType": "uint256", "name": "rightId", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
        "name": "getUserInfo",
        "outputs": [
        {"internalType": "uint256", "name": "id", "type": "uint256"},
        {"internalType": "uint256", "name": "uplineId", "type": "uint256"},
        {"internalType": "uint256", "name": "leftCount", "type": "uint256"},
        {"internalType": "uint256", "name": "rightCount", "type": "uint256"},
        {"internalType": "uint256", "name": "saveLeft", "type": "uint256"},
        {"internalType": "uint256", "name": "saveRight", "type": "uint256"},
        {"internalType": "uint256", "name": "balanceCount", "type": "uint256"},
        {"internalType": "uint256", "name": "specialBalanceCount", "type": "uint256"},
        {"internalType": "uint256", "name": "totalMinerRewards", "type": "uint256"},
        {"internalType": "uint256", "name": "entryPrice", "type": "uint256"},
        {"internalType": "bool", "name": "isMiner", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint8", "name": "day", "type": "uint8"}],
        "name": "isCurrentTimeMatchToDay",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isPoolWithdrawable",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lastMinerBuyTime",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lastPoolWithdrawTime",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minerTokenPool",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
        {"internalType": "uint256", "name": "id", "type": "uint256"},
        {"internalType": "address", "name": "userWallet", "type": "address"},
        {"internalType": "uint256", "name": "uplineId", "type": "uint256"},
        {"internalType": "address", "name": "leftChildAddress", "type": "address"},
        {"internalType": "address", "name": "rightChildAddress", "type": "address"},
        {"internalType": "uint256", "name": "oldLeftCount", "type": "uint256"},
        {"internalType": "uint256", "name": "oldRightCount", "type": "uint256"},
        {"internalType": "uint256", "name": "oldLeftSave", "type": "uint256"},
        {"internalType": "uint256", "name": "oldRightSave", "type": "uint256"}
        ],
        "name": "mpu",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pendingMinerFunds",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "poolBalance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "poolPointCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
        {"internalType": "uint256", "name": "uplineCode", "type": "uint256"},
        {"internalType": "bool", "name": "placeOnLeft", "type": "bool"}
        ],
        "name": "register",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "specialPointCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "specialRewardPool",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalUsers",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
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
        "inputs": [{"internalType": "uint256", "name": "newFee", "type": "uint256"}],
        "name": "updateEntryFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawPool",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawSpecials",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

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
        adRestricted: "فقط سازنده DApp می‌تواند تبلیغ بگذارد!",
        minerActive: "فعال",
        minerInactive: "غیرفعال",
        contributeMiner: "مشارکت در ماینر",
        buyMinerTokens: "خرید توکن ماینر",
        distributeMinerTokens: "توزیع توکن ماینر",
        withdrawPool: "برداشت از استخر",
        withdrawSpecial: "برداشت ویژه",
        manualWithdraw: "برداشت دستی",
        networkError: "لطفاً شبکه را به Polygon Mainnet تغییر دهید.",
        insufficientBalance: "موجودی کافی نیست. حداقل 350 MATIC + هزینه گس نیاز است.",
        transactionRejected: "تراکنش رد شد",
        successContribution: "مشارکت شما در استخر ماینر با موفقیت ثبت شد!",
        successTokenBuy: "خرید توکن ماینر با موفقیت انجام شد!",
        successTokenDistribution: "توزیع توکن ماینر با موفقیت انجام شد!",
        successWithdrawPool: "برداشت از استخر با موفقیت انجام شد!",
        successWithdrawSpecial: "برداشت ویژه با موفقیت انجام شد!",
        featureComingSoon: "این قابلیت به زودی اضافه خواهد شد"
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
        adRestricted: "فقط مبدع التطبيق يمكنه وضع الإعلانات!",
        minerActive: "نشط",
        minerInactive: "غير نشط",
        contributeMiner: "المساهمة في الماينر",
        buyMinerTokens: "شراء رموز الماينر",
        distributeMinerTokens: "توزيع رموز الماينر",
        withdrawPool: "سحب من البركة",
        withdrawSpecial: "سحب خاص",
        manualWithdraw: "سحب يدوي",
        networkError: "يرجى تبديل الشبكة إلى Polygon Mainnet.",
        insufficientBalance: "الرصيد غير كاف. يلزم 350 MATIC على الأقل + رسوم الغاز.",
        transactionRejected: "تم رفض المعاملة",
        successContribution: "تم تسجيل مساهمتك في بركة الماينر بنجاح!",
        successTokenBuy: "تم شراء رموز الماينر بنجاح!",
        successTokenDistribution: "تم توزيع رموز الماينر بنجاح!",
        successWithdrawPool: "تم السحب من البركة بنجاح!",
        successWithdrawSpecial: "تم السحب الخاص بنجاح!",
        featureComingSoon: "هذه الميزة ستضاف قريباً"
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
        adRestricted: "Only the DApp creator can add advertisements!",
        minerActive: "Active",
        minerInactive: "Inactive",
        contributeMiner: "Contribute to Miner",
        buyMinerTokens: "Buy Miner Tokens",
        distributeMinerTokens: "Distribute Miner Tokens",
        withdrawPool: "Withdraw from Pool",
        withdrawSpecial: "Special Withdraw",
        manualWithdraw: "Manual Withdraw",
        networkError: "Please switch network to Polygon Mainnet.",
        insufficientBalance: "Insufficient balance. Minimum 350 MATIC + gas fee required.",
        transactionRejected: "Transaction rejected",
        successContribution: "Your contribution to the miner pool has been successfully recorded!",
        successTokenBuy: "Miner token purchase completed successfully!",
        successTokenDistribution: "Miner token distribution completed successfully!",
        successWithdrawPool: "Withdrawal from pool completed successfully!",
        successWithdrawSpecial: "Special withdrawal completed successfully!",
        featureComingSoon: "This feature will be added soon"
    }
};

// متغیرهای گلوبال
let provider = null;
let signer = null;
let contract = null;
let userAccount = null;
let walletProvider = "metamask";
let currentLanguage = 'fa';

// تابع تغییر تب‌ها
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabName + '-tab').classList.add('active');
    document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`).classList.add('active');
    
    if (tabName === 'user' && contract) {
        fetchUserInfo();
    }
    
    if (tabName === 'miner' && contract) {
        updateMinerStats();
    }
    
    if (tabName === 'withdraw' && contract) {
        updateWithdrawInfo();
    }
    
    if (tabName === 'tree' && contract) {
        displayTree();
    }
}

// تابع تغییر زبان
function changeLanguage() {
    currentLanguage = document.getElementById("language").value;
    updateTexts();
}

// تابع به‌روزرسانی متن‌ها
function updateTexts() {
    const t = translations[currentLanguage];
    if (document.querySelector(".title")) {
        document.querySelector(".title").textContent = t.title;
    }
    if (document.getElementById("connect-btn")) {
        document.getElementById("connect-btn").innerHTML = `<i class="fas fa-plug"></i> ${t.connect}`;
    }
    if (document.getElementById("disconnect-btn")) {
        document.getElementById("disconnect-btn").innerHTML = `<i class="fas fa-power-off"></i> ${t.disconnect}`;
    }
    
    const elementsToUpdate = {
        'left-label': t.leftLabel,
        'right-label': t.rightLabel
    };
    
    for (const [id, text] of Object.entries(elementsToUpdate)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }
}

// تابع اتصال به کیف پول
async function connectWallet() {
    try {
        if (!window.ethereum) {
            showMessage("لطفاً MetaMask را نصب کنید", "error");
            return;
        }

        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        userAccount = await signer.getAddress();
        
        document.getElementById("account").innerText = `آدرس شما: ${userAccount}`;
        document.getElementById("connect-btn").style.display = "none";
        document.getElementById("disconnect-btn").style.display = "inline-flex";
        
        contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        document.getElementById("save-ad-btn").style.display = 
            userAccount.toLowerCase() === CONFIG.CREATOR_ADDRESS.toLowerCase() ? "inline-flex" : "none";
        
        showMessage("اتصال با موفقیت برقرار شد!", "success");
        
    } catch (err) {
        console.error("Connection error:", err);
        showMessage("خطا در اتصال: " + err.message, "error");
    }
}

// تابع قطع اتصال
function disconnectWallet() {
    provider = null;
    signer = null;
    contract = null;
    userAccount = null;
    
    document.getElementById("account").innerText = "";
    document.getElementById("connect-btn").style.display = "inline-flex";
    document.getElementById("disconnect-btn").style.display = "none";
    document.getElementById("save-ad-btn").style.display = "none";
    
    document.getElementById("user-id").textContent = "-";
    document.getElementById("user-upline").textContent = "-";
    document.getElementById("left-count").textContent = "0";
    document.getElementById("right-count").textContent = "0";
    document.getElementById("balance-count").textContent = "0";
    document.getElementById("saved-balance-count").textContent = "0";
    
    showMessage("اتصال قطع شد.", "info");
}

// تابع ثبت‌نام
async function register() {
    if (!contract || !userAccount) {
        showMessage("لطفاً ابتدا به کیف پول متصل شوید.", "error");
        return;
    }

    const uplineCode = document.getElementById("upline-address").value;
    const placeOnLeft = document.querySelector('input[name="place"]:checked').value === "left";

    if (!uplineCode || isNaN(uplineCode)) {
        showMessage("خطا: آدرس آپلاین نامعتبر است", "error");
        return;
    }

    try {
        const network = await provider.getNetwork();
        if (network.chainId !== 137) {
            showMessage("لطفاً شبکه را به Polygon Mainnet تغییر دهید.", "error");
            return;
        }

        const registrationFee = ethers.utils.parseEther("350");
        const balance = await provider.getBalance(userAccount);
        const gasPrice = ethers.utils.parseUnits("50", "gwei");
        const gasLimit = 2000000;
        const estimatedGasCost = gasPrice.mul(gasLimit);
        const totalRequired = registrationFee.add(estimatedGasCost);

        if (balance.lt(totalRequired)) {
            showMessage("موجودی کافی نیست. حداقل 350 MATIC + هزینه گس نیاز است.", "error");
            return;
        }

        const tx = await contract.register(uplineCode, placeOnLeft, {
            value: registrationFee,
            gasLimit: gasLimit,
            gasPrice: gasPrice
        });
        
        showMessage("در حال پردازش تراکنش...", "info");
        await tx.wait();
        
        showMessage("موفقیت: ثبت‌نام انجام شد", "success");
        await fetchUserInfo();
        
    } catch (err) {
        console.error("Registration error:", err);
        showMessage("خطا: " + (err.reason || err.message || "تراکنش رد شد"), "error");
    }
}

// تابع گرفتن اطلاعات کاربر
async function fetchUserInfo() {
    if (!contract || !userAccount) return;

    try {
        const user = await contract.getUserInfo(userAccount);
        
        document.getElementById("user-id").textContent = user.id.toString();
        document.getElementById("user-upline").textContent = user.uplineId.toString();
        document.getElementById("left-count").textContent = user.leftCount.toString();
        document.getElementById("right-count").textContent = user.rightCount.toString();
        document.getElementById("balance-count").textContent = user.balanceCount.toString();
        document.getElementById("saved-balance-count").textContent = user.specialBalanceCount.toString();
        
    } catch (err) {
        console.error("Error fetching user info:", err);
    }
}

// تابع نمایش ساختار درختی
async function displayTree() {
    if (!contract || !userAccount) {
        document.getElementById("tree").innerHTML = "<p>لطفاً ابتدا به کیف پول متصل شوید.</p>";
        return;
    }

    const treeDiv = document.getElementById("tree");
    treeDiv.innerHTML = "<p>در حال بارگذاری ساختار درختی...</p>";

    try {
        const user = await contract.getUserInfo(userAccount);
        const treeHTML = await buildBinaryTree(userAccount, 0);
        treeDiv.innerHTML = treeHTML || "درختی برای نمایش وجود ندارد.";
    } catch (err) {
        console.error("Tree display error:", err);
        treeDiv.innerHTML = "خطا در نمایش درخت: " + err.message;
    }
}

// تابع بازگشتی برای ساخت درخت باینری
async function buildBinaryTree(userAddress, depth = 0) {
    if (!userAddress || userAddress === "0x0000000000000000000000000000000000000000") {
        return "";
    }

    try {
        const user = await contract.getUserInfo(userAddress);
        const directs = await contract.getUserDirects(user.id);
        
        let treeHTML = `<div class="tree-node" style="animation-delay: ${depth * 0.3}s;">`;
        treeHTML += `<div class="node-content">`;
        treeHTML += `<div class="node-address">${userAddress.substring(0, 6)}...${userAddress.substring(38)}</div>`;
        treeHTML += `<div class="node-id">ID: ${user.id.toString()}</div>`;
        treeHTML += `<div class="node-upline">Upline: ${user.uplineId.toString()}</div>`;
        treeHTML += `</div>`;

        treeHTML += `<div class="tree-branch">`;
        
        // سمت چپ
        treeHTML += `<div class="branch">`;
        treeHTML += `<span class="branch-label">سمت چپ</span>`;
        const leftUser = directs.leftId.toString() !== "0" ? await getUserAddressById(directs.leftId) : "0x0000000000000000000000000000000000000000";
        treeHTML += await buildBinaryTree(leftUser, depth + 1);
        treeHTML += `</div>`;

        // سمت راست
        treeHTML += `<div class="branch">`;
        treeHTML += `<span class="branch-label">سمت راست</span>`;
        const rightUser = directs.rightId.toString() !== "0" ? await getUserAddressById(directs.rightId) : "0x0000000000000000000000000000000000000000";
        treeHTML += await buildBinaryTree(rightUser, depth + 1);
        treeHTML += `</div>`;

        treeHTML += `</div>`;
        treeHTML += `</div>`;
        
        return treeHTML;
    } catch (err) {
        return `<div class="tree-node">خطا در بارگذاری</div>`;
    }
}

// تابع کمکی برای گرفتن آدرس کاربر بر اساس ID
async function getUserAddressById(userId) {
    try {
        const user = await contract._getSpecialUserInfoForMigrateToNewFork(userId);
        return user.userAddress;
    } catch (err) {
        return "0x0000000000000000000000000000000000000000";
    }
}

// توابع مربوط به ماینر
async function contributeToMiner() {
    if (!contract || !userAccount) {
        showMessage("لطفاً ابتدا به کیف پول متصل شوید.", "error");
        return;
    }

    try {
        const tx = await contract.contributeToMinerPool({
            value: ethers.utils.parseEther("0.1")
        });
        
        showMessage("در حال پردازش مشارکت...", "info");
        await tx.wait();
        
        showMessage("مشارکت شما در استخر ماینر با موفقیت ثبت شد!", "success");
        await updateMinerStats();
        
    } catch (err) {
        console.error("Contribution error:", err);
        showMessage("خطا در مشارکت: " + (err.reason || err.message), "error");
    }
}

async function buyMinerTokens() {
    if (!contract || !userAccount) {
        showMessage("لطفاً ابتدا به کیف پول متصل شوید.", "error");
        return;
    }

    try {
        const tx = await contract.buyMinerTokens();
        
        showMessage("در حال پردازش خرید...", "info");
        await tx.wait();
        
        showMessage("خرید توکن ماینر با موفقیت انجام شد!", "success");
        await updateMinerStats();
        
    } catch (err) {
        console.error("Token buy error:", err);
        showMessage("خطا در خرید توکن: " + (err.reason || err.message), "error");
    }
}

async function distributeMinerTokens() {
    if (!contract || !userAccount) {
        showMessage("لطفاً ابتدا به کیف پول متصل شوید.", "error");
        return;
    }

    try {
        const tx = await contract.distributeMinerTokens();
        
        showMessage("در حال توزیع توکن‌ها...", "info");
        await tx.wait();
        
        showMessage("توزیع توکن ماینر با موفقیت انجام شد!", "success");
        await updateMinerStats();
        
    } catch (err) {
        console.error("Distribution error:", err);
        showMessage("خطا در توزیع توکن: " + (err.reason || err.message), "error");
    }
}

// تابع به‌روزرسانی آمار ماینر
async function updateMinerStats() {
    if (!contract) return;
    
    try {
        const userInfo = await contract.getUserInfo(userAccount);
        const minerStats = await contract.getMinerStats();
        const poolBalance = await contract.poolBalance();
        
        document.getElementById("miner-status").textContent = 
            userInfo.isMiner ? "فعال" : "غیرفعال";
        
        const percentage = userInfo.isMiner ? 100 : Math.min(userInfo.balanceCount.toNumber() / 10 * 100, 100);
        document.getElementById("miner-progress").style.width = `${percentage}%`;
        document.getElementById("miner-percentage").textContent = `${Math.round(percentage)}%`;
        
        document.getElementById("eligible-users").textContent = minerStats.networkerCount.toString();
        document.getElementById("miner-count").textContent = minerStats.checkedOutPaidCount.toString();
        document.getElementById("total-miner-rewards").textContent = 
            ethers.utils.formatEther(minerStats.totalRemain || "0");
        document.getElementById("miner-pool-balance").textContent = 
            ethers.utils.formatEther(poolBalance);
            
    } catch (err) {
        console.error("Error updating miner stats:", err);
    }
}

// توابع مربوط به برداشت
async function withdrawPool() {
    if (!contract || !userAccount) {
        showMessage("لطفاً ابتدا به کیف پول متصل شوید.", "error");
        return;
    }

    try {
        const tx = await contract.withdrawPool();
        
        showMessage("در حال پردازش برداشت...", "info");
        await tx.wait();
        
        showMessage("برداشت از استخر با موفقیت انجام شد!", "success");
        await updateWithdrawInfo();
        
    } catch (err) {
        console.error("Withdraw error:", err);
        showMessage("خطا در برداشت: " + (err.reason || err.message), "error");
    }
}

async function withdrawSpecials() {
    if (!contract || !userAccount) {
        showMessage("لطفاً ابتدا به کیف پول متصل شوید.", "error");
        return;
    }

    try {
        const tx = await contract.withdrawSpecials();
        
        showMessage("در حال پردازش برداشت ویژه...", "info");
        await tx.wait();
        
        showMessage("برداشت ویژه با موفقیت انجام شد!", "success");
        await updateWithdrawInfo();
        
    } catch (err) {
        console.error("Special withdraw error:", err);
        showMessage("خطا در برداشت ویژه: " + (err.reason || err.message), "error");
    }
}

async function manualWithdraw() {
    showMessage("این قابلیت به زودی اضافه خواهد شد", "info");
}

// تابع به‌روزرسانی اطلاعات برداشت
async function updateWithdrawInfo() {
    if (!contract) return;
    
    try {
        const poolBalance = await contract.poolBalance();
        const userInfo = await contract.getUserInfo(userAccount);
        
        document.getElementById("pool-balance").textContent = 
            `${ethers.utils.formatEther(poolBalance)} MATIC`;
        document.getElementById("special-balance").textContent = 
            `${ethers.utils.formatEther(userInfo.specialBalanceCount || "0")} MATIC`;
            
    } catch (err) {
        console.error("Error updating withdraw info:", err);
    }
}

// تابع ذخیره تبلیغ
function saveAd() {
    if (!userAccount || userAccount.toLowerCase() !== CONFIG.CREATOR_ADDRESS.toLowerCase()) {
        showMessage("فقط سازنده DApp می‌تواند تبلیغ بگذارد!", "error");
        return;
    }

    const adLink = document.getElementById("ad-link").value;
    const adDesc = document.getElementById("ad-description").value;
    
    if (adLink && adDesc) {
        document.getElementById("ad-display").innerHTML = `
            <div class="ad-item">
                <a href="${adLink}" target="_blank" rel="noopener noreferrer">${adDesc}</a>
            </div>
        `;
        document.getElementById("ad-link").value = "";
        document.getElementById("ad-description").value = "";
        showMessage("تبلیغ با موفقیت ذخیره شد!", "success");
    } else {
        showMessage("لطفاً لینک و توضیحات تبلیغ را وارد کنید.", "error");
    }
}

// تابع نمایش پیام
function showMessage(message, type = "info") {
    const messageEl = document.getElementById("message");
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.style.display = "block";
        
        setTimeout(() => {
            messageEl.style.display = "none";
        }, 5000);
    }
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function() {
    updateTexts();
    
    if (typeof window.ethereum !== "undefined") {
        document.getElementById("connect-btn").style.display = "inline-flex";
    } else {
        showMessage("لطفاً MetaMask را نصب کنید", "error");
        document.getElementById("connect-btn").style.display = "none";
    }
    
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', function(accounts) {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                location.reload();
            }
        });
        
        window.ethereum.on('chainChanged', function() {
            location.reload();
        });
    }
});