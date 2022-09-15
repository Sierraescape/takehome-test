// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// The purpose of this contract is essentially to run multicalls. If any given user-provided low-level call fails, all low-level calls should fail,
// but the transaction itself should not fail.
contract CallRelayer   {
    // Represents the number of multicalls sent by a given user which have failed. This utility wouldn't be necessary in real life of course, but here we're assuming 
    // that it's vital to store the # of calls failed on-chain.
    mapping(address => uint256) public numCallsFailed;  

    // Objective is to edit this contract (starting with this function) so that if one call fails, they all revert, without reverting the overall transaction.
    // Currently all calls revert if one reverts, but numCallsFailed is not incremented. Objective is to retain the former behavior while correcting the latter.
    function multicall(address[] calldata targetAddresses, bytes[] calldata calls) external {
        for (uint i = 0; i < calls.length; i++) {
            (bool success, ) = targetAddresses[i].call(calls[i]);
            require(success, "Call failed");
        }
    }
}