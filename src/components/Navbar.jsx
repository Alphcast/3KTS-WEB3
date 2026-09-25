import React, { useContext } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

import logo from "../../images/logo.png";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";

const NavBarItem = ({ title, classprops, handleClick }) => (
  <li className={`mx-4 ${classprops}`}>
    <button
      type="button"
      onClick={handleClick}
      className="bg-transparent border-none text-white cursor-pointer hover:text-blue-400 transition-colors p-0 text-base"
    >
      {title}
    </button>
  </li>
);

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);
  const { currentAccount, connectWallet, setActiveModal } = useContext(TransactionContext);

  const handleNavClick = (item) => {
    setToggleMenu(false);
    if (item === "Market") {
      setActiveModal("market");
    } else if (item === "Exchange") {
      const el = document.getElementById("exchange");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (item === "Tutorials") {
      setActiveModal("tutorials");
    } else if (item === "Wallets") {
      setActiveModal("wallets");
    }
  };

  const handleAuthClick = () => {
    setToggleMenu(false);
    if (!currentAccount) {
      connectWallet();
    } else {
      setActiveModal("wallets");
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <button
          type="button"
          onClick={scrollToTop}
          className="cursor-pointer bg-transparent border-none p-0 flex items-center"
        >
          <img src={logo} alt="logo" className="w-32 cursor-pointer" />
        </button>
      </div>

      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
          <NavBarItem
            key={item + index}
            title={item}
            handleClick={() => handleNavClick(item)}
          />
        ))}

        <li className="mx-4">
          <button
            type="button"
            onClick={handleAuthClick}
            className="bg-[#2952e3] py-2 px-7 rounded-full cursor-pointer hover:bg-[#2546bd] text-white font-semibold transition-all shadow-md active:scale-95 border-none"
          >
            {currentAccount ? shortenAddress(currentAccount) : "Login"}
          </button>
        </li>
      </ul>

      <div className="flex relative">
        {!toggleMenu && (
          <button
            type="button"
            onClick={() => setToggleMenu(true)}
            className="text-white md:hidden cursor-pointer bg-transparent border-none p-1"
          >
            <HiMenuAlt4 fontSize={28} />
          </button>
        )}
        {toggleMenu && (
          <button
            type="button"
            onClick={() => setToggleMenu(false)}
            className="text-white md:hidden cursor-pointer bg-transparent border-none p-1"
          >
            <AiOutlineClose fontSize={28} />
          </button>
        )}
        {toggleMenu && (
          <ul
            className="z-50 fixed -top-0 -right-2 p-4 w-[75vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2 flex justify-end">
              <button
                type="button"
                onClick={() => setToggleMenu(false)}
                className="bg-transparent border-none text-white p-2 cursor-pointer"
              >
                <AiOutlineClose fontSize={24} />
              </button>
            </li>
            {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
              <NavBarItem
                key={item + index}
                title={item}
                classprops="my-3 text-lg w-full text-right"
                handleClick={() => handleNavClick(item)}
              />
            ))}
            <li className="my-4">
              <button
                type="button"
                onClick={handleAuthClick}
                className="bg-[#2952e3] py-2 px-6 rounded-full cursor-pointer hover:bg-[#2546bd] text-white font-semibold border-none"
              >
                {currentAccount ? shortenAddress(currentAccount) : "Login"}
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
