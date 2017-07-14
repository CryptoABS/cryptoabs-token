# Test Cases

- [v] `sendTransaction`: send ETH to multisig wallet
- [v] `getOwners`: check owner ship
- owner ship
    - [v] `submitTransaction`, `addOwner`, `confirmTransaction`, `isConfirmed`: submit transaction to add not exists owner should success
    - [v] `submitTransaction`, `removeOwner`, `confirmTransaction`, `isConfirmed`: submit transaction to remove owner already exists should success
    - [v] `submitTransaction`, `replaceOwner`, `confirmTransaction`, `isConfirmed`: submit transaction to replace owner should success
- requirement
    - [ ] `submitTransaction`, `changeRequirement`, `confirmTransaction`, `isConfirmed`: submit transaction to change requirement should success
- revoke confirmation
    - [ ] `submitTransaction`, `revokeConfirmation`: revoke sumbitted transaction should success
- [v] `getConfirmationCount`: check confirmation count
- [v] `getTransactionCount`: check transaction count
- [v] `getConfirmations`: get confirmation information
- [v] `getTransactionIds`: get transaction information by id
