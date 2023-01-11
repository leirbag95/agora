// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "./utils/Random.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./utils/CustomStrings.sol";
import "./Collectible.sol";

contract TraitCollectible is Ownable {
    using CustomStrings for uint256;
    using CustomStrings for address;
    using CustomStrings for bytes;
    using CustomStrings for bytes32;

    Random randomContract;
    Collectible collectible;

    string public baseTokenURI;
    string name;

    struct Trait {
        uint256 mintPrice;
    }

    mapping(uint256 => Trait) public traits;
    mapping(address => bool) public admins;

    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner(), "no admin");
        _;
    }

    constructor(Random _randomContract, Collectible _collectible) {
        randomContract = _randomContract;
        collectible = _collectible;
        name = collectible.name();
        baseTokenURI = collectible.baseTokenURI();
    }

    function addTrait(uint256 _tokenId, address _minter) external onlyAdmin {
        uint256 mintPrice = randomContract.generateNumber(_minter, _tokenId);
        traits[_tokenId] = Trait(mintPrice);
    }

    function setAdmin(address _account, bool _value) external onlyAdmin {
        admins[_account] = _value;
    }

    function setURI(string memory _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    /***********************
        View function area
    ************************/

    /**
     * @notice return NFT metadata from tokenId
     * @param _tokenId is the id of token
     */
    function getMetadata(
        uint256 _tokenId
    ) external view returns (Trait memory) {
        return traits[_tokenId];
    }

    function attributeForTypeAndValue(
        string memory traitType,
        string memory value
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '{"trait_type":"',
                    traitType,
                    '","value":"',
                    value,
                    '"}'
                )
            );
    }

    /**
     * generates an array composed of all the individual traits and values
     * @param _tokenId the ID of the token to compose the metadata for
     * @return a JSON array of all of the attributes for given token ID
     */
    function compileAttributes(
        uint256 _tokenId
    ) public view returns (string memory) {
        string memory _traits;
        _traits = string(
            abi.encodePacked(
                attributeForTypeAndValue(
                    "Mint price",
                    traits[_tokenId].mintPrice.toString()
                )
            )
        );
        return string(abi.encodePacked("[", _traits, "]"));
    }

    function tokenURI(uint256 _tokenId) public view returns (string memory) {
        Trait memory t = traits[_tokenId];

        string memory metadata = string(
            abi.encodePacked(
                '{"name": "',
                name,
                " #",
                _tokenId.toString(),
                '", "description": "Basic NFT Contract.", "image": "',
                baseTokenURI,
                CustomStrings.toAsciiString(address(collectible)),
                _tokenId.toString(),
                t.mintPrice.toString(),
                '", "attributes":',
                compileAttributes(_tokenId),
                "}"
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    CustomStrings.base64(bytes(metadata))
                )
            );
    }
}
