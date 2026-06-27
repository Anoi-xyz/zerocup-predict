'use client';

import React, { useState, useEffect } from 'react';
import { 
  useAccount, 
  useConnect, 
  useDisconnect, 
  useBalance,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain
} from 'wagmi';
import { 
  Trophy, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  Wallet, 
  LogOut, 
  ArrowRightLeft, 
  CheckCircle2, 
  Activity,
  Coins,
  ExternalLink
} from 'lucide-react';
import { 
  MARKET_ADDRESS, 
  MARKET_ABI, 
  ORACLE_ADDRESS, 
  ORACLE_ABI, 
  BETTING_TOKEN_ADDRESS, 
  ERC20_ABI 
} from './contracts';
import { ethers } from 'ethers';

const FLAG_MAP = {
  "Portugal": "pt",
  "Uzbekistan": "uz",
  "England": "gb-eng",
  "Ghana": "gh",
  "Panama": "pa",
  "Croatia": "hr",
  "Colombia": "co",
  "DR Congo": "cd",
  "Switzerland": "ch",
  "Canada": "ca",
  "Brazil": "br",
  "Scotland": "gb-sct",
  "Bosnia & Herzegovina": "ba",
  "Qatar": "qa",
  "Morocco": "ma",
  "Haiti": "ht",
  "South Africa": "za",
  "South Korea": "kr",
  "Czech Republic": "cz",
  "Mexico": "mx",
  "Ecuador": "ec",
  "Germany": "de",
  "Curacao": "cw",
  "Ivory Coast": "ci",
  "Tunisia": "tn",
  "Netherlands": "nl",
  "Japan": "jp",
  "Sweden": "se",
  "Paraguay": "py",
  "Australia": "au",
  "Turkey": "tr",
  "USA": "us",
  "Norway": "no",
  "France": "fr",
  "Senegal": "sn",
  "Iraq": "iq",
  "Uruguay": "uy",
  "Spain": "es",
  "Cape Verde": "cv",
  "Saudi Arabia": "sa",
  "New Zealand": "nz",
  "Belgium": "be",
  "Egypt": "eg",
  "Iran": "ir",
  "Jordan": "jo",
  "Argentina": "ar",
  "Algeria": "dz",
  "Austria": "at"
};

// Simulated TEE Oracle Enclave signature logs
const INITIAL_LOGS = [
  { time: "20:15:02", type: "TEE", msg: "Enclave initialized with model: ZeroCup-RNN-v1.2.weight" },
  { time: "20:15:05", type: "0G DA", msg: "Successfully subscribed to telemetry stream for POR_UZB_2026" },
  { time: "20:15:10", type: "TEE", msg: "Initial odds set: Team A (50.00%) | Team B (50.00%) | Draw (0.00%)" },
  { time: "20:15:12", type: "0G L1", msg: "Signature verified on-chain. Dynamic odds established. Block #109485" },
];

