import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';

// ABI کامل قرارداد
const CONTRACT_ABI = [
  {"inputs":[{"internalType":"address","name":"ownerહ"owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"message","type":"string"}],"name":"DebugMessage","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"EntryFeeUpdated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"string","name":"poolType","type":"string"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ManualWithdraw","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"contributor ","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"MinerPoolContribution","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"MinerTokensBought","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"poolType","type":"string"}],"name":"NoEligibleUsers","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"upline","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"bool","name":"placeOnLeft","type":"bool"}],"name":"Registered","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"UserMigrated","type":"event"},
  {"inputs":[],"name":"CYCLE_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"ENTRY_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"MAX_CYCLE_BALANCES","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"MINER_BUY_INTERVAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"PTOKEN_CONTRACT","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"userId","type":"uint256"}],"name":"_getSpecialUserInfoForMigrateToNewFork","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"uint256","name":"leftCount","type":"uint256"},{"internalType":"uint256","name":"rightCount","type":"uint256"},{"internalType":"uint256","name":"saveLeft","type":"uint256"},{"internalType":"uint256","name":"saveRight","type":"uint256"},{"internalType":"uint256","name":"balanceCount","type":"uint256"},{"internalType":"address","name":"upline","type":"address"},{"internalType":"uint256","name":"specialBalanceCount","type":"uint256"},{"internalType":"uint256","name":"totalMinerRewards","type":"uint256"},{"internalType":"uint256","name":"entryPrice","type":"uint256"},{"internalType":"bool","name":"isMiner","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"buyMinerTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"contributeToMinerPool","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"distributeMinerTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"eligiblePoolUserCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"eligibleSpecialUserCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getMinerStats","outputs":[{"internalType":"uint256","name":"checkedOutPaidCount","type":"uint256"},{"internalType":"uint256","name":"eligibleInProgressCount","type":"uint256"},{"internalType":"uint256","name":"totalRemain","type":"uint256"},{"internalType":"uint256","name":"networkerCount","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"percent","type":"uint256"}],"name":"getMinerStatsByPercent","outputs":[{"internalType":"uint256","name":"usersAbovePercent","type":"uint256"},{"internalType":"uint256","name":"totalRemaining","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getSpecialPoolParticipants","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getTokenPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"userId","type":"uint256"}],"name":"getUserDirects","outputs":[{"internalType":"uint256","name":"leftId","type":"uint256"},{"internalType":"uint256","name":"rightId","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserInfo","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"uplineId","type":"uint256"},{"internalType":"uint256","name":"leftCount","type":"uint256"},{"internalType":"uint256","name":"rightCount","type":"uint256"},{"internalType":"uint256","name":"saveLeft","type":"uint256"},{"internalType":"uint256","name":"saveRight","type":"uint256"},{"internalType":"uint256","name":"balanceCount","type":"uint256"},{"internalType":"uint256","name":"specialBalanceCount","type":"uint256"},{"internalType":"uint256","name":"totalMinerRewards","type":"uint256"},{"internalType":"uint256","name":"entryPrice","type":"uint256"},{"internalType":"bool","name":"isMiner","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint8","name":"day","type":"uint8"}],"name":"isCurrentTimeMatchToDay","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"isPoolWithdrawable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"lastMinerBuyTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"lastPoolWithdrawTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"minerTokenPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"userWallet","type":"address"},{"internalType":"uint256","name":"uplineId","type":"uint256"},{"internalType":"address","name":"leftChildAddress","type":"address"},{"internalType":"address","name":"rightChildAddress","type":"address"},{"internalType":"uint256","name":"oldLeftCount","type":"uint256"},{"internalType":"uint256","name":"oldRightCount","type":"uint256"},{"internalType":"uint256","name":"oldLeftSave","type":"uint256"},{"internalType":"uint256","name":"oldRightSave","type":"uint256"}],"name":"mpu","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"pendingMinerFunds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"poolBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"poolPointCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"uplineCode","type":"uint256"},{"internalType":"bool","name":"placeOnLeft","type":"bool"}],"name":"register","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"specialPointCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"specialRewardPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalUsers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"updateEntryFee","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"withdrawPool","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"withdrawSpecials","outputs":[],"stateMutability":"nonpayable","type":"function"}
];

