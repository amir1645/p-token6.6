// تنظیمات DApp
const CONFIG = {
    CONTRACT_ADDRESS: "0x166dd205590240c90ca4e0e545ad69db47d8f22f",
    CREATOR_ADDRESS: "0xYourCreatorAddressHere"
};

// ABI قرارداد (ساده شده)
const CONTRACT_ABI = [
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
        "name": "contributeToMinerPool",
        "outputs": [],
        "stateMutability": "payable",
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
        "name": "distributeMinerTokens",
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
        "inputs": [],
        "name": "poolBalance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
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
    }
];

// متغیرهای گلوبال
let provider = null;
let signer = null;
let contract = null;
let userAccount = null;
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
        showMessage("خطا: شناسه آپلاین نامعتبر است", "error");
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

        showMessage("در حال پردازش تراکنش...", "info");
        
        const tx = await contract.register(uplineCode, placeOnLeft, {
            value: registrationFee,
            gasLimit: gasLimit
        });
        
        await tx.wait();
        
        showMessage("ثبت‌نام با موفقیت انجام شد!", "success");
        await fetchUserInfo();
        
    } catch (err) {
        console.error("Registration error:", err);
        showMessage("خطا در ثبت‌نام: " + (err.reason || err.message), "error");
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
        treeDiv.innerHTML = "خطا در نمایش درخت";
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
        
        let treeHTML = `<div class="tree-node">`;
        treeHTML += `<div class="node-content">`;
        treeHTML += `<div class="node-address">${userAddress.substring(0, 6)}...${userAddress.substring(38)}</div>`;
        treeHTML += `<div class="node-id">ID: ${user.id.toString()}</div>`;
        treeHTML += `<div class="node-upline">Upline: ${user.uplineId.toString()}</div>`;
        treeHTML += `</div>`;

        if (directs.leftId.toString() !== "0" || directs.rightId.toString() !== "0") {
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
        }
        
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
        showMessage("در حال پردازش مشارکت...", "info");
        
        const tx = await contract.contributeToMinerPool({
            value: ethers.utils.parseEther("0.1")
        });
        
        await tx.wait();
        
        showMessage("مشارکت در استخر ماینر با موفقیت ثبت شد!", "success");
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
        showMessage("در حال پردازش خرید...", "info");
        
        const tx = await contract.buyMinerTokens();
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
        showMessage("در حال توزیع توکن‌ها...", "info");
        
        const tx = await contract.distributeMinerTokens();
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
        showMessage("در حال پردازش برداشت...", "info");
        
        const tx = await contract.withdrawPool();
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
        showMessage("در حال پردازش برداشت ویژه...", "info");
        
        const tx = await contract.withdrawSpecials();
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

// تابع نمایش پیام
function showMessage(message, type = "info") {
    const messageEl = document.getElementById("message");
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        
        setTimeout(() => {
            messageEl.style.display = "none";
        }, 5000);
    }
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function() {
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