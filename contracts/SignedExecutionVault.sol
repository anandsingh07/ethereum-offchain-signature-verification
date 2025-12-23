// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SignedExecutionVault {
    using ECDSA for bytes32;

    mapping(address => uint256) public nonces;

    event Executed(
        address indexed signer,
        address indexed executor,
        uint256 indexed nonce,
        bytes32 actionHash,
        uint256 timestamp
    );

    function execute(
        address signer,
        bytes calldata actionData,
        uint256 nonce,
        bytes calldata signature
    ) external {
        require(nonce == nonces[signer], "INVALID_NONCE");

        bytes32 actionHash = keccak256(
            abi.encodePacked(
                address(this),
                block.chainid,
                signer,
                actionData,
                nonce
            )
        );

        address recovered = actionHash
            .toEthSignedMessageHash()
            .recover(signature);

        require(recovered == signer, "INVALID_SIGNATURE");

        nonces[signer]++;

        emit Executed(
            signer,
            msg.sender,
            nonce,
            actionHash,
            block.timestamp
        );
    }
}
