// SPDX:License:Identifer:MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";


contract SignatureVerifier {
    using ECDSA for bytes32;

    function getMessageHash(
        address signer,
        uint256 amount,
        uint256 nonce
    ) public pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(signer, amount, nonce)
        );
    }

    function getEthSignedMessageHash(
        bytes32 messageHash
    ) public pure returns (bytes32) {
        return messageHash.toEthSignedMessageHash();
    }

    function recoverSigner(
        bytes32 ethSignedMessageHash,
        bytes calldata signature
    ) public pure returns (address) {
        return ethSignedMessageHash.recover(signature);
    }

    function verify(
        address signer,
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) external pure returns (bool) {
        bytes32 messageHash = getMessageHash(signer, amount, nonce);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        return recoverSigner(ethSignedMessageHash, signature) == signer;
    }
}