const FIXTURES = [
  {
    id: "POR_UZB_2026",
    teamA: "Portugal",
    teamB: "Uzbekistan",
    group: "Group K",
    scoreA: 0,
    scoreB: 0,
    time: "18:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 23, 18:00 WAT",
    oddsA: 0.75,
    oddsB: 0.25,
    telemetry: "Pre-match: Portugal is heavily favored to top Group K.",
    timestamp: 1782243600
  },
  {
    id: "ENG_GHA_2026",
    teamA: "England",
    teamB: "Ghana",
    group: "Group L",
    scoreA: 0,
    scoreB: 0,
    time: "21:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 23, 21:00 WAT",
    oddsA: 0.68,
    oddsB: 0.32,
    telemetry: "Pre-match: Ghana's physical pace will challenge England's build-up.",
    timestamp: 1782254400
  },
  {
    id: "PAN_CRO_2026",
    teamA: "Panama",
    teamB: "Croatia",
    group: "Group L",
    scoreA: 0,
    scoreB: 0,
    time: "00:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 24, 00:00 WAT",
    oddsA: 0.30,
    oddsB: 0.70,
    telemetry: "Pre-match: Croatia seeks to dominate the possession through Modrić.",
    timestamp: 1782265200
  },
  {
    id: "COL_COD_2026",
    teamA: "Colombia",
    teamB: "DR Congo",
    group: "Group K",
    scoreA: 0,
    scoreB: 0,
    time: "03:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 24, 03:00 WAT",
    oddsA: 0.65,
    oddsB: 0.35,
    telemetry: "Pre-match: Colombia's high-pressing style versus DR Congo's counter.",
    timestamp: 1782276000
  },
  // June 24
  {
    id: "SUI_CAN_2026",
    teamA: "Switzerland",
    teamB: "Canada",
    group: "Group B",
    scoreA: 0,
    scoreB: 0,
    time: "20:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 24, 20:00 WAT",
    oddsA: 0.52,
    oddsB: 0.48,
    telemetry: "Pre-match: Even matchup, crucial for runner-up spot in Group B.",
    timestamp: 1782337200
  },
  {
    id: "BIH_QAT_2026",
    teamA: "Bosnia & Herzegovina",
    teamB: "Qatar",
    group: "Group A",
    scoreA: 0,
    scoreB: 0,
    time: "20:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 24, 20:00 WAT",
    oddsA: 0.60,
    oddsB: 0.40,
    telemetry: "Pre-match: Bosnia looks to control the midfield against Qatar.",
    timestamp: 1782337200
  },
  {
    id: "SCO_BRA_2026",
    teamA: "Scotland",
    teamB: "Brazil",
    group: "Group C",
    scoreA: 0,
    scoreB: 0,
    time: "23:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 24, 23:00 WAT",
    oddsA: 0.20,
    oddsB: 0.80,
    telemetry: "Pre-match: Scotland's defense prepares for Brazil's flair.",
    timestamp: 1782348000
  },
  {
    id: "MAR_HAI_2026",
    teamA: "Morocco",
    teamB: "Haiti",
    group: "Group D",
    scoreA: 0,
    scoreB: 0,
    time: "23:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 24, 23:00 WAT",
    oddsA: 0.70,
    oddsB: 0.30,
    telemetry: "Pre-match: Morocco heavily favored against Haiti.",
    timestamp: 1782348000
  },
  // June 25
  {
    id: "RSA_KOR_2026",
    teamA: "South Africa",
    teamB: "South Korea",
    group: "Group E",
    scoreA: 0,
    scoreB: 0,
    time: "02:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 25, 02:00 WAT",
    oddsA: 0.40,
    oddsB: 0.60,
    telemetry: "Pre-match: Korea hopes to start strong against Bafana Bafana.",
    timestamp: 1782358800
  },
  {
    id: "CZE_MEX_2026",
    teamA: "Czech Republic",
    teamB: "Mexico",
    group: "Group F",
    scoreA: 0,
    scoreB: 0,
    time: "02:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 25, 02:00 WAT",
    oddsA: 0.45,
    oddsB: 0.55,
    telemetry: "Pre-match: Evenly matched tie between Czechs and Mexico.",
    timestamp: 1782358800
  },
  {
    id: "ECU_GER_2026",
    teamA: "Ecuador",
    teamB: "Germany",
    group: "Group G",
    scoreA: 0,
    scoreB: 0,
    time: "21:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 25, 21:00 WAT",
    oddsA: 0.35,
    oddsB: 0.65,
    telemetry: "Pre-match: Germany challenges a robust Ecuador lineup.",
    timestamp: 1782427200
  },
  {
    id: "CUW_CIV_2026",
    teamA: "Curacao",
    teamB: "Ivory Coast",
    group: "Group H",
    scoreA: 0,
    scoreB: 0,
    time: "21:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 25, 21:00 WAT",
    oddsA: 0.25,
    oddsB: 0.75,
    telemetry: "Pre-match: Ivory Coast looks to dominate Curacao.",
    timestamp: 1782427200
  },
  // June 26
  {
    id: "TUN_NED_2026",
    teamA: "Tunisia",
    teamB: "Netherlands",
    group: "Group I",
    scoreA: 0,
    scoreB: 0,
    time: "00:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 26, 00:00 WAT",
    oddsA: 0.30,
    oddsB: 0.70,
    telemetry: "Pre-match: Dutch side faces compact Tunisian defense.",
    timestamp: 1782438000
  },
  {
    id: "JPN_SWE_2026",
    teamA: "Japan",
    teamB: "Sweden",
    group: "Group J",
    scoreA: 0,
    scoreB: 0,
    time: "00:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 26, 00:00 WAT",
    oddsA: 0.50,
    oddsB: 0.50,
    telemetry: "Pre-match: Dynamic clash between technical Japan and physical Sweden.",
    timestamp: 1782438000
  },
  {
    id: "PAR_AUS_2026",
    teamA: "Paraguay",
    teamB: "Australia",
    group: "Group A",
    scoreA: 0,
    scoreB: 0,
    time: "03:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 26, 03:00 WAT",
    oddsA: 0.48,
    oddsB: 0.52,
    telemetry: "Pre-match: Socceroos meet solid Paraguay in Group A.",
    timestamp: 1782448800
  },
  {
    id: "TUR_USA_2026",
    teamA: "Turkey",
    teamB: "USA",
    group: "Group B",
    scoreA: 0,
    scoreB: 0,
    time: "03:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 26, 03:00 WAT",
    oddsA: 0.45,
    oddsB: 0.55,
    telemetry: "Pre-match: Crucial encounter for USA in Group B.",
    timestamp: 1782448800
  },
  {
    id: "NOR_FRA_2026",
    teamA: "Norway",
    teamB: "France",
    group: "Group C",
    scoreA: 0,
    scoreB: 0,
    time: "20:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 26, 20:00 WAT",
    oddsA: 0.35,
    oddsB: 0.65,
    telemetry: "Pre-match: Haaland leads Norway against title-favorites France.",
    timestamp: 1782500400
  },
  {
    id: "SEN_IRQ_2026",
    teamA: "Senegal",
    teamB: "Iraq",
    group: "Group D",
    scoreA: 5,
    scoreB: 0,
    time: "20:00 WAT",
    status: "ENDED",
    timeLabel: "June 26, 20:00 WAT",
    oddsA: 0.68,
    oddsB: 0.32,
    telemetry: "FT: Senegal 5-0 Iraq (HT 2-0). Goals: Mané (14', 38', 72'), Sarr (51'), Jackson (84'). Cards: 2 YC Senegal, 3 YC Iraq.",
    timestamp: 1782500400,
    htScore: "2 - 0",
    oracleFinalOutcome: 1
  },
  // June 27
  {
    id: "URU_ESP_2026",
    teamA: "Uruguay",
    teamB: "Spain",
    group: "Group E",
    scoreA: 0,
    scoreB: 1,
    time: "01:00 WAT",
    status: "ENDED",
    timeLabel: "June 27, 01:00 WAT",
    oddsA: 0.42,
    oddsB: 0.58,
    telemetry: "FT: Uruguay 0-1 Spain (HT 0-0). Goal: Yamal (81'). Cards: 3 YC Uruguay, 1 YC Spain.",
    timestamp: 1782518400,
    htScore: "0 - 0",
    oracleFinalOutcome: 2
  },
  {
    id: "CPV_KSA_2026",
    teamA: "Cape Verde",
    teamB: "Saudi Arabia",
    group: "Group F",
    scoreA: 0,
    scoreB: 0,
    time: "01:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 27, 01:00 WAT",
    oddsA: 0.40,
    oddsB: 0.60,
    telemetry: "Pre-match: Saudi Arabia looks to secure midfield control.",
    timestamp: 1782518400
  },
  {
    id: "NZL_BEL_2026",
    teamA: "New Zealand",
    teamB: "Belgium",
    group: "Group G",
    scoreA: 1,
    scoreB: 5,
    time: "04:00 WAT",
    status: "ENDED",
    timeLabel: "June 27, 04:00 WAT",
    oddsA: 0.15,
    oddsB: 0.85,
    telemetry: "FT: New Zealand 1-5 Belgium (HT 1-2). Goals: Wood (29') | De Bruyne (12', 64'), Lukaku (41', 78'), Doku (88'). Cards: 1 YC NZL, 2 YC BEL.",
    timestamp: 1782529200,
    htScore: "1 - 2",
    oracleFinalOutcome: 2
  },
  {
    id: "EGY_IRN_2026",
    teamA: "Egypt",
    teamB: "Iran",
    group: "Group H",
    scoreA: 0,
    scoreB: 0,
    time: "04:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 27, 04:00 WAT",
    oddsA: 0.55,
    oddsB: 0.45,
    telemetry: "Pre-match: Tight contest expected between Egypt and Iran.",
    timestamp: 1782529200
  },
  {
    id: "PAN_ENG_2026",
    teamA: "Panama",
    teamB: "England",
    group: "Group I",
    scoreA: 0,
    scoreB: 0,
    time: "22:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 27, 22:00 WAT",
    oddsA: 0.20,
    oddsB: 0.80,
    telemetry: "Pre-match: England looks to claim 3 points in Group I.",
    timestamp: 1782594000
  },
  {
    id: "CRO_GHA_2026",
    teamA: "Croatia",
    teamB: "Ghana",
    group: "Group J",
    scoreA: 0,
    scoreB: 0,
    time: "22:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 27, 22:00 WAT",
    oddsA: 0.60,
    oddsB: 0.40,
    telemetry: "Pre-match: Croatia targets victory against structured Ghana.",
    timestamp: 1782594000
  },
  // June 28
  {
    id: "COL_POR_2026",
    teamA: "Colombia",
    teamB: "Portugal",
    group: "Group K",
    scoreA: 0,
    scoreB: 0,
    time: "00:30 WAT",
    status: "SCHEDULED",
    timeLabel: "June 28, 00:30 WAT",
    oddsA: 0.40,
    oddsB: 0.60,
    telemetry: "Pre-match: Colombia challenges Portugal in blockbuster clash.",
    timestamp: 1782603000
  },
  {
    id: "COD_UZB_2026",
    teamA: "DR Congo",
    teamB: "Uzbekistan",
    group: "Group K",
    scoreA: 0,
    scoreB: 0,
    time: "00:30 WAT",
    status: "SCHEDULED",
    timeLabel: "June 28, 00:30 WAT",
    oddsA: 0.45,
    oddsB: 0.55,
    telemetry: "Pre-match: Vital Group K match for both nations.",
    timestamp: 1782603000
  },
  {
    id: "JOR_ARG_2026",
    teamA: "Jordan",
    teamB: "Argentina",
    group: "Group A",
    scoreA: 0,
    scoreB: 0,
    time: "03:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 28, 03:00 WAT",
    oddsA: 0.10,
    oddsB: 0.90,
    telemetry: "Pre-match: Argentina expects a comfortable win against Jordan.",
    timestamp: 1782612000
  },
  {
    id: "ALG_AUT_2026",
    teamA: "Algeria",
    teamB: "Austria",
    group: "Group B",
    scoreA: 0,
    scoreB: 0,
    time: "03:00 WAT",
    status: "SCHEDULED",
    timeLabel: "June 28, 03:00 WAT",
    oddsA: 0.45,
    oddsB: 0.55,
    telemetry: "Pre-match: Balanced tie to close out Group B play.",
    timestamp: 1782612000
  }
];

