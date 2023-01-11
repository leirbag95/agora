// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./TraitCollectible.sol";
import "./Collectible.sol";
import "./utils/Random.sol";

contract ShopNFTGenerator is Ownable {
    Random public randomContract;
    uint256 public index;
    mapping(uint256 => address) public contracts;

    event NewContractCreated(
        address indexed contractAddress,
        uint256 indexed index
    );

    constructor() {
        index = 0;
        randomContract = new Random();
    }

    /***********************
        Admin function area
    ************************/

    /**
     * @dev Creates a new collectible contract.
     * @param _name Name of the collectible.
     * @param _symbol Symbol of the collectible.
     * @param _maxSupply Total supply of the collectible.
     */
    function createContract(
        string memory _name,
        string memory _symbol,
        string memory _baseTokenURI,
        uint256 _maxSupply
    ) external onlyOwner {
        Collectible collectible = new Collectible(
            _name,
            _symbol,
            _baseTokenURI,
            _maxSupply
        );
        TraitCollectible traitContract = new TraitCollectible(
            randomContract,
            collectible
        );
        collectible.setTraitCollectible(address(traitContract));
        collectible.transferOwnership(msg.sender);
        traitContract.transferOwnership(address(collectible));
        contracts[index] = address(collectible);
        emit NewContractCreated(address(collectible), index);
        index += 1;
    }
}
