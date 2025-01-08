// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
/**
 * @title UOMI-ENGINE interface.
 */
/// Interface to the precompiled contract
/// Predeployed at the address 0x0000000000000000000000000000000000000101
/// For better understanding check the source code:
/// code: pallets/uomi-engine/src/lib.rs
interface IIpfs {
     /**
     * @notice Pin an agent cid with the specified nftId.
     * @param _cid The content identifier to be pinned.
     * @param _nftId The NFT identifier to be pinned.
     */
    function pin_agent(bytes memory _cid , uint256 _nftId) external;
    /**
     * @notice Pins a file for a specified duration.
     * @param _cid The content identifier to be pinned.
     * @param _durationInBlocks The duration for which the file should be pinned.
     */
    function pin_file(bytes memory _cid, uint256 _durationInBlocks) external;
}
