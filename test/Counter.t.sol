// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "../lib/forge-std/src/Test.sol";
import {Counter} from "../src/Counter.sol";
import {DeployCounter} from "../script/DeployCounter.s.sol";

contract CounterTest is Test {
    Counter public counter;

    function setUp() public {
        DeployCounter deployer = new DeployCounter();
        counter = deployer.run();
    }

    function testIncrement() public {
        counter.incrementCounter();
        assertEq(counter.getCounter(), 1);
    }

    function testInitializer() public {
        counter.getCounter();
        assertEq(counter.getCounter(), 0);
    }
}
