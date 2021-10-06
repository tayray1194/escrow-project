

// contract address
const ESCROW_ADDRESS = "0x4f126377896612135d8Cb983cd066bf413218063";


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
const productPriceInput = document.querySelector('#Product-Price');
const checkFundsLabel = document.querySelector('#Check-Funds-Label');
const isProductShippedInput = document.querySelector('#Is-Product-Shipped');
const shipmentStatusLabel = document.querySelector('#Shipment-Status-Label');
const updateBuyerAddressInput = document.querySelector('#Update-Buyer-Address');
const updateSellerAddressInput = document.querySelector('#Update-Seller-Address');
const updateEscrowAgentAddressInput = document.querySelector('#Update-Escrow-Agent-Address');
const updateArbitrationFeePercentageInput = document.querySelector('#Update-Arbitration-Fee-Percentage');
const userAddressInput = document.querySelector('#User-Address');
const userBalanceLabel = document.querySelector('#User-Balance-Label');
const buyerAddressLabel = document.querySelector('#Buyer-Address-Label');
const sellerAddressLabel = document.querySelector('#Seller-Address-Label');
const escrowAgentAddressLabel = document.querySelector('#Escrow-Agent-Address-Label');
const arbitrationFeeLabel = document.querySelector('#Arbitration-Fee-Label');
const productPriceLabel = document.querySelector('#Product-Price-Label');


