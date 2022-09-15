# Steer Call Encoding

The objective of this test is to fix the CallRelayer, a contract which handles multicalls. Currently it reverts if any one of the calls in the multicall fails. We want it to revert all submitted calls, but not revert the overall transaction, so that we can record on-chain when a multicall fails. Feel free to edit the CallRelayer however you would like to accomplish this, within the spirit of the test.

You will know you've succeeded when both tests pass. Please submit your solution via Email or Discord DM.

Download: ```yarn```

Test: ```yarn test```