export default function Home() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { data: balanceData } = useBalance({ address });

  // UI State
  const [selectedFixture, setSelectedFixture] = useState(FIXTURES[0]);
  const [betAmount, setBetAmount] = useState('50');
  const [betOutcome, setBetOutcome] = useState(1); // 1 = Team A, 2 = Team B
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [showConnectDropdown, setShowConnectDropdown] = useState(false);

  const [localBets, setLocalBets] = useState([]);
  const [claimedBets, setClaimedBets] = useState([]);

  useEffect(() => {
    if (address) {
      const betsKey = `zerocup_bets_${address}`;
      const claimedKey = `zerocup_claimed_${address}`;
      setLocalBets(JSON.parse(localStorage.getItem(betsKey) || '[]'));
      setClaimedBets(JSON.parse(localStorage.getItem(claimedKey) || '[]'));
    } else {
      setLocalBets([]);
      setClaimedBets([]);
    }
  }, [address]);

  // Web3 Write Contract Hooks
  const { writeContractAsync: approveToken, data: approveHash } = useWriteContract();
  const { writeContractAsync: buyShares, data: buyHash } = useWriteContract();

  const { isLoading: isApproveConfirming } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isBuyConfirming, isSuccess: isBuySuccess } = useWaitForTransactionReceipt({ hash: buyHash });

  // Web3 Read Contract Hooks (Mock USDC/0G Test Token Balance)
  const { data: tokenBalance } = useReadContract({
    address: BETTING_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
    query: { enabled: !!address }
  });

  // Active tab state for My Bets widget
  const [betsTab, setBetsTab] = useState('open'); // 'open' or 'history'
  const [claimingMatchId, setClaimingMatchId] = useState(null);

  // Web3 Write Contract Hooks for Claiming
  const { writeContractAsync: claimRewards, data: claimHash } = useWriteContract();
  const { isLoading: isClaimConfirming, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({ hash: claimHash });

  // Web3 Batch Reads using useReadContracts
  const { data: readResults, refetch: refetchBets } = useReadContracts({
    contracts: address ? FIXTURES.flatMap(f => {
      const id = ethers.id(f.id);
      return [
        {
          address: MARKET_ADDRESS,
          abi: MARKET_ABI,
          functionName: 'sharesA',
          args: [id, address],
          chainId: 16602
        },
        {
          address: MARKET_ADDRESS,
          abi: MARKET_ABI,
          functionName: 'sharesB',
          args: [id, address],
          chainId: 16602
        },
        {
          address: MARKET_ADDRESS,
          abi: MARKET_ABI,
          functionName: 'markets',
          args: [id],
          chainId: 16602
        },
        {
          address: ORACLE_ADDRESS,
          abi: ORACLE_ABI,
          functionName: 'marketInferences',
          args: [id],
          chainId: 16602
        }
      ];
    }) : [],
    query: {
      enabled: !!address,
    }
  });

  // Automatically refresh positions when transactions confirm
  useEffect(() => {
    if (isBuySuccess || isClaimSuccess) {
      refetchBets();
    }
  }, [isBuySuccess, isClaimSuccess, refetchBets]);

  // Parser function to compute match status dynamically
  const getMatchStatus = (fixture, resolved, oracleFinalOutcome) => {
    if (resolved || oracleFinalOutcome > 0) {
      return "ENDED";
    }
    const now = Math.floor(Date.now() / 1000);
    const matchTime = fixture.timestamp;
    const matchDuration = 7200; // 2 hours
    const halfTimeStart = 2700; // 45 minutes
    const halfTimeEnd = 3600;   // 60 minutes (45m + 15m break)
    
    if (now > matchTime + matchDuration) {
      return "ENDED";
    } else if (now >= matchTime) {
      const elapsed = now - matchTime;
      if (elapsed >= halfTimeStart && elapsed < halfTimeEnd) {
        return "HT";
      }
      return "LIVE";
    } else {
      return "SCHEDULED";
    }
  };
  // Parse and build positions dataset
  const userPositions = FIXTURES.map((fixture, index) => {
    // 1. Get live on-chain values
    let sharesA = 0n;
    let sharesB = 0n;
    let resolved = false;
    let winningOutcome = 0;
    let totalCollateral = 0n;
    let oracleFinalOutcome = 0;
    let oddsA = fixture.oddsA;
    let oddsB = fixture.oddsB;

    if (readResults && address) {
      const sharesARes = readResults[4 * index + 0];
      const sharesBRes = readResults[4 * index + 1];
      const marketRes = readResults[4 * index + 2];
      const inferenceRes = readResults[4 * index + 3];

      const getVal = (res) => {
        if (!res) return 0n;
        if (res.status === 'success') return res.result !== undefined ? res.result : 0n;
        if (res.status === undefined) return res;
        return 0n;
      };

      sharesA = getVal(sharesARes);
      sharesB = getVal(sharesBRes);

      const mResult = marketRes?.status === 'success' ? marketRes.result : (marketRes?.status === undefined ? marketRes : null);
      if (mResult && Array.isArray(mResult)) {
        resolved = mResult[3];
        winningOutcome = mResult[4];
        totalCollateral = mResult[5];
      }

      const iResult = inferenceRes?.status === 'success' ? inferenceRes.result : (inferenceRes?.status === undefined ? inferenceRes : null);
      if (iResult && Array.isArray(iResult)) {
        const contractOddsA = Number(ethers.formatEther(iResult[0]));
        const contractOddsB = Number(ethers.formatEther(iResult[1]));
        if (contractOddsA > 0 && contractOddsB > 0) {
          oddsA = contractOddsA;
          oddsB = contractOddsB;
        }
        oracleFinalOutcome = Number(iResult[2]);
      }
    }

    // 2. Check local bets database
    const localBet = localBets.find(b => b.fixtureId === fixture.id);
    const hasLivePosition = sharesA > 0n || sharesB > 0n;
    const hasPosition = hasLivePosition || !!localBet;

    // Predicted outcome
    let predictedOutcome = 0;
    let betAmountValue = 0n;

    if (hasLivePosition) {
      predictedOutcome = sharesA > 0n ? 1 : 2;
      betAmountValue = sharesA > 0n ? sharesA : sharesB;
    } else if (localBet) {
      predictedOutcome = Number(localBet.outcome);
      betAmountValue = ethers.parseEther(localBet.amount);
    }

    const isClaimed = claimedBets.includes(fixture.id);

    // Determine status dynamically
    const status = getMatchStatus(fixture, resolved, oracleFinalOutcome);

    // Dynamic Score Mapping based on resolution outcome
    let scoreA = fixture.scoreA;
    let scoreB = fixture.scoreB;
    const finalWinner = resolved ? winningOutcome : (oracleFinalOutcome || fixture.oracleFinalOutcome || 0);
    if ((scoreA === 0 && scoreB === 0) || (finalWinner > 0 && fixture.status !== "ENDED")) {
      if (finalWinner === 1) {
        scoreA = 2;
        scoreB = 0;
      } else if (finalWinner === 2) {
        scoreA = 0;
        scoreB = 2;
      } else if (finalWinner === 3) {
        scoreA = 1;
        scoreB = 1;
      }
    }

    return {
      ...fixture,
      hasPosition,
      sharesA,
      sharesB,
      resolved,
      winningOutcome,
      oracleFinalOutcome,
      totalCollateral,
      oddsA,
      oddsB,
      status,
      scoreA,
      scoreB,
      predictedOutcome,
      betAmountValue,
      isClaimed
    };
  });

  const selectedPos = userPositions.find(p => p.id === selectedFixture.id) || selectedFixture;

  // Handle claiming rewards for a specific fixture
  const handleClaim = async (fixtureId) => {
    if (chainId !== 16602) {
      try {
        await switchChainAsync({ chainId: 16602 });
      } catch (err) {
        return alert("Please switch network to 0G Testnet first.");
      }
    }

    setClaimingMatchId(fixtureId);
    try {
      const marketBytesId = ethers.id(fixtureId);
      await claimRewards({
        address: MARKET_ADDRESS,
        abi: MARKET_ABI,
        functionName: 'claimRewards',
        args: [marketBytesId],
        chainId: 16602
      });
      alert("Claim transaction submitted successfully!");

      const claimedKey = `zerocup_claimed_${address}`;
      const claimedList = JSON.parse(localStorage.getItem(claimedKey) || '[]');
      if (!claimedList.includes(fixtureId)) {
        claimedList.push(fixtureId);
        localStorage.setItem(claimedKey, JSON.stringify(claimedList));
        setClaimedBets(claimedList);
      }
    } catch (e) {
      console.error(e);
      alert(`Claim failed: ${e.message}`);
    } finally {
      setClaimingMatchId(null);
    }
  };
  // Simulated live TEE logs feeder
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedPos.status === "LIVE") {
        const rand = Math.random();
        let newLog = {};

        if (rand < 0.3) {
          newLog = {
            time: new Date().toTimeString().slice(0, 8),
            type: "0G DA",
            msg: `Inbound telemetry: Ball coordinate shift. Passing heat map update.`
          };
        } else if (rand < 0.6) {
          const calculatedOddsA = (0.78 + Math.random() * 0.04).toFixed(4);
          const calculatedOddsB = (1 - parseFloat(calculatedOddsA)).toFixed(4);
          newLog = {
            time: new Date().toTimeString().slice(0, 8),
            type: "TEE",
            msg: `ML Inference run. Re-evaluated odds: Team A (${(calculatedOddsA * 100).toFixed(2)}%) | Team B (${(calculatedOddsB * 100).toFixed(2)}%)`
          };
        } else {
          newLog = {
            time: new Date().toTimeString().slice(0, 8),
            type: "0G L1",
            msg: `Submit dynamic odds update to ZeroCupAIOracle. Sig: 0x${Math.floor(Math.random()*1e15).toString(16)}...`
          };
        }

        setLogs(prev => [...prev.slice(-8), newLog]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [selectedPos]);

  // Execute Bet Flow: 1. Approve 0G Token, 2. Buy shares
  const handlePlaceBet = async () => {
    if (!isConnected) return alert("Please connect wallet first!");

    // Validate bet size (minimum 0.1 $0G, maximum 1000 $0G)
    const amountVal = parseFloat(betAmount);
    if (isNaN(amountVal) || amountVal < 0.1 || amountVal > 1000) {
      return alert("Bet size must be between 0.1 $0G and 1000 $0G!");
    }

    // Enforce switching to 0G Testnet (Chain ID: 16602) if not already connected
    if (chainId !== 16602) {
      try {
        console.log("Switching network to 0G Testnet...");
        await switchChainAsync({ chainId: 16602 });
      } catch (err) {
        console.error("Chain switch failed:", err);
        return alert("Please switch your wallet network to 0G Testnet (Chain ID 16602) to proceed!");
      }
    }

    const parsedAmount = ethers.parseEther(betAmount);
    
    try {
      console.log("Approving tokens...");
      await approveToken({
        address: BETTING_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [MARKET_ADDRESS, parsedAmount],
        chainId: 16602
      });

      console.log("Broadcasting buy shares transaction...");
      const marketBytesId = ethers.id(selectedFixture.id);
      await buyShares({
        address: MARKET_ADDRESS,
        abi: MARKET_ABI,
        functionName: 'buyShares',
        args: [marketBytesId, betOutcome, parsedAmount],
        chainId: 16602
      });

      // Save bet details in localStorage for UI state backup tracking
      const betsKey = `zerocup_bets_${address}`;
      const savedBets = JSON.parse(localStorage.getItem(betsKey) || '[]');
      const newBetEntry = {
        fixtureId: selectedFixture.id,
        outcome: betOutcome,
        amount: betAmount,
        timestamp: Date.now()
      };
      if (!savedBets.some(b => b.fixtureId === newBetEntry.fixtureId && b.outcome === newBetEntry.outcome)) {
        savedBets.push(newBetEntry);
        localStorage.setItem(betsKey, JSON.stringify(savedBets));
        setLocalBets(savedBets);
      }
    } catch (e) {
      console.error(e);
      alert(`Transaction failed: ${e.message}`);
    }
  };

  const openPositions = userPositions.filter(p => {
    if (!p.hasPosition) return false;
    if (p.status !== "ENDED") return true;
    const finalWinner = p.resolved ? p.winningOutcome : p.oracleFinalOutcome;
    const isWinner = finalWinner === p.predictedOutcome;
    if (isWinner && !p.isClaimed) return true;
    return false;
  });

  const historyPositions = userPositions.filter(p => {
    if (!p.hasPosition) return false;
    if (p.status !== "ENDED") return false;
    const finalWinner = p.resolved ? p.winningOutcome : p.oracleFinalOutcome;
    const isWinner = finalWinner === p.predictedOutcome;
    if (!isWinner) return true;
    if (isWinner && p.isClaimed) return true;
    return false;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-purple-600 to-purple-400 rounded-lg neon-glow-purple">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
                ZeroCup Predict
              </span>
              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold text-purple-400 border border-purple-500/30 rounded bg-purple-950/40">
                0G Chain
              </span>
            </div>
          </div>

          {/* Connect Wallet - exactly ONE button on the far right, absolute positioned on desktop */}
          <div className="flex items-center md:absolute md:top-3 md:right-8">
            {isConnected ? (
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full py-1.5 pl-3 pr-4 space-x-3 text-sm">
                <div className="flex flex-col text-right">
                  <span className="text-xs text-slate-400 font-mono">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  <span className="text-xs font-semibold text-purple-400">
                    {balanceData ? `${parseFloat(balanceData.formatted).toFixed(4)} A0GI` : "0.0 A0GI"}
                  </span>
                </div>
                <button 
                  onClick={() => disconnect()}
                  className="p-1 hover:text-red-400 text-slate-400 transition"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowConnectDropdown(!showConnectDropdown)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-medium px-4 py-2 rounded-lg text-sm transition hover:brightness-110 active:scale-95 neon-glow-purple"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </button>
                {showConnectDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {connectors.map((connector) => (
                      <button
                        key={connector.uid}
                        onClick={() => {
                          connect({ connector });
                          setShowConnectDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center space-x-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span>{connector.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width): Matches feed & Logs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Matches List Header */}
          <div id="markets-section" className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center space-x-2 text-white">
              <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
              <span>Today&apos;s World Cup Markets</span>
            </h2>
            <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded">
              June 21, 2026
            </span>
          </div>

          {/* Dynamic Match Feed Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userPositions.map((fixture) => (
              <div 
                key={fixture.id}
                onClick={() => setSelectedFixture(fixture)}
                className={`glass-card p-5 rounded-xl cursor-pointer transition border hover:scale-[1.01] ${
                  selectedFixture.id === fixture.id 
                    ? "border-purple-500 bg-slate-900/80 shadow-md neon-border-purple" 
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Match Status Tag & Group */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      fixture.status === "LIVE" 
                        ? "bg-red-950/40 text-red-400 border border-red-500/20 animate-pulse" 
                        : fixture.status === "HT"
                          ? "bg-yellow-950/40 text-yellow-400 border border-yellow-500/20 animate-pulse"
                          : fixture.status === "ENDED"
                            ? "bg-slate-950/60 text-slate-400 border border-slate-800"
                            : "bg-purple-950/40 text-purple-400 border border-purple-800/20"
                    }`}>
                      {fixture.status === "LIVE" && "LIVE "} 
                      {fixture.status === "HT" && "HT "}
                      {fixture.status === "ENDED" ? "ENDED" : fixture.timeLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                      {fixture.group}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[10px] text-purple-300 font-semibold tracking-wide">0G COMPUTE SETTLED</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-center px-4 mb-4">
                  <div className="flex flex-col items-center w-20">
                    <div className="w-10 h-10 bg-slate-950/50 rounded-full border border-slate-800 flex items-center justify-center overflow-hidden mb-1 text-slate-300">
                      <img 
                        src={`https://flagcdn.com/w40/${FLAG_MAP[fixture.teamA]?.toLowerCase() || "un"}.png`} 
                        alt={fixture.teamA} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-semibold truncate max-w-full text-slate-100">{fixture.teamA}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold font-mono text-white">
                        {fixture.status !== "SCHEDULED" ? fixture.scoreA : "-"}
                      </span>
                      <span className="text-slate-600 text-xs">vs</span>
                      <span className="text-2xl font-bold font-mono text-white">
                        {fixture.status !== "SCHEDULED" ? fixture.scoreB : "-"}
                      </span>
                    </div>
                    {fixture.htScore && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        (HT {fixture.htScore})
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-center w-20">
                    <div className="w-10 h-10 bg-slate-950/50 rounded-full border border-slate-800 flex items-center justify-center overflow-hidden mb-1 text-slate-300">
                      <img 
                        src={`https://flagcdn.com/w40/${FLAG_MAP[fixture.teamB]?.toLowerCase() || "un"}.png`} 
                        alt={fixture.teamB} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-semibold truncate max-w-full text-slate-100">{fixture.teamB}</span>
                  </div>
                </div>

                {/* Probability bar - Sleek Purple/White theme */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{fixture.teamA} ({(fixture.oddsA * 100).toFixed(0)}%)</span>
                    <span>{fixture.teamB} ({(fixture.oddsB * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-950/60 rounded-full h-1.5 overflow-hidden flex border border-slate-800">
                    <div 
                      className="bg-purple-600 h-full transition-all duration-1000" 
                      style={{ width: `${fixture.oddsA * 100}%` }}
                    />
                    <div 
                      className="bg-white h-full transition-all duration-1000" 
                      style={{ width: `${fixture.oddsB * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enclave logs feed panel */}
          <div id="logs-section" className="glass-card rounded-xl border border-slate-800 overflow-hidden">
            <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span className="text-slate-300">TEEML Enclave Verification Stream</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">0G Testnet Node: #evm-16602</span>
            </div>
            <div className="bg-slate-950 p-4 font-mono text-xs space-y-1.5 max-h-48 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="flex space-x-2 text-[11px]">
                  <span className="text-slate-500">[{log.time}]</span>
                  <span className={`font-semibold shrink-0 ${
                    log.type === "TEE" ? "text-purple-400" :
                    log.type === "0G DA" ? "text-slate-400" :
                    "text-white"
                  }`}>
                    [{log.type}]
                  </span>
                  <span className="text-slate-300">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1/3 width): Betting Widgets */}
        <div className="space-y-8">
          
          {/* Betting Card */}
          <div id="trade-section" className="glass-card p-6 rounded-xl border border-slate-800 space-y-5">
            <h3 className="text-base font-semibold flex items-center space-x-2 text-purple-400">
              <Coins className="w-5 h-5" />
              <span>Purchase Outcome Shares</span>
            </h3>

            {/* Target Team Selection - Purple & White Theme */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setBetOutcome(1)}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition ${
                  betOutcome === 1 
                    ? "bg-purple-950/40 text-purple-400 border-purple-500/50 neon-border-purple" 
                    : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {selectedPos.teamA} Wins
              </button>
              <button 
                onClick={() => setBetOutcome(2)}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition ${
                  betOutcome === 2 
                    ? "bg-white/10 text-white border-white/50 neon-border-white" 
                    : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {selectedPos.teamB} Wins
              </button>
            </div>

            {/* Input Amount - $0G Test Token references */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Bet Amount (Collateral: $0G Test Token)</label>
              <div className="relative">
                <input 
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2 pl-3 pr-12 text-sm text-white focus:outline-none focus:border-purple-500 font-semibold"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">$0G</span>
              </div>
              {isConnected && (
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Balance: {tokenBalance ? `${parseFloat(ethers.formatEther(tokenBalance)).toFixed(2)} $0G` : "0.00 $0G"}</span>
                  <span className="cursor-pointer text-purple-400 hover:text-purple-300" onClick={() => setBetAmount(tokenBalance ? ethers.formatEther(tokenBalance) : '0')}>Max</span>
                </div>
              )}
            </div>

            {/* Odds output */}
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-900 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">AI Dynamic Odds:</span>
                <span className="font-semibold text-slate-200">
                  {betOutcome === 1 ? selectedPos.oddsA.toFixed(2) : selectedPos.oddsB.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Shares:</span>
                <span className="font-semibold text-purple-400">
                  {(!isNaN(parseFloat(betAmount)) && parseFloat(betAmount) > 0)
                    ? (parseFloat(betAmount) / (betOutcome === 1 ? selectedPos.oddsA : selectedPos.oddsB)).toFixed(2)
                    : "0.00"} Shares
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={handlePlaceBet}
              disabled={selectedPos.status === "ENDED"}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-purple-400 hover:brightness-110 text-white text-sm font-semibold rounded-lg transition active:scale-95 flex items-center justify-center space-x-2 shadow-md neon-glow-purple disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproveConfirming || isBuyConfirming ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Web3 Tx...</span>
                </>
              ) : (
                <>
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>{selectedPos.status === "ENDED" ? "Market Closed" : "Trade Outcome Tokens"}</span>
                </>
              )}
            </button>

            {/* Faucet Link under the action button */}
            <div className="text-center">
              <a 
                href="https://faucet.0g.ai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center space-x-1 text-[11px] text-slate-400 hover:text-purple-400 underline transition"
              >
                <span>Get test tokens from official 0G Faucet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {isBuySuccess && (
              <div className="flex items-center space-x-2 text-[11px] text-green-400 bg-green-950/30 p-2.5 rounded border border-green-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Trade confirmed! Shares credited.</span>
              </div>
            )}
          </div>

          {/* My Bets Dashboard Card */}
          <div id="dashboard-section" className="glass-card p-6 rounded-xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold flex items-center space-x-2 text-purple-400">
                <Trophy className="w-5 h-5 animate-pulse" />
                <span>My Bets Dashboard</span>
              </h3>
              {isConnected && (
                <button 
                  onClick={() => refetchBets()} 
                  className="text-[10px] text-slate-500 hover:text-purple-400 uppercase tracking-wider transition"
                >
                  Refresh
                </button>
              )}
            </div>

            {!isConnected ? (
              <div className="text-center py-6 text-xs text-slate-500">
                Connect your wallet to view your active positions.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Tabs Selector */}
                <div className="flex border-b border-slate-800">
                  <button
                    onClick={() => setBetsTab('open')}
                    className={`flex-1 pb-2 text-xs font-semibold border-b-2 transition ${
                      betsTab === 'open'
                        ? 'border-purple-500 text-purple-400'
                        : 'border-transparent text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    Open Bets ({openPositions.length})
                  </button>
                  <button
                    onClick={() => setBetsTab('history')}
                    className={`flex-1 pb-2 text-xs font-semibold border-b-2 transition ${
                      betsTab === 'history'
                        ? 'border-white text-white'
                        : 'border-transparent text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    History & Claims ({historyPositions.length})
                  </button>
                </div>

                {/* Open Bets Tab Content */}
                {betsTab === 'open' && (
                  <div className="space-y-3">
                    {openPositions.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-500">
                        No open positions. Purchase outcome shares to start.
                      </div>
                    ) : (
                      openPositions.map((pos) => {
                        const predictedWinner = pos.predictedOutcome === 1 ? pos.teamA : pos.teamB;
                        const sharesCount = pos.betAmountValue;
                        const isEnded = pos.status === 'ENDED';
                        const finalWinner = pos.resolved ? pos.winningOutcome : pos.oracleFinalOutcome;
                        const isWinner = finalWinner === pos.predictedOutcome;

                        return (
                          <div key={pos.id} className="bg-slate-950/60 border border-slate-900 rounded-lg p-3 space-y-2 text-xs">
                            <div className="flex justify-between font-semibold text-slate-200">
                              <span>{pos.teamA} vs {pos.teamB}</span>
                              {isEnded ? (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold text-green-400 border border-green-500/20 bg-green-950/20 rounded animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                                  WON
                                </span>
                              ) : (
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide ${
                                  pos.status === 'LIVE' ? 'bg-red-950/40 text-red-400 border border-red-500/20 animate-pulse' :
                                  pos.status === 'HT' ? 'bg-yellow-950/40 text-yellow-400 border border-yellow-500/20 animate-pulse' :
                                  'bg-purple-950/40 text-purple-400 border border-purple-800/20'
                                }`}>
                                  {pos.status}
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400">Prediction:</span>
                              <span className="text-slate-200 font-medium">{predictedWinner} to Win</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400">Bet Size:</span>
                              <span className="text-purple-400 font-bold">{parseFloat(ethers.formatEther(sharesCount)).toFixed(2)} Shares</span>
                            </div>

                            {/* Claim Reward Button for Ended and Won (but unclaimed) */}
                            {isEnded && isWinner && !pos.isClaimed && (
                              <div className="pt-2 border-t border-slate-900/60 flex items-center justify-between">
                                <span className="text-[10px] text-green-400/80 font-medium">Claimable reward available</span>
                                <button
                                  onClick={() => handleClaim(pos.id)}
                                  disabled={claimingMatchId === pos.id}
                                  className="px-3 py-1 bg-green-500 hover:bg-green-400 text-slate-950 font-bold text-[10px] rounded transition active:scale-95 disabled:opacity-50 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                                >
                                  {claimingMatchId === pos.id ? "Claiming..." : "Claim Winnings"}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* History & Claims Tab Content */}
                {betsTab === 'history' && (
                  <div className="space-y-3">
                    {historyPositions.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-500">
                        No settled positions found.
                      </div>
                    ) : (
                      historyPositions.map((pos) => {
                        const predictedWinner = pos.predictedOutcome === 1 ? pos.teamA : pos.teamB;
                        const sharesCount = pos.betAmountValue;
                        const finalWinner = pos.resolved ? pos.winningOutcome : pos.oracleFinalOutcome;
                        const isWinner = finalWinner === pos.predictedOutcome;

                        return (
                          <div key={pos.id} className="bg-slate-950/60 border border-slate-900 rounded-lg p-3 space-y-2 text-xs">
                            <div className="flex justify-between font-semibold text-slate-200">
                              <span>{pos.teamA} vs {pos.teamB}</span>
                              {isWinner ? (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold text-slate-400 border border-slate-700 bg-slate-800 rounded">
                                  WON (CLAIMED)
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold text-red-400 border border-red-500/20 bg-red-950/20 rounded">
                                  LOST
                                </span>
                              )}
                            </div>
                            
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400">Your Prediction:</span>
                              <span className="text-slate-200 font-medium">
                                {predictedWinner} Wins
                              </span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400">Position Size:</span>
                              <span className="text-slate-300 font-mono">
                                {parseFloat(ethers.formatEther(sharesCount)).toFixed(2)} Shares
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-1">
            <span>Powered by</span>
            <span className="text-purple-400/80 font-semibold font-mono">0G Chain</span>
            <span>&</span>
            <span className="text-white font-semibold font-mono">0G Compute</span>
          </div>
          <span>&copy; 2026 ZeroCup Predict. All rights reserved.</span>
        </div>
      </footer>

      {/* Mobile Touch Viewport Fixed Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 px-4 py-2 flex items-center justify-around pb-safe">
        <button 
          onClick={() => document.getElementById('markets-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center space-y-1 text-slate-400 hover:text-purple-400 active:scale-95 transition"
        >
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-medium">Markets</span>
        </button>

        <button 
          onClick={() => document.getElementById('trade-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center space-y-1 text-slate-400 hover:text-purple-400 active:scale-95 transition"
        >
          <Coins className="w-5 h-5" />
          <span className="text-[10px] font-medium">Trade</span>
        </button>

        <button 
          onClick={() => document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center space-y-1 text-slate-400 hover:text-purple-400 active:scale-95 transition"
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] font-medium">My Bets</span>
        </button>

        <button 
          onClick={() => document.getElementById('logs-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center space-y-1 text-slate-400 hover:text-purple-400 active:scale-95 transition"
        >
          <Cpu className="w-5 h-5" />
          <span className="text-[10px] font-medium">TEEML</span>
        </button>
      </div>
    </div>
  );
}
