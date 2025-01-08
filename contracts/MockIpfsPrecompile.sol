// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract MockIpfs {
    function pin_agent(bytes memory _cid, uint256 _nftId) external {}
    function pin_file(bytes memory _cid, uint256 _durationInBlocks) external {}
}