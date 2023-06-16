// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract Counter {
  uint256 private counter;

  function increamentCounter() public {
    counter += 1;
  }

  function getCounter() public view returns (uint256) {
    return counter;
  }
}
