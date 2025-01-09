// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IUomiAgents is IERC721 {
    function exists(uint256 tokenId) external view returns (bool);
}