// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import "./Collectible.sol";
import "./ITraitCollectible.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Shop is ReentrancyGuard {
    /**
     * The bank is the wallet that holds the NFTs, this wallet will approach
     * this contract so that it can transfer the NFTs directly to whoever
     * wants to buy them.
     */
    address public bank;
    address public treasury = 0x1e4EeD1E29B284baCF87D7c75C5798280CB40BA7;

    event NewPurchase(
        address indexed collection,
        uint256 tokenId,
        address indexed buyer
    );

    constructor(address _bank) {
        bank = _bank;
    }

    /**
     * allows the user to buy a collectible token from `bank` wallet
     * @param _col struct represented NFT
     * @param _tokenIds is the token Id array user wants to buy
     */
    function buy(
        Collectible _col,
        uint256[] memory _tokenIds
    ) external payable nonReentrant {
        uint256 price = getPrice(_col, _tokenIds);
        require(
            msg.value == price,
            "The amount paid must correspond to the price"
        );
        (bool sent, ) = treasury.call{value: price}("");
        require(sent, "Failed to send Ether");
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            require(msg.sender != bank, "Bank can not buy itself");
            require(
                _col.ownerOf(_tokenIds[i]) == bank,
                "Token ID not available"
            );

            _col.safeTransferFrom(bank, msg.sender, _tokenIds[i]);
            emit NewPurchase(address(_col), _tokenIds[i], msg.sender);
        }
    }

    function getPrice(
        Collectible _col,
        uint256[] memory _tokenIds
    ) public view returns (uint256) {
        uint256 t;
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            t += _col.traitContract().getMetadata(_tokenIds[i]).mintPrice;
        }
        return t;
    }
}
