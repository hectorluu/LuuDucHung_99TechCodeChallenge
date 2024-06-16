import React from "react";
import { Card } from "antd";
import { CopyBlock, dracula } from "react-code-blocks";

const refactoredCode1_1 = `// Presume that the global state is managed by Redux
// I have created contexts: WalletBalancesContext and PricesContext 
// I have created DataProvider, which fetches both wallet balances and prices
// It returns like:
return (
  <WalletBalanceContext.Provider value={balances}>
    <PricesContext.Provider value={prices}>
      {error && <div>Error: {error.message}</div>}
      {children}
    </PricesContext.Provider>
  </WalletBalanceContext.Provider>

// And I have created custom hooks for those 2:
function useWalletBalances() {
  const context = useContext(WalletBalanceContext);
  if (context === undefined) {
    throw new Error('useWalletBalances must be used within a DataProvider');
  }
  return context;
}

function usePrices() {
  const context = useContext(PricesContext);
  if (context === undefined) {
    throw new Error('usePrices must be used within a DataProvider');
  }
  return context;
}
);`;

const refactoredCode1_2 = `// Let's import those hooks in dataContext.js
import { useWalletBalances, usePrices } from './dataContext';`;

const refactoredCode2 = `const BLOCKCHAIN_PRIORITIES = {
  "Osmosis": 100,
  "Ethereum": 50,
  "Arbitrum": 30,
  "Zilliqa": 20,
  "Neo": 20,
};

// This function is now simplified
// I use string instead of any for the better type safety of blockchain
const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] || -99;
};`;

const refactoredCode3 = `const sortedBalances = useMemo(() => {
  return balances
    .filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      // Fix a syntax error here of the variable lhsPriority, which was not defined
      return balancePriority > -99 && balance.amount > 0;
    })
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      } else {
        // If the priorities are equal, sort by amount
        return lhs.amount - rhs.amount;
      }
    });
}, [balances, prices]);`;

const refactoredCode4 = `const formattedBalances = useMemo(() => {
  return sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });
}, [sortedBalances]);`;

const refactoredCodeScript = `import { useWalletBalances, usePrices } from "./dataContext";

interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

const BLOCKCHAIN_PRIORITIES = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    return BLOCKCHAIN_PRIORITIES[blockchain] || -99;
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Fix a syntax error here of the variable lhsPriority, which was not defined
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        } else {
          // If the priorities are equal, sort by amount
          return lhs.amount - rhs.amount;
        }
      });
  }, [balances, prices]);

  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(),
      };
    });
  }, [sortedBalances]);

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};`;

function Solution3() {
  return (
    <Card
      title={<span style={{ fontSize: "1.3em" }}>Problem 3: Messy React</span>}
      style={{
        width: "100%",
        fontSize: "1.02rem",
        paddingLeft: "0.5em",
        paddingRight: "0.5em",
      }}
    >
      <p>
        In order to solve this problem, I need to look at the functionality of
        this component. The first thing I see is that the "Messy React" file
        defines a React component named WalletPage. The purpose of this
        component is to{" "}
        <span style={{ fontWeight: "bold" }}>
          {" "}
          display a list of wallet balances for different blockchains.
        </span>
      </p>
      <br />
      <p>
        Now let's go over the computational inefficiencies and anti-patterns
        that I found.
      </p>
      <ul>
        <li>
          <p>
            {" "}
            <span style={{ fontWeight: "bold" }}>
              1. Custom hooks useWalletBalances and usePrices:
            </span>{" "}
            These hooks make requests every time the component is re-rendered.
          </p>
          <p>
            It would be more useful to use global states to store the balances
            and prices and only fetch new data when necessary. Also, these hooks
            lack of handling errors , so it could lead to unhandled exceptions.
          </p>
          <CopyBlock
            text={refactoredCode1_1}
            language={"jsx"}
            showLineNumbers={true}
            wrapLines
            theme={dracula}
          />
          <p>
            And I can keep the same code in the file after importing my hooks
          </p>
          <CopyBlock
            text={refactoredCode1_2}
            language={"jsx"}
            showLineNumbers={true}
            wrapLines
            theme={dracula}
          />
        </li>
        <li className="gap-top">
          <p>
            <span style={{ fontWeight: "bold" }}>
              2. Function{" "}
              <span style={{ fontStyle: "italic" }}>getPriority</span>:
            </span>{" "}
            This code is hard to read and expand.
          </p>
          <p>
            Therefore, I would suggest to simply create a constant for the
            priorities:
          </p>
          <CopyBlock
            text={refactoredCode2}
            language={"jsx"}
            showLineNumbers={true}
            wrapLines
            theme={dracula}
          />
        </li>
        <li className="gap-top">
          <p>
            <span style={{ fontWeight: "bold" }}>
              3. False logic at filtering and sorting balances:{" "}
            </span>
            It seems that the filter function is currently returning true for
            balances with an amount less than or equal to 0 and a priority
            greater than -99{" "}
            {"(It is either Osmosis, Ethereum, Arbitrum, Zilliqa or Neo)"}.
            Therefore, the logic should be that we filter out balances with an
            amount of 0 or less.
          </p>
          <p>
            It also lacks of handling the equal case as well. Here's the
            refactored code:
          </p>
          <CopyBlock
            text={refactoredCode3}
            language={"jsx"}
            showLineNumbers={true}
            wrapLines
            theme={dracula}
          />
        </li>
        <li className="gap-top">
          <p>
            <span style={{ fontWeight: "bold" }}>4. Formatting balances:</span>{" "}
            formatting is done every time the component renders as well.
          </p>
          <p>
            It would be better to use the useMemo hook to memoize the formatted.
          </p>
          <CopyBlock
            text={refactoredCode4}
            language={"jsx"}
            showLineNumbers={true}
            wrapLines
            theme={dracula}
          />
        </li>
        <p style={{ marginTop: "2rem", marginBottom: "1rem" }}>
          And here is my finally refactored code for the WalletPage component:
        </p>
        <CopyBlock
          text={refactoredCodeScript}
          language={"jsx"}
          showLineNumbers={true}
          wrapLines
          theme={dracula}
        />
      </ul>
      {/* <CopyBlock
        text={script}
        language={"jsx"}
        showLineNumbers={true}
        wrapLines
        theme={dracula}
      /> */}
    </Card>
  );
}

export default Solution3;
