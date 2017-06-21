pragma solidity ^0.4.11;

import "./zeppelin/token/ERC20.sol";
import "./zeppelin/token/BasicToken.sol";
import "./zeppelin/ownership/Ownable.sol";

// owner 從外部送 eth 進來的功能
// owner 從外部分派token的功能，for BitCoin or USDT investors
// owner 從 contract 取出 eth 的功能
// 要加上可以設定發售結束的判斷，不允許再送錢進來
// 加上發售 token 的上限
// iterable mapping: https://ethereum.stackexchange.com/questions/2943/how-to-create-an-iterable-key-value-structure-in-solidity
// createToken 會超過 gas limit, 解法參考: https://ethereum.stackexchange.com/questions/7054/default-value-for-gas-in-sendtransaction

/**
 * @title Bonds ERC20 token
 *
 * @dev Implemantation of the bonds token.
 * @dev https://github.com/ethereum/EIPs/issues/20
 */
contract Bonds is BasicToken, ERC20, Ownable {
	event Interest(address indexed owner, uint value, uint total);
	event Deposite(address indexed owner, uint value);
	event Withdraw(address indexed owner, uint value);
	
	mapping (address => mapping (address => uint)) allowed;
	mapping (address => uint) interests;
	address[] participants;

	string public name = "Bonds";
  string public symbol = "BONDS";
  uint public decimals = 18;
  uint public constant MAXIMUM_TOKEN_SUPPLY = 1000;
  // 1 ether = 100 example tokens
  uint public constant PRICE = 100;

  /**
   * @dev Contructor that gives msg.sender all of existing tokens. 
   */
  function Bonds() {
    // totalSupply = INITIAL_SUPPLY;
    // balances[msg.sender] = INITIAL_SUPPLY;
  }

  /**
  * @dev transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint _value) onlyPayloadSize(2 * 32) {
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
   	// 判斷是否存在？
   	participants.push(_to);
    
    Transfer(msg.sender, _to, _value);
  }

	/**
   * @dev Transfer tokens from one address to another
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint the amout of tokens to be transfered
   */
  function transferFrom(address _from, address _to, uint _value) onlyPayloadSize(3 * 32) {
    var _allowance = allowed[_from][msg.sender];

    // Check is not needed because sub(_allowance, _value) will already throw if this condition is not met
    // if (_value > _allowance) throw;

    balances[_to] = balances[_to].add(_value);
    balances[_from] = balances[_from].sub(_value);
    allowed[_from][msg.sender] = _allowance.sub(_value);
    // 判斷是否存在？
    participants.push(_to);
    
    Transfer(_from, _to, _value);
  }

  /**
   * @dev Approve the passed address to spend the specified amount of tokens on beahlf of msg.sender.
   * @param _spender The address which will spend the funds.
   * @param _value The amount of tokens to be spent.
   */
  function approve(address _spender, uint _value) {
  	// 這邊需要透過時間的控制才可以允許提款
  	// if (current_time < bonds_start + '12 mins') throw;


    // To change the approve amount you first have to reduce the addresses`
    //  allowance to zero by calling `approve(_spender, 0)` if it is not
    //  already 0 to mitigate the race condition described here:
    //  https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    if ((_value != 0) && (allowed[msg.sender][_spender] != 0)) throw;

    
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
  }

  /**
   * @dev Function to check the amount of tokens than an owner allowed to a spender.
   * @param _owner address The address which owns the funds.
   * @param _spender address The address which will spend the funds.
   * @return A uint specifing the amount of tokens still avaible for the spender.
   */
  function allowance(address _owner, address _spender) constant returns (uint remaining) {
    return allowed[_owner][_spender];
  }

	/**
   * @dev Gets the interest of the specified address.
   * @param _owner The address to query the interest of. 
   * @return An uint representing the amount owned by the passed address.
   */
  function interestOf(address _owner) constant returns (uint interest) {
  	return interests[_owner];
  }

  /**
   * @dev put interest to each token owner
   * @param _owner The address who own token
   * @param _value The value
   */
  function transferInterest(address _owner, uint _value) onlyOwner {
  	interests[_owner] = interests[_owner].add(_value);
  	Interest(_owner, _value, interests[_owner]);
  }

  function withdraw() payable onlyOwner {
  	if (!owner.send(this.balance)) {
  		throw;
  	}
  	Withdraw(msg.sender, this.balance);
  }

  function deposite() payable onlyOwner {
  	Deposite(msg.sender, msg.value);
  }

  function () payable {
    createTokens(msg.sender);
  }

  function createTokens(address recipient) payable {
    if (msg.value == 0) {
      throw;
    }

    // 最低投注額要大於 1 ether
    uint amount = msg.value / 1 ether;
    if (amount < 1) {
    	throw;
    }
    uint tokens = amount.mul(getTokenPrice());
    if (totalSupply.add(tokens) > getMaximumTokenSupply()) {
    	throw;
    }

    totalSupply = totalSupply.add(tokens);

    balances[recipient] = balances[recipient].add(tokens);
    // 判斷是否存在？
   	participants.push(recipient);
    

    if (!owner.send(msg.value)) {
      throw;
    }
  }

  /**
   * @return The price per unit of token. 
   */
  function getTokenPrice() constant returns (uint result) {
    return PRICE;
  }

  /**
   * @return The maximum token supply on this contract. 
   */
  function getMaximumTokenSupply() constant returns (uint result) {
  	return MAXIMUM_TOKEN_SUPPLY;
  }

  function getParticipantCount() returns (uint result) {
  	return participants.length;
  }

}