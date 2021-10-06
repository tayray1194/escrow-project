

// contract address
const ESCROW_ADDRESS = "0x89AEDeb8f8921C9985f8A2dd1578347Eb04D760D";


// LOGIC to connect metamask
if (typeof window.ethereum !== 'undefined') {
  console.log('MetaMask is installed!');
} else {
  console.log('Install MetaMask')
  document.querySelector('#ethereum-button')
  .innerHTML = "a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn' target='_blank'>Install MetaMask</a>";
  document.querySelector('.intro').style.display = 'none';
}


const ethEnabled = async () => {
  if (window.ethereum) {
    await window.ethereum.send('eth_requestAccounts');
    window.web3 = new Web3(window.ethereum);
    console.log('web3.js initialized');
    return true;
  }
  console.log('web3.js NOT initialized');
  return false;
}

//======================================================================================================================
//
// TODO - create handles for HTML elements
//
//======================================================================================================================
// form fields
const limitOrderAddressInput = document.querySelector('#Limit-Order-Address');
const inputTokenAddressInput = document.querySelector('#Input-Token-Address');
const outputTokenAddressInput = document.querySelector('#Output-Token-Address');
const inputTokenAmountInput = document.querySelector('#Input-Token-Amount');
const outputTokenAmountInput = document.querySelector('#Output-Token-Amount');
const recipientInput = document.querySelector('#Recipient');
const deadlineInput = document.querySelector('#Deadline');
const swapTypeInput = document.querySelector('#Swap-Type');
const orderNumberRemoveOrderInput = document.querySelector('#Order-Number');
const orderNumberViewOrderInput = document.querySelector('#Order-Number-2');
const inputTokenAddressLabel = document.querySelector('#Input-Token-Address-2');
const outputTokenAddressLabel = document.querySelector('#Output-Token-Address-2');
const inputTokenAmountLabel = document.querySelector('#Input-Token-Amount-2');
const outputTokenAmountLabel = document.querySelector('#Output-Token-Amount-2');
const recipientLabel = document.querySelector('#Recipient-2');
const deadlineLabel = document.querySelector('#Deadline-2');
const swapTypeLabel = document.querySelector('#Swap-Type-2');
const stakingContractAddressInput = document.querySelector('#Staking-Contract-Address');
const depositAmountInput = document.querySelector('#Amount');
const withdrawAmountInput = document.querySelector('#Amount-3');
const approvedTokenAddressInput = document.querySelector('#Approved-Token-Address');
const spenderAddressInput = document.querySelector('#Spender-Address');
const approvedTokenAmountInput = document.querySelector('#Amount-2');
const tokenAddressInput = document.querySelector('#Token-Address');
const tokenBalanceLabel = document.querySelector('#Token-Balance');
const ETHBalanceLabel = document.querySelector('#ETH-Balance');
const jobCountLabel = document.querySelector('#Job-Count');
const feeAmountLabel = document.querySelector('#Fee-Amount');
const BNBAmountInput = document.querySelector('#BNB-Amount');
const gasFeeAmountLabel = document.querySelector('#Gas-Fee-Amount');
const userAddressForUserBalanceInput = document.querySelector('#User-Address');
const userBalanceLabel = document.querySelector('#User-Balance');
const userAddressForCheckForUpdateInput = document.querySelector('#User-Address-2');
const orderNumberCheckForUpdateInput = document.querySelector('#Order-Number-3');
const updateLabel = document.querySelector('#Update');




// buttons
const createOrderButton = document.querySelector('#Create-Order-Button');
const removeOrderButton = document.querySelector('#Remove-Order-Button');
const viewOrderButton = document.querySelector('#View-Order-Button');
const depositButton = document.querySelector('#Deposit-Button');
const withdrawButton = document.querySelector('#Withdraw-Button');
const approveButton = document.querySelector('#Approve-Button');
const getTokenBalanceButton = document.querySelector('#Get-Token-Balance-Button');
const getETHBalanceButton = document.querySelector('#Get-ETH-Balance-Button');
const getJobCountButton = document.querySelector('#Get-Job-Count-Button');
const getFeeAmountButton = document.querySelector('#Get-Fee-Amount-Button');
const getGasFeeAmountButton = document.querySelector('#Get-Gas-Fee-Amount-Button');
const getUserBalanceButton = document.querySelector('#Get-User-Balance-Button');
const checkForUpdateButton = document.querySelector('#Check-For-Update-Button');
const liquidateOrderButton = document.querySelector('#Liquidate-Order-Button');






