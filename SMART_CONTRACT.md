## Contract Design

Reference：https://medium.com/zeppelin-blog/onward-with-ethereum-smart-contract-security-97a827e47702

- Fail as early and loudly as possible: When error occur then throw, don't let contract execute the code below
	- reduce gas
	- reduce code execute when error occur
- Favor pull over push payments
- Order your function code: conditions, actions, interactions:
	- first, check all the pre-conditions.
	- then, make changes to your contract’s state.
	- finally, interact with other contracts.
- Be aware of platform limits: Be ware on EVM limitation.
- Write tests: Test on every single line.
- Fault tolerance and Automatic bug bounties
- Limit the amount of funds deposited
- Write simple and modular code
- Event start from Log
- Don’t write all your code from scratch

#### require vs throw

- `require` for a single check for i.e. a malformed input.
- `throw` when need to do something between the real check and the exception.
