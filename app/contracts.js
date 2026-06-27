import { parseAbi, getAddress } from 'viem';

export const ORACLE_ADDRESS = getAddress("0xFe58ae6Fcf47Aca9cBfB3635A5Bcf65Ff1F63A01");
export const MARKET_ADDRESS = getAddress("0x19932145C867f13C823793f642f64180A045f2C1");
export const LP_POOL_ADDRESS = getAddress("0x122cDe9E6B5678AFecB367F032d93F642F64180a");
export const BETTING_TOKEN_ADDRESS = getAddress("0x9E705abd7e3Eab9cbfB3635A5Bcf65Ff1F63A04a");

export const ORACLE_ABI = parseAbi([
  "function getAIDynamicOdds(bytes32 marketId) external view returns (uint256 oddsA, uint256 oddsB)",
  "function verifyAndGetOutcome(bytes32 marketId) external view returns (uint8 outcome)",
  "function marketInferences(bytes32 marketId) external view returns (uint256 oddsA, uint256 oddsB, uint8 finalOutcome, uint256 timestamp, bool verified)",
  "event OddsUpdated(bytes32 indexed marketId, uint256 oddsA, uint256 oddsB)",
  "event OutcomeSettled(bytes32 indexed marketId, uint8 finalOutcome)"
]);

export const MARKET_ABI = parseAbi([
  "function buyShares(bytes32 marketId, uint8 outcome, uint256 amount) external",
  "function claimRewards(bytes32 marketId) external",
  "function resolveMarket(bytes32 marketId) external",
  "function markets(bytes32 marketId) external view returns (bytes32 id, string memory matchName, uint256 matchTime, bool resolved, uint8 winningOutcome, uint256 totalCollateral, uint256 totalSharesA, uint256 totalSharesB)",
  "function sharesA(bytes32 marketId, address user) external view returns (uint256)",
  "function sharesB(bytes32 marketId, address user) external view returns (uint256)",
  "function bettingToken() external view returns (address)",
  "event MarketCreated(bytes32 indexed marketId, string matchName, uint256 matchTime)",
  "event SharesPurchased(bytes32 indexed marketId, address indexed buyer, uint8 outcome, uint256 amount, uint256 sharesIssued)",
  "event MarketResolved(bytes32 indexed marketId, uint8 winningOutcome)"
]);

export const LP_POOL_ABI = parseAbi([
  "function provideLiquidity(uint256 amount) external",
  "function withdrawLiquidity(uint256 amount) external",
  "function totalPoolFunds() external view returns (uint256)",
  "function lpBalances(address user) external view returns (uint256)",
  "event LiquidityProvided(address indexed lp, uint256 amount)",
  "event LiquidityWithdrawn(address indexed lp, uint256 amount)",
  "event DynamicRebalance(uint256 shiftedCollateral, address targetMarket)"
]);

export const ERC20_ABI = parseAbi([
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function mint(address to, uint256 amount) external",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
]);
