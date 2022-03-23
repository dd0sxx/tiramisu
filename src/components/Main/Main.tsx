import { Contract } from "ethers";
import { FC, useState } from "react";

import { Notification } from "../../notifications/Notification";
import { notificationMessages } from "../../notifications/notificationMessages";
import { AppStage, AppState } from "../../state/AppState";
import { checkHowManyTokensLeft } from "../../wallet/checkHowManyTokensLeft";

type WalletActionsAndContract = {
  connectWallet: () => Promise<void>;
  contract: Contract;
  startMintingProcess: () => void;
};

const contentByAppStage: Record<
  AppStage,
  {
    BelowHeader: FC<WalletActionsAndContract>;
    Header: FC<WalletActionsAndContract>;
    className: string;
    imgSrc: string;
  }
> = {
  [AppStage.connected]: {
    BelowHeader: () => null,
    Header: ({ startMintingProcess, contract }) => {
      const [howManyTokensLeft, setHowManyTokensLeft] = useState<number | null>(
        null,
      );

      checkHowManyTokensLeft({ contract }).then(howManyTokensLeft =>
        setHowManyTokensLeft(howManyTokensLeft),
      );

      if (howManyTokensLeft === null) {
        return null;
      }

      return (
        <>
          <h1>{`${howManyTokensLeft} left...`}</h1>
          <button className="button-under-header" onClick={startMintingProcess}>
            Mint Tiramisu
          </button>
        </>
      );
    },
    className: "connected",
    imgSrc: "/imgs/zap_multicolor_no-bg.gif",
  },
  [AppStage.disconnected]: {
    BelowHeader: ({ connectWallet }) => (
      <button className="button-under-header" onClick={connectWallet}>
        Connect Wallet
      </button>
    ),
    Header: () => <h1>{"tiramisu recipe..."}</h1>,
    className: "disconnected",
    imgSrc: "/imgs/rainbow-EX.gif",
  },
  [AppStage.notOnPreMintList]: {
    BelowHeader: () => (
      <div className="text-under-header">
        the wallet you have connected isn’t on our premint list
      </div>
    ),
    Header: () => <h1>{"sorry..."}</h1>,
    className: "notOnPreMintList",
    imgSrc: "/imgs/rotten_no--bg.gif",
  },
};

const MainImg: FC<{ appState: AppState }> = ({ appState }) => {
  return (
    <>
      <img
        className={contentByAppStage[appState.stage].className}
        src={contentByAppStage[appState.stage].imgSrc}
      />
      <style jsx>{`
        .connected {
          width: 266px;
        }
        .disconnected {
          width: 273px;
          margin: 0 0 -55px;
        }
        .notOnPreMintList {
          width: 288px;
        }
      `}</style>
    </>
  );
};

export const Main: FC<{
  appState: AppState;
  connectWalletAndHandleResult: () => Promise<void>;
  contract: Contract;
  notifications: Notification[];
  startMintingProcess: () => void;
}> = ({
  appState,
  connectWalletAndHandleResult,
  startMintingProcess,
  notifications,
  contract,
}) => {
  const { BelowHeader, Header } = contentByAppStage[appState.stage];

  return (
    <>
      <div className="main-wrapper">
        <main>
          <MainImg appState={appState} />
          <Header
            connectWallet={connectWalletAndHandleResult}
            startMintingProcess={startMintingProcess}
            contract={contract}
          />
          <BelowHeader
            connectWallet={connectWalletAndHandleResult}
            startMintingProcess={startMintingProcess}
            contract={contract}
          />
          {notifications?.length > 0 && (
            <div className="notification">
              {notifications[notifications.length - 1].overrideText ||
                notificationMessages[
                  notifications[notifications.length - 1].type
                ]}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .main-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
        }
        main {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        :global(.button-under-header) {
          margin-top: 25px;
        }
        :global(.text-under-header) {
          margin-top: 28px;
        }

        .notification {
          margin-top: 20px;
        }
      `}</style>
    </>
  );
};
