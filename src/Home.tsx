import { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import { Button, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

import wallet from "./assets/images/wallet.png";

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "./candy-machine";
import Slots from "./components/slot-machine";

const ConnectButton = styled(WalletDialogButton)``;

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div``; // add your styles here

const MintButton = styled(Button)`
  background-color: yellow;
`; // add your styles here

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}

const Home = (props: HomeProps) => {
  const [balance, setBalance] = useState<number>();
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(props.startDate));

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const refreshCandyMachineState = () => {
    (async () => {
      if (!wallet) return;

      const {
        candyMachine,
        goLiveDate,
        itemsAvailable,
        itemsRemaining,
        itemsRedeemed,
      } = await getCandyMachineState(
        wallet as anchor.Wallet,
        props.candyMachineId,
        props.connection
      );

      setItemsAvailable(itemsAvailable);
      setItemsRemaining(itemsRemaining);
      setItemsRedeemed(itemsRedeemed);

      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
    })();
  };

  const onMint = async () => {
    try {
      setIsMinting(true);
      if (wallet && candyMachine?.program) {
        const mintTxId = await mintOneToken(
          candyMachine,
          props.config,
          wallet.publicKey,
          props.treasury
        );

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          props.connection,
          "singleGossip",
          false
        );

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
      refreshCandyMachineState();
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(refreshCandyMachineState, [
    wallet,
    props.candyMachineId,
    props.connection,
  ]);

  return (
    <main>
      <div className="hour-glass">
        {/* <div> */}
        <svg
          width="50px"
          height="60px"
          viewBox="0 0 73 88"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          // xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g id="hourglass">
            <path
              d="M63.8761664,86 C63.9491436,84.74063 64,83.4707791 64,82.1818182 C64,65.2090455 57.5148507,50.6237818 48.20041,44 C57.5148507,37.3762182 64,22.7909545 64,5.81818182 C64,4.52922091 63.9491436,3.25937 63.8761664,2 L10.1238336,2 C10.0508564,3.25937 10,4.52922091 10,5.81818182 C10,22.7909545 16.4851493,37.3762182 25.79959,44 C16.4851493,50.6237818 10,65.2090455 10,82.1818182 C10,83.4707791 10.0508564,84.74063 10.1238336,86 L63.8761664,86 Z"
              id="glass"
              fill="#ECF1F6"
            ></path>
            <rect
              id="top-plate"
              fill="#4D4544"
              x="0"
              y="0"
              width="74"
              height="8"
              rx="2"
            ></rect>
            <rect
              id="bottom-plate"
              fill="#4D4544"
              x="0"
              y="80"
              width="74"
              height="8"
              rx="2"
            ></rect>

            <g id="top-sand" transform="translate(18, 21)">
              <clipPath id="top-clip-path" fill="white">
                <rect x="0" y="0" width="38" height="21"></rect>
              </clipPath>

              <path
                fill="#F5A623"
                clip-path="url(#top-clip-path)"
                d="M38,0 C36.218769,7.51704545 24.818769,21 19,21 C13.418769,21 1.9,7.63636364 0,0 L38,0 Z"
              ></path>
            </g>

            <g id="bottom-sand" transform="translate(18, 55)">
              <clipPath id="bottom-clip-path" fill="white">
                <rect x="0" y="0" width="38" height="21"></rect>
              </clipPath>

              <g clip-path="url(#bottom-clip-path)">
                <path
                  fill="#F5A623"
                  d="M0,21 L38,21 C36.1,13.3636364 24.581231,0 19,0 C13.181231,0 1.781231,13.4829545 0,21 Z"
                ></path>
              </g>
            </g>
          </g>
        </svg>
        {/* </div> */}
      </div>
      {/* <p className="home-title">
        SURF
        <b>
          KOOK<sup>Z</sup>
        </b>
      </p> */}

      <img id = "logo-title" src="./surfkookz-logo-title.png" />


      {/* {wallet && (
        <p>Wallet {shortenAddress(wallet.publicKey.toBase58() || "")}</p>
      )}

      {wallet && <p>Balance: {(balance || 0).toLocaleString()} SOL</p>}

      {wallet && <p>Total Available: {itemsAvailable}</p>}

      {wallet && <p>Redeemed: {itemsRedeemed}</p>}

      {wallet && <p>Remaining: {itemsRemaining}</p>} */}



      <MintContainer>
        {!wallet ? (
          <ConnectButton>Connect Wallet</ConnectButton>
        ) : (
          <>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.8.4/umd/react.production.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.8.4/umd/react-dom.production.min.js"></script>
            <div id="react-root"></div>
            <Slots />

            <MintButton
              disabled={isSoldOut || isMinting || !isActive}
              onClick={onMint}
              variant="contained"
            >
              {isSoldOut ? (
                "SOLD OUT"
              ) : isActive ? (
                isMinting ? (
                  <CircularProgress />
                ) : (
                  "MINT"
                )
              ) : (
                <Countdown
                  date={startDate}
                  onMount={({ completed }) => completed && setIsActive(true)}
                  onComplete={() => setIsActive(true)}
                  renderer={renderCounter}
                />
              )}
            </MintButton>
          </>
        )}
      </MintContainer>

      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>

      <br />
      <h1>Minting starts at 9 PM UTC</h1>
      <p>FOR PROJECT WHITEPAPER CHECK</p>
      <a href="#" id="image-container">
        <img src={"./wallet.png"} alt="altt" className="social-icons" />
        <div className="top">
          {wallet && (
            <>
              <p className="wallet">
              {(balance || 0).toFixed(2)} <br />
                <div style={{textAlign: 'center'}}>
                  SOL
                  </div>
              </p>
            </>
          )}
        </div>
      </a>
      <a href="https://surfkookz.gitbook.io/getting-started/">
        <img id="gitBookLogo" className="grow" src={"/GitBook.png"} />
      </a>
      <div className="social-links">
        <a href="https://discord.gg/uWYcBM4R68">
          <img className="social-icon grow" src="./discord.svg" />
        </a>
        <a href="https://twitter.com/surfKookz">
          <img className="social-icon grow" src="./twitter.svg" />
        </a>
        <a href="https://www.instagram.com/surfkookz/">
          <img className="social-icon grow" src="./instagram.svg" />
        </a>
      </div>
    </main>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours + (days || 0) * 24} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};

export default Home;
