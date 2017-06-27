pragma solidity ^0.4.11;

// 可參考：https://gist.github.com/pau1m/baa7e8a8dfe1c2852f0c876b61ba6af2
import "../Ownable.sol";
import "../SafeMath.sol";

contract PushPayment is Ownable {
  using SafeMath for uint;

  struct Payee {
    bool status;        // 判斷子，true 可以領錢、false 不可以領錢
    uint interest;      // 待領的金額
  }

  uint payeesIndexSize;
  uint nextPayeeIndex;
  uint totalSupply;
  uint totalInterest;
  mapping (address => Payee) payees; 
  mapping (uint => address) payeesIndex;

  function PushPayment() {
    payees[owner].status = true;
    payees[owner].interest = 0;
    payeesIndex[payeesIndexSize];
    payeesIndexSize = 1;
    totalSupply = 1000;
    totalInterest = 13;
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

  function pushInterest() onlyOwner payable {
    // 派發
    // while loop run all the payees

    uint i = nextPayeeIndex;
    while (i < payeesIndexSize && msg.gas > 2000000) {
      address _addr = payeesIndex[i];
      if (payees[_addr].status == true) {
        if (_addr.send(payees[_addr].interest)) {
          payees[_addr].interest = 0;
        }
      }
      i++;
    }
    nextPayeeIndex = i;
  }

  function payeeStatus() constant returns (bool result) {
    return payees[msg.sender].status;
  }
}