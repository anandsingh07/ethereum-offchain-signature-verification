// SPDX-License-Identifier :MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SignedExecutionVault {
    using ECDSA for bytes32 ;

    mapping(address => uint256)public nonces ;
    
    event Executed(
        address indexed signer ,
        address indexed executer ,
        uint256 indexed nonce ,
        bytes32 actionHash ,
        uint256 timestamp

    );

    function execute() external {};
}