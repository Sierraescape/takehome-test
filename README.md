# Steer Call Encoding

The objective of this test is to fix a contract which handles multicalls. Currently it reverts if any one of the calls in the multicall fails; we want it to revert all calls, but not revert the overall transaction. Feel free to edit the CallRelayer however you would like, within the spirit of the test.

Download: ```yarn```

Test: ```yarn test```