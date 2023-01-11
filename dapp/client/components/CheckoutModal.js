import { useState } from 'react';
import { Modal, Button, Group, Text, Flex, Notification } from '@mantine/core';
import { IconCurrencyEthereum, IconX } from '@tabler/icons';
import { BigNumber, ethers } from "ethers";
import eth from "../assets/ETH.svg"
import { ADDRESSES } from '../constants/addresses'
import ABIs from '../constants/abis.json'

export function CheckoutModal({ total, provider, collection }) {
    const [opened, setOpened] = useState(false);
    const [errorMsg, setErrorMsg] = useState("")

    const purchase = async () => {
        var signer;
        try {
            signer = provider.getSigner()
        } catch (err) {
            setErrorMsg(err.message)
        }
        const shopContract = new ethers.Contract(ADDRESSES.Shop, ABIs.Shop, signer)
        var tokenIds = Object.keys(JSON.parse(localStorage.getItem('cartSet')))
        for (var i = 0; i < tokenIds.length; i++)
            tokenIds[i] = BigNumber.from(tokenIds[i]).toNumber()
        try {
            let req = await shopContract.buy(collection, tokenIds, { value: total })
            await req.wait()
            localStorage.clear()
            setOpened(false)
        } catch (err) {
            setErrorMsg(err.message)
        }

    }
    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Final step"
            >
                <Flex position="left" mt="xl" mb="xl" gap="xs" justify={{ sm: 'space-between' }} align="center">
                    <Text fz="xl" weight={700}>Total</Text>
                    <Flex position="left" align="center">
                        <div> <img src={eth.src} width="12px" style={{ margin: "0 0.2em" }} /> </div>
                        <div><Text fz="md" weight={500}>{ethers.utils.formatEther(total)}</Text></div>
                    </Flex>
                </Flex>
                {
                    (errorMsg.length > 0) && (
                        <Notification onClose={() => { setErrorMsg("") }} icon={<IconX size={18} />} color="red">
                            {errorMsg}
                        </Notification>
                    )
                }

                <Button
                    leftIcon={<IconCurrencyEthereum size={14} />}
                    onClick={() => purchase()}
                    fullWidth
                    radius="md"
                    mt="xl"
                    size="md"
                    color="dark"
                >
                    Purchase
                </Button>

            </Modal>

            <Group position="center">
                <Button
                    onClick={() => setOpened(true)}
                    fullWidth
                    radius="md"
                    mt="xl"
                    size="md"
                    color="dark"
                >
                    Complete checkout
                </Button>
            </Group>
        </>
    );
}