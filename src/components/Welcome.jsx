import React, { useContext, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle, BsCheck2 } from "react-icons/bs";
import { IoWalletOutline } from "react-icons/io5";

import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";
import Loader from "./Loader";

const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white cursor-pointer hover:bg-white/10 transition-colors select-none";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border border-white/20 text-sm white-glassmorphism focus:border-blue-400 transition-colors"
  />
);

const Welcome = () => {
  const {
    currentAccount,
    walletType,
    connectWallet,
    disconnectWallet,
    handleChange,
    sendTransaction,
    formData,
    isLoading,
    balance,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
    setActiveModal,
  } = useContext(TransactionContext);

  const [copied, setCopied] = useState(false);
  const [activeBadge, setActiveBadge] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    sendTransaction();
  };

  const handleCopyAddress = () => {
    if (currentAccount && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBadgeClick = (badgeName) => {
    setActiveBadge(badgeName);
    setTimeout(() => setActiveBadge(""), 2500);
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Send Crypto <br /> across the world
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Explore the crypto world. Connect your personal Ethereum wallet to send and receive real transactions on Krypt.
          </p>

          {!currentAccount ? (
            <div className="flex flex-wrap items-center gap-3 my-5">
              <button
                type="button"
                onClick={connectWallet}
                className="flex flex-row justify-center items-center bg-[#2952e3] p-3 px-6 rounded-full cursor-pointer hover:bg-[#2546bd] text-white font-semibold transition-all shadow-lg active:scale-95"
              >
                <AiFillPlayCircle className="text-white mr-2 text-xl" />
                <p className="text-white text-base font-semibold">
                  Connect Wallet
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal("wallets")}
                className="flex flex-row justify-center items-center bg-white/10 hover:bg-white/20 border border-white/20 p-3 px-5 rounded-full cursor-pointer text-white font-medium text-sm transition-all"
              >
                <IoWalletOutline className="text-blue-400 mr-2 text-lg" />
                Add Real Wallet Address
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 my-5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-white text-sm font-semibold font-mono">
                    {shortenAddress(currentAccount)}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {walletType === "metamask" ? "MetaMask Wallet" : "Personal Real Wallet"}
                  </span>
                </div>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full font-bold ml-2">
                  {balance} ETH
                </span>
              </div>
              <div className="flex items-center space-x-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setActiveModal("wallets")}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full cursor-pointer"
                >
                  Manage
                </button>
                <button
                  type="button"
                  onClick={disconnectWallet}
                  className="text-xs bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/30 px-3 py-1.5 rounded-full cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}

          {/* Feedback messages */}
          {errorMessage && (
            <div className="bg-red-900/70 border border-red-500 text-white text-sm p-3 rounded-xl my-3 w-full max-w-md flex justify-between items-center shadow-lg">
              <span>{errorMessage}</span>
              <button
                type="button"
                className="ml-3 text-red-200 hover:text-white font-bold p-1"
                onClick={() => setErrorMessage("")}
              >
                ✕
              </button>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-900/70 border border-green-500 text-white text-sm p-3 rounded-xl my-3 w-full max-w-md flex justify-between items-center shadow-lg">
              <div className="flex items-center space-x-2">
                <BsCheck2 className="text-green-300 text-lg flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
              <button
                type="button"
                className="ml-3 text-green-200 hover:text-white font-bold p-1"
                onClick={() => setSuccessMessage("")}
              >
                ✕
              </button>
            </div>
          )}

          {activeBadge && (
            <div className="text-xs text-blue-300 my-1 py-1 px-3 rounded-md bg-blue-900/30 border border-blue-500/30">
              Feature: <span className="font-semibold text-white">{activeBadge}</span> is active on the network.
            </div>
          )}

          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-8">
            <div
              onClick={() => handleBadgeClick("Reliability")}
              className={`rounded-tl-2xl ${companyCommonStyles}`}
            >
              Reliability
            </div>
            <div
              onClick={() => handleBadgeClick("Security")}
              className={companyCommonStyles}
            >
              Security
            </div>
            <div
              onClick={() => handleBadgeClick("Ethereum")}
              className={`sm:rounded-tr-2xl ${companyCommonStyles}`}
            >
              Ethereum
            </div>
            <div
              onClick={() => handleBadgeClick("Web 3.0")}
              className={`sm:rounded-bl-2xl ${companyCommonStyles}`}
            >
              Web 3.0
            </div>
            <div
              onClick={() => handleBadgeClick("Low Fees")}
              className={companyCommonStyles}
            >
              Low Fees
            </div>
            <div
              onClick={() => handleBadgeClick("Blockchain")}
              className={`rounded-br-2xl ${companyCommonStyles}`}
            >
              Blockchain
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          {/* Ethereum Card */}
          <div
            onClick={handleCopyAddress}
            title={currentAccount ? "Click to copy address" : "Connect real wallet to view address"}
            className="p-3 flex justify-end items-start flex-col rounded-xl h-44 sm:w-72 w-full my-5 eth-card white-glassmorphism cursor-pointer hover:scale-[1.02] transition-transform shadow-xl relative"
          >
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center shadow">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <div className="flex items-center space-x-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full text-white text-xs">
                  <BsInfoCircle fontSize={14} color="#fff" />
                  <span>{copied ? "Copied!" : "ETH"}</span>
                </div>
              </div>
              <div>
                <p className="text-white font-light text-sm font-mono">
                  {currentAccount ? shortenAddress(currentAccount) : "0x... (No Wallet Connected)"}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-white font-semibold text-lg">
                    Ethereum
                  </p>
                  <p className="text-white text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-md">
                    {currentAccount ? `${balance} ETH` : "0.00 ETH"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism shadow-2xl">
            <div className="w-full flex justify-between items-center mb-1">
              <span className="text-xs text-gray-300 font-semibold uppercase tracking-wider">
                Send Transaction
              </span>
              <span className="text-xs text-gray-400">
                {currentAccount ? "Real Wallet Connected" : "Connect Wallet to Send"}
              </span>
            </div>

            <Input
              placeholder="Address To (0x...)"
              name="addressTo"
              type="text"
              value={formData.addressTo}
              handleChange={handleChange}
            />
            <Input
              placeholder="Amount (ETH)"
              name="amount"
              type="number"
              value={formData.amount}
              handleChange={handleChange}
            />
            <Input
              placeholder="Keyword (Gif receipt)"
              name="keyword"
              type="text"
              value={formData.keyword}
              handleChange={handleChange}
            />
            <Input
              placeholder="Enter Message"
              name="message"
              type="text"
              value={formData.message}
              handleChange={handleChange}
            />

            <div className="h-[1px] w-full bg-gray-400/40 my-2" />

            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="text-white w-full mt-2 border-[1px] p-2.5 border-[#3d4f7c] bg-[#2952e3] hover:bg-[#2546bd] rounded-full cursor-pointer font-semibold shadow-lg transition-all active:scale-98"
              >
                Send now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
