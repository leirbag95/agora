// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ITraitCollectible.sol";

contract Collectible is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter public tokenIds;
    ITraitCollectible public traitContract;

    uint256 public maxSupply;
    string public baseTokenURI;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseTokenURI,
        uint256 _maxSupply
    ) ERC721(_name, _symbol) {
        maxSupply = _maxSupply;
        baseTokenURI = _baseTokenURI;
    }

    /**
     * @dev Mints a new NFT for free and sends it to the given `_to` address.
     * @param _to Address to send the NFT to.
     */
    function mint(address _to) external nonReentrant {
        require(
            tokenIds.current() < maxSupply,
            "Maximum supply has been reached"
        );
        tokenIds.increment();
        uint256 newItemId = tokenIds.current();
        _safeMint(_to, newItemId);
        traitContract.addTrait(tokenIds.current(), _msgSender());
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return traitContract.tokenURI(_tokenId);
    }

    /***********************
        Admin function area
    ************************/

    function setTraitCollectible(address _traitContract) external onlyOwner {
        traitContract = ITraitCollectible(_traitContract);
    }
}
