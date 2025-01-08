// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./IIpfs.sol";
// import IERC721 from openzeppelin
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract IPFSStorage {

    // ============ Storage ============

    address public owner;
    IERC721 public uomiAgents;

    // ============ Constants ============

    /// @dev Address of the IPFSstorage precompile
    IIpfs private constant PRECOMPILE_ADDRESS_IPFS =
        IIpfs(0x0000000000000000000000000000000000000101);

    uint256 private constant pricePerBlock = 10000000000000000; // 0.01 UOMI x block

   
    // ============ Constructor ============

     constructor(
        address _owner,
        IERC721 _uomiAgents
    ) {
        owner = _owner;
        uomiAgents = _uomiAgents;
    }

    // ============ Events ============
    event AgentPinRequested(string cid, uint256 nftId);
    event FilePinRequested(string cid, uint256 durationInBlocks);


     // ============ Functions ============


    /**
     * @notice Pins an agent to IPFS using the provided CID and NFT ID.
     * @dev This function checks if the caller is the owner of the specified NFT.
     * @param _cid The CID (Content Identifier) of the agent to be pinned on IPFS.
     * @param _nftId The ID of the NFT associated with the agent.
     *        - The caller must be the owner of the NFT.
     */
    function pinAgent(string memory _cid, uint256 _nftId) external {
        //check if the caller is the owner of the NFT
        require(
            uomiAgents.ownerOf(_nftId) == msg.sender, "IPFSStorage: caller is not the owner of the NFT"
        );

        PRECOMPILE_ADDRESS_IPFS.pin_agent(bytes(_cid), _nftId);
        emit AgentPinRequested(_cid, _nftId);
    }

    /**
     * @notice Pins a file to IPFS for a specified duration.
     * @dev The function requires a minimum duration of 28800 blocks (24 hours) and a sufficient payment.
     * @param _cid The content identifier (CID) of the file to be pinned.
     * @param _durationInBlocks The duration in blocks for which the file should be pinned.
     *        - The duration must be at least 28800 blocks.
     *        - msg.value should be greater than or equal to _durationInBlocks * pricePerBlock.
     * @notice The function calls a precompiled contract to pin the file on IPFS.
     */
    function pinFile(string memory _cid, uint256 _durationInBlocks) external payable{
        require(
            _durationInBlocks >= 28800, "IPFSStorage: min duration should be >= 28800"
        ); //28800 = 24h

        require( 
            msg.value >= _durationInBlocks * pricePerBlock, "IPFSStorage: not enough payment"
        );

        PRECOMPILE_ADDRESS_IPFS.pin_file(bytes(_cid), _durationInBlocks);
        emit FilePinRequested(_cid, _durationInBlocks);
    }
        
    /**
     * @dev Allows the owner to withdraw the entire balance of the contract.
     * 
     * Requirements:
     * - The caller must be the owner of the contract.
     * 
     * Emits no events.
     */
    function withdraw() external {
        require(
            msg.sender == owner, "IPFSStorage: only owner can withdraw"
        );
        payable(owner).transfer(address(this).balance);
    }

}