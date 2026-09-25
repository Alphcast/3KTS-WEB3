import React, { useContext, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { FaBitcoin, FaCoins } from "react-icons/fa";
import { BsShieldCheck, BsArrowRepeat } from "react-icons/bs";
import { IoWalletOutline } from "react-icons/io5";
import { TransactionContext } from "../context/TransactionContext";

const Modals = () => {
  const {
    activeModal,
    setActiveModal,
    currentAccount,
    walletType,
    balance,
    fetchLiveBalance,
    connectWallet,
    addRealWallet,
    disconnectWallet,
  } = useContext(TransactionContext);

  const [customAddressInput, setCustomAddressInput] = useState("");
  const [addressInputError, setAddressInputError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!activeModal) return null;

  const handleCopy = () => {
    if (currentAccount && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefreshBalance = async () => {
    if (currentAccount) {
      setIsRefreshing(true);
      await fetchLiveBalance(currentAccount);
      setIsRefreshing(false);
    }
  };

  const handleAddCustomWallet = async (e) => {
    e.preventDefault();
    setAddressInputError("");

    if (!customAddressInput.trim()) {
      setAddressInputError("Please enter your Ethereum wallet address.");
      return;
    }

    const res = await addRealWallet(customAddressInput.trim());
    if (!res.success) {
      setAddressInputError(res.error);
    } else {
      setCustomAddressInput("");
    }
  };

  const scrollToExchange = () => {
    setActiveModal(null);
    const exchangeEl = document.getElementById("exchange");
    if (exchangeEl) {
      exchangeEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const hasInjectedEthereum = typeof window !== "undefined" && !!window.ethereum;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#181924] border border-[#2d3148] shadow-2xl p-6 text-white animate-slide-in my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
        >
          <AiOutlineClose fontSize={20} />
        </button>

        {/* 1. Market Modal */}
        {activeModal === "market" && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#2952e3] flex items-center justify-center text-white">
                <SiEthereum fontSize={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Crypto Market Overview</h3>
                <p className="text-xs text-gray-400">Live Web 3.0 Market Rates</p>
              </div>
            </div>

            <div className="space-y-3 my-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-400">
                    <SiEthereum fontSize={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Ethereum (ETH)</p>
                    <p className="text-xs text-gray-400">Layer 1 Proof-of-Stake</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">$3,485.20</p>
                  <p className="text-xs text-green-400">+3.82%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <FaBitcoin fontSize={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Bitcoin (BTC)</p>
                    <p className="text-xs text-gray-400">Layer 1 Asset</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">$89,450.00</p>
                  <p className="text-xs text-green-400">+2.41%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <FaCoins fontSize={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Web3 Tokens &amp; Altcoins</p>
                    <p className="text-xs text-gray-400">Decentralized Assets</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">$2.18T MCAP</p>
                  <p className="text-xs text-green-400">+4.15%</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={scrollToExchange}
                className="w-full py-2.5 px-4 rounded-full bg-[#2952e3] hover:bg-[#2546bd] text-white font-semibold text-sm cursor-pointer shadow-lg"
              >
                Go to Exchange
              </button>
            </div>
          </div>
        )}

        {/* 2. Tutorials Modal */}
        {activeModal === "tutorials" && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
                <BsShieldCheck fontSize={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold">How to Use Krypt</h3>
                <p className="text-xs text-gray-400">Real Ethereum Web 3.0 transfer guide</p>
              </div>
            </div>

            <div className="space-y-3 my-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-[#2952e3] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="font-semibold text-sm">Connect or Add Your Real Wallet</h4>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Connect using your MetaMask extension or paste your personal Ethereum address to load your live on-chain balance.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-[#2952e3] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="font-semibold text-sm">Specify Recipient &amp; Amount</h4>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Enter the recipient Ethereum address (0x...), the amount in ETH, and a message note.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-[#2952e3] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="font-semibold text-sm">Add Keyword Receipt</h4>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Include a keyword (like &ldquo;crypto&rdquo; or &ldquo;ethereum&rdquo;) to generate a custom animated GIF verification on your receipt.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-[#2952e3] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <h4 className="font-semibold text-sm">Send &amp; Confirm</h4>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Click &ldquo;Send now&rdquo; to broadcast your transaction directly to the Ethereum network.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={scrollToExchange}
                className="w-full py-2.5 px-4 rounded-full bg-[#2952e3] hover:bg-[#2546bd] text-white font-semibold text-sm cursor-pointer shadow-lg"
              >
                Start Transfer on Exchange
              </button>
            </div>
          </div>
        )}

        {/* 3. Wallets Modal */}
        {activeModal === "wallets" && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#2952e3] flex items-center justify-center text-white">
                <IoWalletOutline fontSize={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ethereum Real Wallet</h3>
                <p className="text-xs text-gray-400">Connect or add your personal Ethereum account</p>
              </div>
            </div>

            {/* Currently Connected Status */}
            {currentAccount ? (
              <div className="space-y-4 my-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/40">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                      {walletType === "metamask" ? "MetaMask Extension" : "Personal Real Wallet"}
                    </span>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2.5 py-0.5 rounded-full border border-green-500/40 font-medium">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-xs text-gray-400">Wallet Address:</p>
                      <p className="text-sm font-mono text-white font-semibold break-all">
                        {currentAccount}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="ml-2 py-1 px-3 text-xs bg-white/10 hover:bg-white/20 rounded-md border border-white/20 cursor-pointer text-white flex-shrink-0"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                    <div>
                      <p className="text-xs text-gray-400">Live On-Chain Balance:</p>
                      <p className="text-lg font-bold text-white">
                        {balance} <span className="text-sm font-normal text-blue-300">ETH</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRefreshBalance}
                      className="flex items-center space-x-1 text-xs bg-white/10 hover:bg-white/20 text-gray-200 px-2.5 py-1.5 rounded-lg border border-white/10 cursor-pointer"
                      title="Refresh live on-chain balance"
                    >
                      <BsArrowRepeat className={`text-sm ${isRefreshing ? "animate-spin" : ""}`} />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={scrollToExchange}
                    className="flex-1 py-2.5 px-4 rounded-full bg-[#2952e3] hover:bg-[#2546bd] text-white font-semibold text-sm cursor-pointer shadow-lg"
                  >
                    Send with this Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      disconnectWallet();
                    }}
                    className="py-2.5 px-5 rounded-full bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-red-200 font-semibold text-sm cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : null}

            {/* Add or Change Real Wallet */}
            <div className="mt-5 space-y-4">
              <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                {currentAccount ? "Switch or Connect Another Real Wallet" : "Choose How to Connect Your Real Wallet"}
              </h4>

              {/* Option 1: Browser Extension / MetaMask */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center text-amber-400 font-bold">
                      🦊
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">MetaMask / Web3 Extension</p>
                      <p className="text-xs text-gray-400">
                        {hasInjectedEthereum
                          ? "Web3 provider detected in your browser"
                          : "Connect using browser extension or Web3 browser"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => connectWallet()}
                  className="w-full mt-2 py-2 px-4 rounded-xl bg-[#2952e3] hover:bg-[#2546bd] text-white font-semibold text-xs cursor-pointer shadow transition-all"
                >
                  Connect MetaMask Extension
                </button>
              </div>

              {/* Option 2: Add Real Wallet Address directly */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                    <SiEthereum fontSize={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Add Your Real Ethereum Wallet Address</p>
                    <p className="text-xs text-gray-400">Paste your personal 0x... address to link your live account</p>
                  </div>
                </div>

                <form onSubmit={handleAddCustomWallet} className="mt-3">
                  <input
                    type="text"
                    placeholder="Enter your real address: 0x..."
                    value={customAddressInput}
                    onChange={(e) => {
                      setCustomAddressInput(e.target.value);
                      if (addressInputError) setAddressInputError("");
                    }}
                    className="w-full p-2.5 rounded-lg bg-black/40 border border-white/20 text-white text-xs font-mono outline-none focus:border-blue-400 transition-colors"
                  />

                  {addressInputError && (
                    <p className="text-xs text-red-400 mt-1">{addressInputError}</p>
                  )}

                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow transition-all"
                    >
                      Add &amp; Load Real Wallet
                    </button>
                  </div>
                </form>

                <div className="mt-3 pt-2 border-t border-white/10">
                  <p className="text-[11px] text-gray-400">
                    Example public address to test live balance:
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomAddressInput("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
                      setAddressInputError("");
                    }}
                    className="text-[11px] font-mono text-blue-400 hover:underline cursor-pointer bg-transparent border-none p-0 mt-0.5 text-left"
                  >
                    0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 (vitalik.eth)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modals;
