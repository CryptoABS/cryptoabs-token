## Contract Design

Reference：https://medium.com/zeppelin-blog/onward-with-ethereum-smart-contract-security-97a827e47702

- Fail as early and loudly as possible: 遇到 error 就直接 throw 不要讓合約繼續運行下去
	- 節省 gas 開銷
	- 減少發生錯誤後下面代碼被執行到的問題
- Favor pull over push payments: 讓使用者自己提款，遠比自動退款好
- Order your function code: conditions, actions, interactions:
	- first, check all the pre-conditions.
	- then, make changes to your contract’s state.
	- finally, interact with other contracts.
- Be aware of platform limits: 注意EVM限制
- Write tests: 對每行code都要測試到
- Fault tolerance and Automatic bug bounties
- Limit the amount of funds deposited
- Write simple and modular code: 簡單易懂，並且模組化
- Event start from Log: 透過Log開頭替每個Event取名
- Don’t write all your code from scratch

#### require vs throw

- `require` for a single check for i.e. a malformed input.
- `throw` when need to do something between the real check and the exception.