// buttons
const setProductPriceButton = document.querySelector('#Set-Product-Price-Button');
const checkFundsButton = document.querySelector('#Check-Funds-Button');
const confirmShipmentButton = document.querySelector('#Confirm-Shipment-Button');
const shipmentStatusButton = document.querySelector('#Shipment-Status-Button');
const transferFundsToSellerButton = document.querySelector('#Transfer-Funds-To-Seller-Button');
const returnFundsToBuyerButton = document.querySelector('#Return-Funds-To-Buyer-Button');
const updateBuyerAddressButton = document.querySelector('#Update-Buyer-Address-Button');
const updateSellerAddressButton = document.querySelector('#Update-Seller-Address-Button');
const updateEscrowAgentAddressButton = document.querySelector('#Update-Escrow-Agent-Address-Button');
const updateArbitrationFeePercentageButton = document.querySelector('#Update-Arbitration-Fee-Percentage-Button');
const checkUserBalanceButton = document.querySelector('#Check-User-Balance-Button');
const checkBuyerAddressButton = document.querySelector('#Check-Buyer-Address-Button');
const checkSellerAddressButton = document.querySelector('#Check-Seller-Address-Button');
const checkEscrowAgentAddressButton = document.querySelector('#Check-Escrow-Agent-Address-Button');
const checkArbitrationFeeButton = document.querySelector('#Check-Arbitration-Fee-Button');
const checkProductPriceButton = document.querySelector('#Check-Product-Price-Button');
const newEscrowProductButton = document.querySelector('#New-Escrow-Product-Button');






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
    const _escrowABI = await fetch("./js/abis/Escrow.json")
        .then(response => {
            console.log('Loaded escrowABI');
            return response.json();
        })
        .catch(function (err) {
            console.log(err);
        });
    const escrowABI = _escrowABI["abi"];

    //======================================================================================================================
    //
    // TODO - register event listeners for buttons inside of getAccounts function
    //
    //======================================================================================================================

    setProductPriceButton.addEventListener('click',  () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const _productPrice = web3.utils.toWei(web3.utils.fromWei(productPriceInput.value, 'ether'), 'ether');
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);

        let tx_builder = escrowContract.methods.setProductPrice(
            _productPrice);
        let encoded_tx = tx_builder.encodeABI();
        let transactionObject = {
            data: encoded_tx,
            from: account,
            to: _escrowAddress,
        };

        console.log('Sending setProductPrice transaction...');
        web3.eth.sendTransaction(transactionObject)
            .then(function(receipt){
                console.log('setProductPrice transaction receipt received!');
                console.log(receipt);
            });
    });

    checkFundsButton.addEventListener('click',  async () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);
        const checkFunds = await escrowContract.methods.checkFunds().call();
        checkFundsLabel.innerHTML = 'Check Funds: ' + checkFunds;

    });

    confirmShipmentButton.addEventListener('click',  () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const _isProductShipped = isProductShippedInput.value;
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);

        let tx_builder = escrowContract.methods.confirmShipment(
            _isProductShipped);
        let encoded_tx = tx_builder.encodeABI();
        let transactionObject = {
            data: encoded_tx,
            from: account,
            to: _escrowAddress,
        };

        console.log('Sending confirmShipment transaction...');
        web3.eth.sendTransaction(transactionObject)
            .then(function(receipt){
                console.log('confirmShipment transaction receipt received!');
                console.log(receipt);
            });
    });

    shipmentStatusButton.addEventListener('click',  async () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);
        const shipmentStatus = await escrowContract.methods.shipmentStatus().call();
        shipmentStatusLabel.innerHTML = 'Shipment Status: ' + shipmentStatus;

    });

    transferFundsToSellerButton.addEventListener('click',  () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);

        let tx_builder = escrowContract.methods.transferFundsToSeller();
        let encoded_tx = tx_builder.encodeABI();
        let transactionObject = {
            data: encoded_tx,
            from: account,
            to: _escrowAddress
        };

        console.log('Sending transferFundsToSeller transaction...');
        web3.eth.sendTransaction(transactionObject)
            .then(function(receipt){
                console.log('transferFundsToSeller transaction receipt received!');
                console.log(receipt);
            });
    });

    returnFundsToBuyerButton.addEventListener('click',  () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);

        let tx_builder = escrowContract.methods.returnFundsToBuyer();
        let encoded_tx = tx_builder.encodeABI();
        let transactionObject = {
            data: encoded_tx,
            from: account,
            to: _escrowAddress
        };

        console.log('Sending returnFundsToBuyer transaction...');
        web3.eth.sendTransaction(transactionObject)
            .then(function(receipt){
                console.log('returnFundsToBuyer transaction receipt received!');
                console.log(receipt);
            });
    });

    updateBuyerAddressButton.addEventListener('click',  () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const _buyerAddress = web3.utils.toChecksumAddress(updateBuyerAddressInput.value);
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);

        let tx_builder = escrowContract.methods.updateBuyerAddress(_buyerAddress);
        let encoded_tx = tx_builder.encodeABI();
        let transactionObject = {
            data: encoded_tx,
            from: account,
            to: _escrowAddress
        };

        console.log('Sending updateBuyerAddress transaction...');
        web3.eth.sendTransaction(transactionObject)
            .then(function(receipt){
                console.log('updateBuyerAddress transaction receipt received!');
                console.log(receipt);
            });
    });

    updateSellerAddressButton.addEventListener('click',  () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const _sellerAddress = web3.utils.toChecksumAddress(updateSellerAddressInput.value);
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);

        let tx_builder = escrowContract.methods.updateSellerAddress(_sellerAddress);
        let encoded_tx = tx_builder.encodeABI();
        let transactionObject = {
            data: encoded_tx,
            from: account,
            to: _escrowAddress
        };

        console.log('Sending updateSellerAddress transaction...');
        web3.eth.sendTransaction(transactionObject)
            .then(function(receipt){
                console.log('updateSellerAddress transaction receipt received!');
                console.log(receipt);
            });
    });

    updateEscrowAgentAddressButton.addEventListener('click',  () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const _escrowAgentAddress = web3.utils.toChecksumAddress(updateEscrowAgentAddressInput.value);
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);

        let tx_builder = escrowContract.methods.updateEscrowAgentAddress(_escrowAgentAddress);
        let encoded_tx = tx_builder.encodeABI();
        let transactionObject = {
            data: encoded_tx,
            from: account,
            to: _escrowAddress
        };

        console.log('Sending updateEscrowAgentAddress transaction...');
        web3.eth.sendTransaction(transactionObject)
            .then(function(receipt){
                console.log('updateEscrowAgentAddress transaction receipt received!');
                console.log(receipt);
            });
    });

    updateArbitrationFeePercentageButton.addEventListener('click',  () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const _arbitrationFeePercentage = updateArbitrationFeePercentageInput.value
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);

        let tx_builder = escrowContract.methods.updateArbitrationFeePercentage(_arbitrationFeePercentage);
        let encoded_tx = tx_builder.encodeABI();
        let transactionObject = {
            data: encoded_tx,
            from: account,
            to: _escrowAddress
        };

        console.log('Sending updateArbitrationFeePercentage transaction...');
        web3.eth.sendTransaction(transactionObject)
            .then(function(receipt){
                console.log('updateArbitrationFeePercentage transaction receipt received!');
                console.log(receipt);
            });
    });

    checkUserBalanceButton.addEventListener('click',  async () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const _userAddress = web3.utils.toChecksumAddress(userAddressInput.value);
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);
        const userBalance = await escrowContract.methods.checkUserBalance(_userAddress).call();
        userBalanceLabel.innerHTML = 'User Balance: ' + userBalance;

    });

    checkBuyerAddressButton.addEventListener('click',  async () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);
        const buyerAddress = await escrowContract.methods.checkBuyerAddress().call();
        buyerAddressLabel.innerHTML = 'Buyer Address: ' + buyerAddress;

    });

    checkSellerAddressButton.addEventListener('click',  async () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);
        const sellerAddress = await escrowContract.methods.checkSellerAddress().call();
        sellerAddressLabel.innerHTML = 'Seller Address: ' + sellerAddress;

    });

    checkEscrowAgentAddressButton.addEventListener('click',  async () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);
        const escrowAgentAddress = await escrowContract.methods.checkEscrowAgentAddress().call();
        escrowAgentAddressLabel.innerHTML = 'Escrow Agent Address: ' + escrowAgentAddress;

    });

    checkArbitrationFeeButton.addEventListener('click',  async () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);
        const arbitrationFee = await escrowContract.methods.checkArbitrationFee().call();
        arbitrationFeeLabel.innerHTML = 'Arbitration Fee: ' + arbitrationFee;

    });

    checkProductPriceButton.addEventListener('click',  async () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);
        const productPrice = await escrowContract.methods.checkProductPrice().call();
        productPriceLabel.innerHTML = 'Product Price: ' + productPrice;

    });

    newEscrowProductButton.addEventListener('click',  () => {

        const _escrowAddress = web3.utils.toChecksumAddress(ESCROW_ADDRESS);
        const escrowContract = new web3.eth.Contract(escrowABI, _escrowAddress);

        let tx_builder = escrowContract.methods.newEscrowProduct();
        let encoded_tx = tx_builder.encodeABI();
        let transactionObject = {
            data: encoded_tx,
            from: account,
            to: _escrowAddress
        };

        console.log('Sending newEscrowProduct transaction...');
        web3.eth.sendTransaction(transactionObject)
            .then(function(receipt){
                console.log('newEscrowProduct transaction receipt received!');
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
