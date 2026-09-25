import React, { useEffect, useState, useMemo, useCallback } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const PUBLIC_ETH_RPC = "https://ethereum.publicnode.com";

const getEthereumObject = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return window.ethereum;
  }
  return null;
};

const getPublicProvider = () => {
  try {
    return new ethers.providers.JsonRpcProvider(PUBLIC_ETH_RPC);
  } catch (err) {
    console.error("Public RPC init error:", err);
    return null;
  }
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
  const [currentAccount, setCurrentAccount] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("krypt_wallet_address") || "";
    }
    return "";
  });
  const [walletType, setWalletType] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("krypt_wallet_type") || "";
    }
    return "";
  });
  const [balance, setBalance] = useState("0.00");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeModal, setActiveModal] = useState(null); // 'market' | 'tutorials' | 'wallets' | 'add-wallet' | null
  const [transactionCount, setTransactionCount] = useState(
    typeof window !== "undefined" ? localStorage.getItem("transactionCount") || "0" : "0",
  );
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
    if (errorMessage) setErrorMessage("");
  };

  const fetchLiveBalance = useCallback(async (address) => {
    if (!address || !ethers.utils.isAddress(address)) return;
    try {
      const ethereum = getEthereumObject();
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const bal = await provider.getBalance(address);
        setBalance(parseFloat(ethers.utils.formatEther(bal)).toFixed(4));
        return;
      }

      const publicProvider = getPublicProvider();
      if (publicProvider) {
        const bal = await publicProvider.getBalance(address);
        setBalance(parseFloat(ethers.utils.formatEther(bal)).toFixed(4));
      }
    } catch (err) {
      console.log("Error fetching on-chain balance:", err);
    }
  }, []);

  const addRealWallet = useCallback(async (customAddress) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      if (!customAddress || typeof customAddress !== "string") {
        setErrorMessage("Please enter an Ethereum address.");
        return { success: false, error: "Please enter an Ethereum address." };
      }

      const trimmed = customAddress.trim();

      if (!ethers.utils.isAddress(trimmed)) {
        const msg = "Invalid Ethereum address format. It must start with '0x' followed by 40 hex characters.";
        setErrorMessage(msg);
        return { success: false, error: msg };
      }

      const checksummed = ethers.utils.getAddress(trimmed);
      setCurrentAccount(checksummed);
      setWalletType("manual");

      if (typeof window !== "undefined") {
        localStorage.setItem("krypt_wallet_address", checksummed);
        localStorage.setItem("krypt_wallet_type", "manual");
      }

      await fetchLiveBalance(checksummed);
      setSuccessMessage(`Real wallet added: ${checksummed.slice(0, 6)}...${checksummed.slice(-4)}`);
      setActiveModal(null);
      return { success: true };
    } catch (err) {
      const msg = err?.message || "Failed to add wallet address.";
      setErrorMessage(msg);
      return { success: false, error: msg };
    }
  }, [fetchLiveBalance]);

  const disconnectWallet = useCallback(() => {
    setCurrentAccount("");
    setWalletType("");
    setBalance("0.00");
    if (typeof window !== "undefined") {
      localStorage.removeItem("krypt_wallet_address");
      localStorage.removeItem("krypt_wallet_type");
    }
    setSuccessMessage("Wallet disconnected.");
  }, []);

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

        setTransactions(structuredTransactions);
        const count = await transactionsContract.getTransactionCount();
        if (count) {
          setTransactionCount(count.toNumber().toString());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = useCallback(async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      const ethereum = getEthereumObject();

      if (!ethereum) {
        // Open the wallet modal so the user can enter their own real Ethereum wallet address
        setActiveModal("wallets");
        setErrorMessage("MetaMask is not detected in this window. You can add your real Ethereum wallet address below!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      if (accounts && accounts.length) {
        const account = accounts[0];
        setCurrentAccount(account);
        setWalletType("metamask");
        if (typeof window !== "undefined") {
          localStorage.setItem("krypt_wallet_address", account);
          localStorage.setItem("krypt_wallet_type", "metamask");
        }
        await fetchLiveBalance(account);
        setSuccessMessage(`Connected MetaMask: ${account.slice(0, 6)}...${account.slice(-4)}`);
        getAllTransactions();
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error?.message || "MetaMask connection was cancelled or rejected.");
      setActiveModal("wallets");
    }
  }, [fetchLiveBalance]);

  const checkIfWalletIsConnect = async () => {
    try {
      const ethereum = getEthereumObject();
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts && accounts.length) {
          const account = accounts[0];
          setCurrentAccount(account);
          setWalletType("metamask");
          await fetchLiveBalance(account);
          getAllTransactions();
          return;
        }
      }

      // Check saved manual real wallet
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("krypt_wallet_address");
        if (saved && ethers.utils.isAddress(saved)) {
          setCurrentAccount(saved);
          fetchLiveBalance(saved);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendTransaction = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const { addressTo, amount, keyword, message } = formData;

      if (!currentAccount) {
        setErrorMessage("Please connect or add your real Ethereum wallet first.");
        setActiveModal("wallets");
        return;
      }

      if (!addressTo || !addressTo.trim()) {
        setErrorMessage("Please enter a recipient Ethereum address.");
        return;
      }

      if (!ethers.utils.isAddress(addressTo.trim())) {
        setErrorMessage("Recipient address is not a valid Ethereum address.");
        return;
      }

      if (!amount || parseFloat(amount) <= 0) {
        setErrorMessage("Please enter an amount greater than 0 ETH.");
        return;
      }

      if (!keyword || !keyword.trim()) {
        setErrorMessage("Please enter a keyword for your transaction GIF receipt.");
        return;
      }

      if (!message || !message.trim()) {
        setErrorMessage("Please enter a transaction note or message.");
        return;
      }

      setIsLoading(true);

      const ethereum = getEthereumObject();
      const parsedAmount = ethers.utils.parseEther(amount);

      if (ethereum) {
        // Real Web3 Provider on-chain transfer
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const tx = await signer.sendTransaction({
          to: addressTo.trim(),
          value: parsedAmount,
        });

        console.log("Transaction submitted, hash:", tx.hash);

        // Optionally record on the smart contract if available
        try {
          const transactionsContract = createEthereumContract();
          if (transactionsContract) {
            const contractTx = await transactionsContract.addToBlockchain(addressTo.trim(), parsedAmount, message, keyword);
            await contractTx.wait();
          }
        } catch (contractErr) {
          console.log("Contract tracking note:", contractErr);
        }

        await tx.wait();

        const newTx = {
          addressTo: addressTo.trim(),
          addressFrom: currentAccount,
          timestamp: new Date().toLocaleString(),
          message,
          keyword,
          amount: parseFloat(amount),
          hash: tx.hash,
        };

        setTransactions((prev) => [newTx, ...prev]);
        await fetchLiveBalance(currentAccount);
        setSuccessMessage(`Transaction confirmed! Sent ${amount} ETH to ${addressTo.slice(0, 6)}...${addressTo.slice(-4)}`);
        setformData({ addressTo: "", amount: "", keyword: "", message: "" });
      } else {
        // User has added a real address without an injected browser extension in this window.
        // Prompt them to connect MetaMask or sign via deep-link
        setIsLoading(false);
        setErrorMessage(
          "MetaMask extension is required to sign this transaction directly in the browser. Please open Krypt in a Web3 browser or install MetaMask extension.",
        );
        return;
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setErrorMessage(error?.message || "Transaction failed or was rejected in your wallet.");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  // Listen to accounts changed in MetaMask
  useEffect(() => {
    const ethereum = getEthereumObject();
    if (ethereum && ethereum.on) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          setWalletType("metamask");
          fetchLiveBalance(accounts[0]);
        } else {
          disconnectWallet();
        }
      };

      ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
    return undefined;
  }, [fetchLiveBalance, disconnectWallet]);

  const contextValue = useMemo(
    () => ({
      transactionCount,
      connectWallet,
      addRealWallet,
      disconnectWallet,
      transactions,
      currentAccount,
      walletType,
      balance,
      fetchLiveBalance,
      isLoading,
      sendTransaction,
      handleChange,
      formData,
      errorMessage,
      setErrorMessage,
      successMessage,
      setSuccessMessage,
      activeModal,
      setActiveModal,
    }),
    [
      transactionCount,
      connectWallet,
      addRealWallet,
      disconnectWallet,
      transactions,
      currentAccount,
      walletType,
      balance,
      fetchLiveBalance,
      isLoading,
      sendTransaction,
      handleChange,
      formData,
      errorMessage,
      setErrorMessage,
      successMessage,
      setSuccessMessage,
      activeModal,
      setActiveModal,
    ],
  );

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};
