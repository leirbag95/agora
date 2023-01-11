// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

interface ITraitCollectible {
    struct Trait {
        uint256 mintPrice;
    }

    function tokenURI(uint256 _tokenId) external view returns (string memory);

    function addTrait(uint256 _tokenId, address _minter) external;

    function getMetadata(uint256 _tokenId) external view returns (Trait memory);
}
