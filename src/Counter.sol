// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract Counter {
    uint256 private counter;

    constructor(uint256 _counter) {
        counter = _counter;
    }

    function incrementCounter() public {
        counter += 1;
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }
}