//======================================================================================================================
//
// TODO - create a button on the site that says "Connect to Metamask" and has id = 'ethereum-button'
//
//======================================================================================================================
const ethereumButton = document.querySelector('#ethereum-button');


ethereumButton.addEventListener('click', () => {
    // Will start the MetaMask extension
    getAccounts();
});

async function getAccounts() {

    // fetch contract ABI's
    const _erc20ABI = await fetch("./js/abis/IERC20.json")
        .then(response => {
            console.log('Loaded erc20ABI');
            return response.json();
        })
        .catch(function (err) {
            console.log(err);
        });
    const erc20ABI = _erc20ABI["abi"];


    const _wethABI = await fetch("./js/abis/weth.json")
        .then(response => {
            console.log('Loaded wethABI');
            return response.json();
        })
        .catch(function (err) {
            console.log(err);
        });
    const wethABI = _wethABI["abi"];


    const _limitOrderABI = await fetch("./js/abis/limitOrder3.json")
        .then(response => {
            console.log('Loaded limitOrderABI');
            return response.json();
        })
        .catch(function (err) {
            console.log(err);
        });
    const limitOrderABI = _limitOrderABI["abi"];

    const _stakingABI = await fetch("./js/abis/staking.json")
        .then(response => {
            console.log('Loaded stakingABI');
            return response.json();
        })
        .catch(function (err) {
            console.log(err);
        });
    const stakingABI = _stakingABI["abi"];

    //======================================================================================================================
    //
    // TODO - register event listeners for buttons inside of getAccounts function
    //
    //======================================================================================================================

    createOrderButton.addEventListener('click',  () => {

        const _limitOrderAddress = web3.utils.toChecksumAddress(limitOrderAddressInput.value);
        const _tokenIn = web3.utils.toChecksumAddress(inputTokenAddressInput.value);
        const _tokenOut = web3.utils.toChecksumAddress(outputTokenAddressInput.value);
        const _tokenInAmount = web3.utils.toWei(web3.utils.fromWei(inputTokenAmountInput.value, 'ether'), 'ether');
        const _tokenOutAmount = web3.utils.toWei(web3.utils.fromWei(outputTokenAmountInput.value, 'ether'), 'ether');
        const _recipient = web3.utils.toChecksumAddress(recipientInput.value);
        const _deadline = deadlineInput.value;
        const _swapType = swapTypeInput.value;
        const limitOrderContract = new web3.eth.Contract(limitOrderABI, _limitOrderAddress);

        let tx_builder = limitOrderContract.methods.createOrder(
            _tokenIn,
            _tokenOut,
            _tokenInAmount,
            _tokenOutAmount,
            _recipient,
            _deadline,
            _swapType);
        let encoded_tx = tx_builder.encodeABI();
        if (_swapType < 12) {
            let transactionObject = {
                data: encoded_tx,
                from: account,
                to: _limitOrderAddress,
                value: _tokenInAmount
            };

            console.log('Sending createOrder transaction...');
            web3.eth.sendTransaction(transactionObject)
                .then(function(receipt){
                    console.log('createOrder transaction receipt received!');
                    console.log(receipt);
                });
        }

        else {
            let transactionObject = {
                data: encoded_tx,
                from: account,
                to: _limitOrderAddress,
            };

            console.log('Sending createOrder transaction...');
            web3.eth.sendTransaction(transactionObject)
                .then(function(receipt){
                    console.log('createOrder transaction receipt received!');
                    console.log(receipt);
                });
        }


    });

    removeOrderButton.addEventListener('click',  () => {

        const _limitOrderAddress = web3.utils.toChecksumAddress(limitOrderAddressInput.value);
        const _orderNumber = orderNumberRemoveOrderInput.value;
        const limitOrderContract = new web3.eth.Contract(limitOrderABI, _limitOrderAddress);

        let tx_builder = limitOrderContract.methods.removeOrder(_orderNumber);
        let encoded_tx = tx_builder.encodeABI();
        let transactionObject = {
            data: encoded_tx,
            from: account,
            to: _limitOrderAddress
        };

        console.log('Sending removeOrder transaction...');
        web3.eth.sendTransaction(transactionObject)
            .then(function(receipt){
                console.log('removeOrder transaction receipt received!');
                console.log(receipt);
            });
    });

    viewOrderButton.addEventListener('click',  async () => {

        const _orderNumber = orderNumberViewOrderInput.value;
        console.log(_orderNumber);
        console.log(account);
        const _limitOrderAddress = web3.utils.toChecksumAddress(limitOrderAddressInput.value);
        const limitOrderContract = new web3.eth.Contract(limitOrderABI, _limitOrderAddress);
        const viewOrder = await limitOrderContract.methods.viewOrder(_orderNumber).call({from: account});

        inputTokenAddressLabel.innerHTML = 'Input Token Address: ' + viewOrder[0];
        outputTokenAddressLabel.innerHTML = 'Output Token Address: ' + viewOrder[1];
        inputTokenAmountLabel.innerHTML = 'Input Token Amount: ' + viewOrder[2];
        outputTokenAmountLabel.innerHTML = 'Output Token Amount: ' + viewOrder[3];
        recipientLabel.innerHTML = 'Recipient: ' + viewOrder[4];
        deadlineLabel.innerHTML = 'Deadline: ' + viewOrder[5];
        swapTypeLabel.innerHTML = 'Swap Type: ' + viewOrder[6];

    });

    depositButton.addEventListener('click', () => {

        const _stakingAddress = web3.utils.toChecksumAddress(stakingContractAddressInput.value);
        const _amountIn = web3.utils.toWei(web3.utils.fromWei(depositAmountInput.value, 'ether'), 'ether');
        const stakingContract = new web3.eth.Contract(stakingABI, _stakingAddress);

        let tx_builder = stakingContract.methods.deposit(_amountIn);
        let encoded_tx = tx_builder.encodeABI();
        let transactionObject = {
            data: encoded_tx,
            from: account,
            to: _stakingAddress
        };

        console.log('Sending deposit transaction...');
        web3.eth.sendTransaction(transactionObject)
            .then(function(receipt){
                console.log('Deposit transaction receipt received!');
                console.log(receipt);
            });
    });

    withdrawButton.addEventListener('click',  () => {

        const _stakingAddress = web3.utils.toChecksumAddress(stakingContractAddressInput.value);
        const _amountOut = web3.utils.toWei(web3.utils.fromWei(withdrawAmountInput.value, 'ether'), 'ether');
        const stakingContract = new web3.eth.Contract(stakingABI, _stakingAddress);

        let tx_builder = stakingContract.methods.withdraw(_amountOut);
        let encoded_tx = tx_builder.encodeABI();
        let transactionObject = {
            data: encoded_tx,
            from: account,
            to: _stakingAddress
        };

        console.log('Sending withdraw transaction...');
        web3.eth.sendTransaction(transactionObject)
            .then(function(receipt){
                console.log('Withdraw transaction receipt received!');
                console.log(receipt);
            });
    });

    approveButton.addEventListener('click', () => {

        console.log('Approve button clicked');
        const _tokenIn = web3.utils.toChecksumAddress(approvedTokenAddressInput.value);
        const _amountIn = web3.utils.toWei(web3.utils.fromWei(approvedTokenAmountInput.value, 'ether'), 'ether');
        const tokenContract = new web3.eth.Contract(erc20ABI, _tokenIn);
        const spenderAddress = web3.utils.toChecksumAddress(spenderAddressInput.value);

        let tx_builder = tokenContract.methods.approve(spenderAddress, _amountIn);
        let encoded_tx = tx_builder.encodeABI();
        let transactionObject = {
            data: encoded_tx,
            from: account,
            to: _tokenIn
        };

        console.log('Sending approval transaction...');
        web3.eth.sendTransaction(transactionObject)
            .then(function(receipt){
                console.log('Approval transaction receipt received!');
                console.log(receipt);
        });


    });

    getTokenBalanceButton.addEventListener('click', async () => {

        const _tokenIn = web3.utils.toChecksumAddress(tokenAddressInput.value);
        const tokenContract = new web3.eth.Contract(erc20ABI, _tokenIn);
        const tokenBalance = await tokenContract.methods.balanceOf(account).call();
        const decimals = await tokenContract.methods.decimals().call();
        const Balance = tokenBalance/Math.pow(10, decimals);
        tokenBalanceLabel.innerHTML = 'Token Balance: ' + Balance;

    });

    getETHBalanceButton.addEventListener('click', async () => {

        const ETHbalance = await web3.eth.getBalance(account);
        ETHBalanceLabel.innerHTML = 'ETH Balance: ' + web3.utils.fromWei(ETHbalance, 'ether');

    });

    getJobCountButton.addEventListener('click', async () => {

        const _limitOrderAddress = web3.utils.toChecksumAddress(limitOrderAddressInput.value);
        const limitOrderContract = new web3.eth.Contract(limitOrderABI, _limitOrderAddress);
        const jobCount = await limitOrderContract.methods.checkJobCountForUser(account).call();
        jobCountLabel.innerHTML = 'Job Count: ' + jobCount;

    });

    getFeeAmountButton.addEventListener('click',  async () => {

        const _limitOrderAddress = web3.utils.toChecksumAddress(limitOrderAddressInput.value);
        const limitOrderContract = new web3.eth.Contract(limitOrderABI, _limitOrderAddress);
        const _feeAmount = await limitOrderContract.methods.getFeeAmount().call();
        const feeAmount = _feeAmount/Math.pow(10, 18);
        feeAmountLabel.innerHTML = 'Fee Amount: ' + feeAmount;

    });

    getGasFeeAmountButton.addEventListener('click',  async () => {

        const _limitOrderAddress = web3.utils.toChecksumAddress(limitOrderAddressInput.value);
        const limitOrderContract = new web3.eth.Contract(limitOrderABI, _limitOrderAddress);
        const _BNBAmount = web3.utils.toWei(web3.utils.fromWei(BNBAmountInput.value, 'ether'), 'ether');
        const _gasFeeAmount = await limitOrderContract.methods.getGasFeeAmount(_BNBAmount).call();
        const gasFeeAmount = _gasFeeAmount/Math.pow(10, 18);
        gasFeeAmountLabel.innerHTML = 'Gas Fee Amount: ' + gasFeeAmount;

    });

    getUserBalanceButton.addEventListener('click',  async () => {

        const _stakingAddress = web3.utils.toChecksumAddress(stakingContractAddressInput.value);
        const stakingContract = new web3.eth.Contract(stakingABI, _stakingAddress);
        const _userAddress = web3.utils.toChecksumAddress(userAddressForUserBalanceInput.value);
        const _userBalance = await stakingContract.methods.getUserBalance(_userAddress).call();
        const userBalance = _userBalance/Math.pow(10, 18);
        userBalanceLabel.innerHTML = 'User Balance: ' + userBalance;

    });

    checkForUpdateButton.addEventListener('click',  async () => {

        const _limitOrderAddress = web3.utils.toChecksumAddress(limitOrderAddressInput.value);
        const limitOrderContract = new web3.eth.Contract(limitOrderABI, _limitOrderAddress);
        const _userAddress = web3.utils.toChecksumAddress(userAddressForCheckForUpdateInput.value);
        const _orderNumber = orderNumberCheckForUpdateInput.value;
        const _update = await limitOrderContract.methods.checkForUpdate(_userAddress, _orderNumber).call();
        updateLabel.innerHTML = 'Update: ' + _update;

    });

    liquidateOrderButton.addEventListener('click', () => {

        const _limitOrderAddress = web3.utils.toChecksumAddress(limitOrderAddressInput.value);
        const limitOrderContract = new web3.eth.Contract(limitOrderABI, _limitOrderAddress);

        let tx_builder = limitOrderContract.methods.update(account, 0);
        let encoded_tx = tx_builder.encodeABI();
        let transactionObject = {
            data: encoded_tx,
            from: account,
            to: _limitOrderAddress
        };

        console.log('Sending update transaction...');
        web3.eth.sendTransaction(transactionObject)
            .then(function(receipt){
                console.log('Update transaction receipt received!');
                console.log(receipt);
            });
    });

   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
   const account = accounts[0];
   ethereumButton.innerHTML = account;

      let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
     if (web3) {
       console.log('web3');
     } else { console.log('NO web3'); }


      const BN = web3.utils.BN;
      const balance = await web3.eth.getBalance(account);



}
