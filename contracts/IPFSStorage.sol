// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./IIpfs.sol";
// import IERC721 from openzeppelin
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract IPFSStorage {

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

     // ============ Functions ============


    function pinAgent(bytes memory _cid, uint256 _nftId) external {
        //check if the caller is the owner of the NFT
        require(
            uomiAgents.ownerOf(_nftId) == msg.sender, "IPFSStorage: caller is not the owner of the NFT"
        );
        PRECOMPILE_ADDRESS_IPFS.pin_agent(_cid, _nftId);
    }

    function pinFile(bytes memory _cid, uint256 _durationInBlocks) external payable{
        require(
            _durationInBlocks >= 28800, "IPFSStorage: min duration should be >= 28800"
        ); //28800 = 24h

        require( 
            msg.value >= _durationInBlocks * pricePerBlock, "IPFSStorage: not enough payment"
        );

        PRECOMPILE_ADDRESS_IPFS.pin_file(_cid, _durationInBlocks);
    }
        

    function withdraw() external {
        require(
            msg.sender == owner, "IPFSStorage: only owner can withdraw"
        );
        payable(owner).transfer(address(this).balance);
    }

}