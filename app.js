// آدرس قرارداد
const contractAddress = "0x5Bf4F9E5B09B8bE4078fcC4Ca778A5Cb51E67035";

// ABI قرارداد (کامل)
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

// تابع اتصال به کیف پول (فقط MetaMask)
async function connectWallet() {
  if (typeof window.ethers === 'undefined') {
    document.getElementById("message").innerText = "خطا: ethers.js لود نشده است. لطفاً اتصال به اینترنت را بررسی کنید یا CDN را چک کنید.";
    console.error("ethers.js لود نشده است. لطفاً بررسی کنید که فایل از CDN لود شده باشد: https://unpkg.com/ethers@5.7.2/dist/ethers.umd.min.js");
    return;
  }

  if (window.ethereum) {
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      userAccount = await signer.getAddress();
      document.getElementById("account").innerText = "آدرس شما: " + userAccount;

      contract = new ethers.Contract(contractAddress, contractAbi, signer);

      document.getElementById("register-section").style.display = "block";
      await fetchUserInfo();
      await displayTree();
    } catch (err) {
      console.error("اتصال ناموفق:", err);
      document.getElementById("message").innerText = "خطا: " + (err.message || "اتصال رد شد");
    }
  } else {
    document.getElementById("message").innerText = "لطفاً MetaMask را نصب کنید!";
  }
}

// تابع گرفتن اطلاعات کاربر
async function fetchUserInfo() {
  if (contract && userAccount) {
    try {
      const user = await contract.getUser(userAccount);
      document.getElementById("user-info").style.display = "block";
      document.getElementById("user-id").innerText = user.id.toString();
      document.getElementById("user-upline").innerText = user.upline;
      document.getElementById("left-count").innerText = user.leftCount.toString();
      document.getElementById("right-count").innerText = user.rightCount.toString();
      document.getElementById("balance-count").innerText = user.balanceCount.toString();
      document.getElementById("saved-balance-count").innerText = user.savedBalanceCount.toString();
    } catch (err) {
      console.error("خطا در گرفتن اطلاعات:", err);
      document.getElementById("message").innerText = "خطا در گرفتن اطلاعات: " + err.message;
    }
  }
}

// تابع ثبت‌نام
async function register() {
  const uplineAddress = document.getElementById("upline-address").value;
  const placeOnLeft = document.querySelector('input[name="place"]:checked').value === "left";

  if (!ethers.utils.isAddress(uplineAddress)) {
    document.getElementById("message").innerText = "خطا: آدرس آپلاین نامعتبر است";
    return;
  }

  try {
    const tx = await contract.register(uplineAddress, placeOnLeft, {
      value: ethers.utils.parseEther("350"),
      gasLimit: 300000
    });
    await tx.wait();
    document.getElementById("message").innerText = "موفقیت: ثبت‌نام انجام شد";
    await fetchUserInfo();
    await displayTree();
  } catch (err) {
    console.error("Register error:", err);
    document.getElementById("message").innerText = "خطا: " + (err.message || "تراکنش رد شد");
  }
}

// تابع نمایش ساختار درختی
async function displayTree() {
  if (!contract || !userAccount) return;

  document.getElementById("tree-section").style.display = "block";
  const treeDiv = document.getElementById("tree");
  treeDiv.innerHTML = "";

  async function buildTree(userAddress, depth = 0) {
    if (!userAddress || userAddress === "0x0000000000000000000000000000000000000000") return "";

    const user = await contract.getUser(userAddress);
    const indent = " ".repeat(depth * 4);
    let treeHTML = `${indent}<div class="tree-node">`;
    treeHTML += `${indent}  آدرس: ${userAddress}<br>`;
    treeHTML += `${indent}  شناسه: ${user.id.toString()}<br>`;
    treeHTML += `${indent}  آپلاین: ${user.upline}<br>`;

    treeHTML += `${indent}  <div class="tree-branch">`;
    treeHTML += `${indent}    سمت چپ:<br>`;
    treeHTML += await buildTree(user.left, depth + 1);
    treeHTML += `${indent}  </div>`;

    treeHTML += `${indent}  <div class="tree-branch">`;
    treeHTML += `${indent}    سمت راست:<br>`;
    treeHTML += await buildTree(user.right, depth + 1);
    treeHTML += `${indent}  </div>`;

    treeHTML += `${indent}</div>`;
    return treeHTML;
  }

  try {
    const treeHTML = await buildTree(userAccount);
    treeDiv.innerHTML = treeHTML || "درختی برای نمایش وجود ندارد.";
  } catch (err) {
    console.error("Tree error:", err);
    treeDiv.innerHTML = "خطا در نمایش درخت: " + err.message;
  }
}