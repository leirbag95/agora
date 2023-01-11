import React, { useState, useEffect } from "react";
import "animate.css/animate.min.css";
import { ActionIcon, Text, Flex, SimpleGrid, Button, Card } from '@mantine/core';
import { IconShoppingCart, IconCurrencyEthereum } from '@tabler/icons';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { AccountCard } from "./AccountCard";
import { BigNumber, ethers } from "ethers";
import { CartCard } from "./CartCard";
import { CheckoutModal } from './CheckoutModal'
import eth from "../assets/ETH.svg"
import { connect } from "../hooks/web3/web3-context";

const Sidebar = ({ collection, isOpen, setIsOpen, cartItem, setCartItem }) => {
    const [web3Modal, setWeb3Modal] = useState({});
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(0)
    const [provider, setProvider] = useState(null);


    const getTotal = () => {
        var total = BigInt(0);
        var a = [];
        a = JSON.parse(localStorage.getItem('cart')) || [];
        a.map((item) => {
            total += BigNumber.from(item.attributes[0].value).toBigInt()
        })

        return total.toString()
    }

    const isConnected = () => {
        return account !== null
    }

    const accountChild = <>{
        (isConnected() && isOpen) && (
            <AccountCard image={`https://robohash.org/${account}?set=set3`} address={account} provider={provider}> </AccountCard>
        )
    }
    </>

    const connectWallet = async () => {

        setAccount(await connect(web3Modal, setProvider))
        setIsOpen(true)
    };

    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider, // required
            options: {
                infuraId: process.env.REACT_APP_INFURA_ID, // required
            },
        },
    };

    const deleteButton = (item) => {
        var a = [];
        var s = {};
        a = JSON.parse(localStorage.getItem('cart')) || [];
        s = JSON.parse(localStorage.getItem('cartSet')) || {};

        let newArray = a.filter(elm => elm.tokenId !== item.tokenId);
        delete s[item.tokenId]
        localStorage.setItem('cart', JSON.stringify(newArray));
        localStorage.setItem('cartSet', JSON.stringify(s));
        setCartItem(newArray)
    }

    const [itemList, setItemList] = useState(<></>)

    useEffect(() => {
        const item = <>
            {
                JSON.parse(localStorage.getItem('cart'))?.map((item) => (
                    <SimpleGrid cols={1}>
                        <CartCard metadata={item} deleteButton={deleteButton}>
                        </CartCard>
                    </SimpleGrid>))
            }
        </>
        setItemList(item)
    }, [cartItem]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const web3modal = new Web3Modal({
                network: "goerli", // optional
                cacheProvider: true, // optional
                providerOptions, // required
            });

            setWeb3Modal(web3modal);
        }
    }, []);
    return (
        <div className="sidebar-container" style={{ float: 'right', top: '0px', right: '0px' }}>
            <aside
                className={`sidebar ${isOpen ? "open" : ""}`}
                style={{ width: isOpen ? "15em" : "2em" }}
            >
                {
                    (!isConnected()) && (
                        (!isOpen) ?
                            (
                                <ActionIcon mb="md" onClick={() => connectWallet()} variant="default"><IconCurrencyEthereum size={17.5} /></ActionIcon>
                            ) : (
                                <Button mb="md" fullWidth onClick={() => connectWallet()} leftIcon={<IconCurrencyEthereum />} variant="default" size="xs" color="dark">
                                    Connect wallet
                                </Button>
                            )
                    )

                }
                {accountChild}

                <Flex direction={{ base: 'column', sm: 'row' }} align="center"
                    gap={{ base: 'sm', sm: 'lg' }}
                    justify={{ sm: 'space-between' }}>
                    {
                        (isOpen) &&
                        (
                            <Text fz="md" fw="600" my="md">My Cart</Text>
                        )
                    }
                    <ActionIcon onClick={() => setIsOpen(!isOpen)} variant="default"><IconShoppingCart size={17.5} /></ActionIcon>
                </Flex>
                {
                    (isOpen) &&
                    (
                        itemList
                    )
                }

                {
                    (isOpen) && (
                        <>
                            <Flex position="left" mt="xl" mb="xl" gap="xs" justify={{ sm: 'space-between' }} align="center">
                                <Text fz="xl" weight={700}>Total</Text>
                                <Flex position="left">
                                    <div> <img src={eth.src} width="12px" style={{ margin: "0 0.2em" }} /> </div>
                                    <div><Text fz="md" weight={500}>{ethers.utils.formatEther(getTotal())}</Text></div>
                                </Flex>
                            </Flex>
                            {
                                (isConnected()) && (
                                    <CheckoutModal total={getTotal()} collection={collection} provider={provider}></CheckoutModal>
                                )
                            }
                        </>
                    )
                }
            </aside>
            <style jsx>{`
      .footer {
        position: fixed;
        bottom: 0;
        
        width: 100%;
        background-color: red;
        color: white;
        text-align: center;
      }
        .sidebar-container {
          position: relative;
          height: 100vh;
        }

        .shopping-cart-button {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        @media screen and (max-height: 450px) {
            .sidenav {padding-top: 15px;}
            .sidenav a {font-size: 18px;}
          }

        .sidebar {
          position: fixed;
          height:100%;
          z-index: 1;
          top: 0;
          right: 0;
          bottom: 0;
          background: #f3f3f3;
          padding: 1em;
          overflow-y: auto;
          overflow-x: hidden;
          transition: width 0.5s ease-in-out;
        }

        .open {
          animation: slideInRight 0.5s;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0%);
          }
        }
      `}</style>
        </div>
    );
};

export default Sidebar;
