pragma solidity ^0.4.11;

// 可參考：https://gist.github.com/pau1m/baa7e8a8dfe1c2852f0c876b61ba6af2
import "./zeppelin/ownership/Ownable.sol";
import "./zeppelin/SafeMath.sol";

contract Payment is Ownable {
	using SafeMath for uint;

	struct Payee {
		bool status;			// 判斷子，true 可以領錢、false 不可以領錢
    uint interest;		// 待領的金額
	}

	uint public payeesIndexSize;
	mapping (address => Payee) public payees; 
	mapping (uint => address) public payeesIndex;

	function Payment() {
		payees[owner].status = true;
		payees[owner].interest = 0;
		payeesIndex[payeesIndexSize];
		payeesIndexSize = 1;
	}

	modifier isPayee() {
    if (payees[msg.sender].status != true) {
    	throw;
    } 
    _;
  }

	function addPayee(address _payee, uint _interest) onlyOwner {
		// check if payee exists
		if (payees[_payee].status != true) {
    	payees[_payee].status = true;
    	payees[_payee].interest = _interest;
	    payeesIndex[payeesIndexSize] = _payee;
	    payeesIndexSize++;
    } else {
    	payees[_payee].interest += _interest;
    } 
	}

	function getPayeeCount() returns (uint result) {
		return payeesIndexSize;
	}

	function disablePayee(address _address) onlyOwner {
		if(_address == owner) {
			throw;
		}
    payees[_address].status = false;
  }

	function enablePayee(address _address) onlyOwner {
    payees[_address].status = true;
  }

  function getInterest(address _address) constant returns (uint result) {
  	return payees[_address].interest;
  }


	function () payable {
		
	}

	function withdrawInterest(uint amount) payable {
    if (payees[msg.sender].status != true || amount > payees[msg.sender].interest) {
    	throw;
    } 
    if (!msg.sender.send(amount * 1 ether)) {
    	throw;
    }
    payees[msg.sender].interest -= amount;
  }

  function payeeStatus() constant returns (bool result) {
  	return payees[msg.sender].status;
  }
}