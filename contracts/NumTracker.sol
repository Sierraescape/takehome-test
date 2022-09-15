// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract NumTracker   {
    uint256 public num;
    uint256 public timesNumHasBeenUpdated;

    function setNum(uint256 _num) external   {
        num = _num;
        timesNumHasBeenUpdated++;
    }
}