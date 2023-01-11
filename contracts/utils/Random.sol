pragma solidity ^0.8.17;

contract Random {

    //Off-chain equity and ETF assets are traded only during standard market
    //hours from 9:30AM to 4:00PM EDT Monday through Friday. 
    address public priceFeed;

    /*************************
            Custom Errors
    ***************************/

    error NotUpdated();
    error InvalidPrice();

    constructor() {
        priceFeed = 0x779877A7B0D9E8603169DdbD7836e478b4624789;
    }
    
    /***********************
        Admin function area
    ************************/
    function generateNumber(address _account, uint256 _tokenId)
    view 
    external 
    returns(uint256)
    {
        //(uint256 tokenPrice, ) = getPrice();
        return ((uint256(keccak256(abi.encodePacked(block.timestamp,
                                          _account,
                                          _tokenId))) %
                                          100) + 1)*10e14;
    }

    function generateHash(address _account, uint256 _tokenId) external view returns(bytes32) {
        return keccak256(abi.encodePacked(block.timestamp,
                                          _account,
                                          _tokenId));
    }

    /***********************
        View function area
    ************************/

}