// آدرس قرارداد
const CONTRACT_ADDRESS = '0x166Dd205590240C90Ca4E0E545AD69db47D8f22f';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [entryFee, setEntryFee] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('register');
  const [uplineCode, setUplineCode] = useState('');
  const [placeOnLeft, setPlaceOnLeft] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    initProvider();
  }, []);

  const initProvider = async () => {
    setLoading(true);
    try {
      const ethProvider = await detectEthereumProvider({ mustBeMetaMask: true });
      if (!ethProvider) {
        setError('لطفاً MetaMask را نصب کنید!');
        setLoading(false);
        return;
      }

      // چک کردن شبکه Polygon (chainId: 137)
      const chainId = await ethProvider.request({ method: 'eth_chainId' });
      if (chainId !== '0x89') {
        await ethProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }],
        });
      }

      const newProvider = new ethers.BrowserProvider(ethProvider);
      const newSigner = await newProvider.getSigner();
      const newAccount = await newSigner.getAddress();
      const newContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, newSigner);

      setProvider(newProvider);
      setSigner(newSigner);
      setAccount(newAccount);
      setContract(newContract);

      // لود ENTRY_FEE
      const fee = await newContract.ENTRY_FEE();
      setEntryFee(ethers.formatEther(fee));

      // لود اطلاعات کاربر
      await loadUserInfo(newContract, newAccount);
    } catch (err) {
      setError(`خطا: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadUserInfo = async (contractInstance, userAddress) => {
    try {
      const info = await contractInstance.getUserInfo(userAddress);
      setUserInfo({
        id: info[0].toString(),
        uplineId: info[1].toString(),
        leftCount: info[2].toString(),
        rightCount: info[3].toString(),
        saveLeft: info[4].toString(),
        saveRight: info[5].toString(),
        balanceCount: info[6].toString(),
        specialBalanceCount: info[7].toString(),
        totalMinerRewards: ethers.formatEther(info[8]),
        entryPrice: ethers.formatEther(info[9]),
        isMiner: info[10],
      });
    } catch (err) {
      console.error(err);
      setUserInfo(null);
    }
  };

  const handleRegister = async () => {
    if (!contract || !uplineCode) {
      setError('کد upline و اتصال والت الزامی است!');
      return;
    }
    setLoading(true);
    try {
      const feeWei = ethers.parseEther(entryFee);
      const tx = await contract.register(uplineCode, placeOnLeft, { value: feeWei });
      await tx.wait();
      alert('ثبت نام موفق! ID: ' + (userInfo?.id || 'جدید'));
      await loadUserInfo(contract, account);
    } catch (err) {
      setError(`خطا در ثبت نام: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyMinerTokens = async () => {
    if (!contract || userInfo?.isMiner) {
      setError('ماینر فعال است یا والت وصل نیست!');
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.buyMinerTokens();
      await tx.wait();
      alert('ماینر توکن‌ها خریداری شد!');
      await loadUserInfo(contract, account);
    } catch (err) {
      setError(`خطا در خرید توکن‌ها: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Loading Application...
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>P T K - PToken DApp</h1>
      <p className="wallet-address">
        والت: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'وصل کنید'}
      </p>
      {error && <div className="error">{error}</div>}

      {/* تب‌ها */}
      <div className="tabs">
        <button
          className={activeTab === 'register' ? 'active' : ''}
          onClick={() => setActiveTab('register')}
        >
          ثبت نام
        </button>
        <button
          className={activeTab === 'wallet' ? 'active' : ''}
          onClick={() => setActiveTab('wallet')}
        >
          اطلاعات والت
        </button>
      </div>

      {/* تب ثبت نام */}
      {activeTab === 'register' && (
        <div className="tab-content">
          <h2>ثبت نام (هزینه: {entryFee} MATIC)</h2>
          {!userInfo ? (
            <div className="register-form">
              <input
                type="number"
                placeholder="کد Upline (ID)"
                value={uplineCode}
                onChange={(e) => setUplineCode(e.target.value)}
                className="input"
              />
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    checked={placeOnLeft}
                    onChange={() => setPlaceOnLeft(true)}
                  />
                  چپ
                </label>
                <label>
                  <input
                    type="radio"
                    checked={!placeOnLeft}
                    onChange={() => setPlaceOnLeft(false)}
                  />
                  راست
                </label>
              </div>
              <button onClick={handleRegister} className="button primary">
                ثبت نام
              </button>
            </div>
          ) : (
            <p className="success">شما ثبت نام کرده‌اید! ID: {userInfo.id}</p>
          )}
          {!userInfo?.isMiner && (
            <button onClick={handleBuyMinerTokens} className="button secondary">
              خرید ماینر توکن‌ها
            </button>
          )}
        </div>
      )}

      {/* تب اطلاعات والت */}
      {activeTab === 'wallet' && userInfo && (
        <div className="tab-content">
          <h2>اطلاعات والت</h2>
          <table className="info-table">
            <tbody>
              <tr><td>ID:</td><td>{userInfo.id}</td></tr>
              <tr><td>Upline ID:</td><td>{userInfo.uplineId}</td></tr>
              <tr><td>تعداد چپ:</td><td>{userInfo.leftCount}</td></tr>
              <tr><td>تعداد راست:</td><td>{userInfo.rightCount}</td></tr>
              <tr><td>ذخیره چپ:</td><td>{userInfo.saveLeft}</td></tr>
              <tr><td>ذخیره راست:</td><td>{userInfo.saveRight}</td></tr>
              <tr><td>بالانس:</td><td>{userInfo.balanceCount}</td></tr>
              <tr><td>بالانس ویژه:</td><td>{userInfo.specialBalanceCount}</td></tr>
              <tr><td>جایزه ماینر:</td><td>{userInfo.totalMinerRewards} MATIC</td></tr>
              <tr><td>قیمت ورود:</td><td>{userInfo.entryPrice} MATIC</td></tr>
              <tr><td>وضعیت ماینر:</td><td>{userInfo.isMiner ? 'فعال ✅' : 'غیرفعال ❌'}</td></tr>
            </tbody>
          </table>
          <button onClick={() => loadUserInfo(contract, account)} className="button">
            به‌روزرسانی
          </button>
        </div>
      )}
      {!userInfo && activeTab === 'wallet' && (
        <p className="info">ابتدا ثبت نام کنید!</p>
      )}
    </div>
  );
}

export default App;