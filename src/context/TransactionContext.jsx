import React, { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const getEthereumObject = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return window.ethereum;
  }
  return null;
};

const createEthereumContract = () => {
  const ethereum = getEthereumObject();
  if (!ethereum) return null;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionCount, setTransactionCount] = useState(
    typeof window !== "undefined" ? localStorage.getItem("transactionCount") : null
  );
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      const ethereum = getEthereumObject();
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        if (!transactionsContract) return;

        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex, 16) / (10 ** 18),
        }));

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        console.log("MetaMask not detected");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts && accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      const ethereum = getEthereumObject();
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        if (!transactionsContract) return;
        const currentTransactionCount = await transactionsContract.getTransactionCount();

        if (typeof window !== "undefined") {
          window.localStorage.setItem("transactionCount", currentTransactionCount);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      setErrorMessage("");
      const ethereum = getEthereumObject();
      if (!ethereum) {
        setErrorMessage("MetaMask is not installed or not available in this browser window. Please install MetaMask to interact with the Ethereum network.");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      if (accounts && accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error?.message || "Failed to connect wallet.");
    }
  };

  const sendTransaction = async () => {
    try {
      setErrorMessage("");
      const ethereum = getEthereumObject();
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = createEthereumContract();
        if (!transactionsContract) {
          setErrorMessage("Smart contract could not be loaded.");
          return;
        }
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",
            value: parsedAmount._hex,
          }],
        });

        const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount = await transactionsContract.getTransactionCount();

        setTransactionCount(transactionsCount.toNumber());
        getAllTransactions();
        setformData({ addressTo: "", amount: "", keyword: "", message: "" });
      } else {
        setErrorMessage("MetaMask is not connected. Please connect your wallet first.");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setErrorMessage(error?.message || "Transaction failed.");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  const contextValue = useMemo(
    () => ({
      transactionCount,
      connectWallet,
      transactions,
      currentAccount,
      isLoading,
      sendTransaction,
      handleChange,
      formData,
      errorMessage,
      setErrorMessage,
    }),
    [
      transactionCount,
      connectWallet,
      transactions,
      currentAccount,
      isLoading,
      sendTransaction,
      handleChange,
      formData,
      errorMessage,
      setErrorMessage,
    ],
  );

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};
