import React, { useContext } from "react";

import { TransactionContext } from "../context/TransactionContext";
import useFetch from "../hooks/useFetch";
import dummyData from "../utils/dummyData";
import { shortenAddress } from "../utils/shortenAddress";

const TransactionsCard = ({ addressTo, addressFrom, timestamp, message, keyword, amount, url }) => {
  const gifUrl = useFetch({ keyword });

  return (
    <div className="bg-[#181918] m-4 flex flex-1
      2xl:min-w-[450px]
      2xl:max-w-[500px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      flex-col p-3 rounded-md hover:shadow-2xl transition-transform hover:scale-[1.01]"
    >
      <div className="flex flex-col items-center w-full mt-3">
        <div className="display-flex justify-start w-full mb-6 p-2">
          <a
            href={`https://etherscan.io/address/${addressFrom}`}
            target="_blank"
            rel="noreferrer"
            className="hover:underline hover:text-blue-400"
          >
            <p className="text-white text-base">From: {shortenAddress(addressFrom)}</p>
          </a>
          <a
            href={`https://etherscan.io/address/${addressTo}`}
            target="_blank"
            rel="noreferrer"
            className="hover:underline hover:text-blue-400"
          >
            <p className="text-white text-base">To: {shortenAddress(addressTo)}</p>
          </a>
          <p className="text-white text-base font-semibold">Amount: {amount} ETH</p>
          {message && (
            <>
              <br />
              <p className="text-white text-base">Message: {message}</p>
            </>
          )}
        </div>
        <img
          src={gifUrl || url}
          alt={keyword || "transaction"}
          className="w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover"
        />
        <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl border border-white/10">
          <p className="text-[#37c7da] font-bold text-sm">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const { transactions, currentAccount, connectWallet } = useContext(TransactionContext);

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4 items-center">
        {currentAccount ? (
          <h3 className="text-white text-3xl text-center my-2">
            Latest Transactions
          </h3>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-white text-2xl sm:text-3xl text-center my-2">
              Connect your account to see your latest transactions
            </h3>
            <button
              type="button"
              onClick={connectWallet}
              className="mt-3 bg-[#2952e3] hover:bg-[#2546bd] text-white px-6 py-2.5 rounded-full font-semibold text-sm cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              Connect Wallet Now
            </button>
          </div>
        )}

        <div className="flex flex-wrap justify-center items-center mt-10">
          {[...dummyData, ...transactions].reverse().map((transaction, i) => (
            <TransactionsCard key={i} {...transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
