# IPFS Storage Smart Contract

This smart contract provides functionality for pinning IPFS content through a precompile interface on the UOMI network. It allows both agent-based pinning and duration-based file pinning with payment functionality.

## Features

- Pin agent-specific content with NFT ID association
- Pin files with customizable duration (minimum 24 hours)
- Pay-per-block pricing model for file pinning
- Secure withdrawal mechanism for contract owner

## Prerequisites

- Node.js (14.x or later)
- Hardhat
- An Ethereum wallet with UOMI tokens for testing

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your configuration:
```
PRIVATE_KEY=your_private_key
UOMI_RPC_URL=your_uomi_network_rpc_url
```

## Contract Details

### Constants

- `PRECOMPILE_ADDRESS_IPFS`: The address of the IPFS precompile contract (0x0000000000000000000000000000000000000101)
- `pricePerBlock`: 0.01 UOMI per block (10000000000000000 wei)

### Functions

#### `constructor(address _owner)`
- Initializes the contract with the specified owner address
- Parameters:
  - `_owner`: Address that will be able to withdraw funds from the contract

#### `pinAgent(bytes memory _cid, uint256 _nftId)`
- Pins content associated with an agent's NFT
- Parameters:
  - `_cid`: IPFS CID in bytes format
  - `_nftId`: Associated NFT ID

#### `pinFile(bytes memory _cid, uint256 _durationInBlocks)`
- Pins a file for a specified duration
- Requires payment based on duration
- Parameters:
  - `_cid`: IPFS CID in bytes format
  - `_durationInBlocks`: How long to pin the file (minimum 28800 blocks ≈ 24 hours)
- Requirements:
  - Duration must be >= 28800 blocks
  - Payment must be >= (durationInBlocks * pricePerBlock)

#### `withdraw()`
- Allows the owner to withdraw accumulated funds
- Can only be called by the contract owner

## Usage

### Deployment

1. Configure your network in `hardhat.config.js`:
```javascript
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    uomi: {
      url: process.env.UOMI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

2. Deploy the contract:
```bash
npx hardhat run scripts/deploy.js --network uomi
```

### Interacting with the Contract

Example script for pinning a file:
```javascript
const { ethers } = require("hardhat");

async function main() {
  const contract = await ethers.getContractAt("IPFSStorage", "YOUR_CONTRACT_ADDRESS");
  
  // Example: Pin a file for 24 hours (28800 blocks)
  const cid = ethers.utils.toUtf8Bytes("QmYourIPFSHash");
  const duration = 28800;
  const price = ethers.utils.parseEther("0.01").mul(duration);
  
  await contract.pinFile(cid, duration, { value: price });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

## Testing

Run the test suite:
```bash
npx hardhat test
```

## Security Considerations

- The contract handles user funds, so thorough testing is essential
- Only the owner can withdraw funds
- Minimum duration prevents spam transactions
- Payment validation ensures proper compensation for pinning services

## License

UNLICENSED

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request