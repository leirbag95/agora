import { Grid, Pagination, Text, Button, Group } from '@mantine/core';
import { NFTCard } from '../components/NFTCard'
import { useEffect, useRef, useState } from "react";
import ABIs from '../constants/abis.json'
import { ADDRESSES } from '../constants/addresses'
import Sidebar from '../components/Sidebar'
import { ethers } from "ethers";
import { ellipseAddress } from '../helpers/utilities';

export default function Shop() {
  const [collectibles, setCollectibles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [collectionName, setCollectionName] = useState([]);
  const [currentCollectionContract, setCurrentCollection] = useState("")
  const [numberOfContract, setNumberOfContract] = useState(0);
  const [cartItem, setCartItem] = useState([])
  const [activeCollection, setActiveCollection] = useState(1)
  const [activePage, setActivePage] = useState(1)
  const [pageNumber, setPageNumber] = useState(0)

  const fecthShopNFTGenerator = async () => {
    var ShopNFTGenerator;
    var provider;
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum)
    } catch (err) {
      alert(err.message)
    }
    try {
      ShopNFTGenerator = new ethers.Contract(ADDRESSES.ShopNFTGenerator, ABIs.ShopNFTGenerator, provider)
    } catch (err) {
      throw Error(err)
    }
    setNumberOfContract(parseInt(await ShopNFTGenerator.index()))
  }

  const fetchCollectibles = async (colNumber = 0, page = 1, count = 8, clearMode = false) => {
    setActivePage(page)
    setActiveCollection(colNumber)
    if (clearMode) {
      localStorage.clear()
      setCartItem([])
    }
    var ShopNFTGenerator;
    var Collectibles;
    var collectionContract;
    var provider;
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum)
    } catch (err) {
      alert(err.message)
    }
    try {
      ShopNFTGenerator = new ethers.Contract(ADDRESSES.ShopNFTGenerator, ABIs.ShopNFTGenerator, provider)
    } catch (err) {
      throw Error(err)
    }
    var collectibleList = [];
    try {
      collectionContract = await ShopNFTGenerator.contracts(colNumber)
      setCurrentCollection(collectionContract);
    } catch (err) {
      throw Error(err)
    }

    try {
      Collectibles = new ethers.Contract(collectionContract, ABIs.Collectible, provider)
    } catch (err) {
      throw Error(err)
    }

    var i = (page - 1) * count;
    const balanceOf = await Collectibles.balanceOf(ADDRESSES.Bank)
    const numberOfToken = await Collectibles.tokenIds();
    setPageNumber(Math.ceil(balanceOf / count))
    var c = 0;
    while (i < numberOfToken.toNumber() && c < Math.min(count, balanceOf.toNumber())) {
      const ownerOf = await Collectibles.ownerOf(i + 1)
      if (ownerOf === ADDRESSES.Bank) {
        const dataURI = await Collectibles.tokenURI(i + 1)
        const json = atob(dataURI.substring(29));
        const result = JSON.parse(json);
        result.colName = await Collectibles.name()
        result.tokenId = i + 1
        collectibleList.push(result)
        c += 1;
      }
      i += 1
    }
    setCollectibles(collectibleList)
    setCollectionName(await Collectibles.name())
  }

  const addToCart = (item) => {
    if (!isSelected(item.tokenId)) {
      var a = [];
      var s = {};
      a = JSON.parse(localStorage.getItem('cart')) || [];
      s = JSON.parse(localStorage.getItem('cartSet')) || {};
      a.push(item);
      s[item.tokenId] = true
      localStorage.setItem('cart', JSON.stringify(a));
      localStorage.setItem('cartSet', JSON.stringify(s));
      setIsOpen(true)
      setCartItem(a)
    }
  }

  const isSelected = (tokenId) => {
    var s = JSON.parse(localStorage.getItem('cartSet')) || {};
    return s[tokenId]
  }

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet     
    fecthShopNFTGenerator();
    fetchCollectibles();
  }, []);
  return (
    <div style={{ margin: "0 50px" }}>
      <Sidebar collection={currentCollectionContract} isOpen={isOpen} setIsOpen={setIsOpen} cartItem={cartItem} setCartItem={setCartItem}></Sidebar>
      <div mt="md" styles="width:100%;">
        <Text fz="xl" fw="700">Select your collection</Text>
        <Text fw="300" fz="sm">By changing your collection your basket will be emptied</Text>
        <Pagination my="md" total={numberOfContract} onChange={(p) => { fetchCollectibles(p - 1, 1, 8, true) }} />
        <Text fz="xl" fw="700" my="md">{collectionName} ({ellipseAddress(currentCollectionContract)})</Text>
        <Grid>
          {
            collectibles.map((item, index) => (
              <Grid.Col xs={3} >
                <NFTCard metadata={item} addToCart={addToCart}></NFTCard>
              </Grid.Col>
            ))
          }
        </Grid>
        <Pagination my="md" total={pageNumber} onChange={(p) => { fetchCollectibles(activeCollection, p, 8) }} />
      </div>
    </div>
  );
}