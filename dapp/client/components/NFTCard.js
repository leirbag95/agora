import { Card, Text, Flex, Image } from '@mantine/core';
import { ethers } from "ethers";
import eth from "../assets/ETH.svg"

export function NFTCard({ metadata, addToCart }) {
    return (
        <Card style={{ cursor: "pointer" }} shadow="sm" p="md" radius="md" withBorder onClick={() => addToCart(metadata)}>
            <Card.Section>
                <Image
                    src={metadata.image}
                    height={200}
                    alt="Norway"
                />
            </Card.Section>

            <Flex position="left" mt="xs" mb="xs" gap="xs" justify={{ sm: 'space-between' }} align="center">
                <Text fz="xs" weight={500}>{metadata.name}</Text>
                <Flex position="left">
                    <div> <img src={eth.src} width="10px" style={{ margin: "0 0.2em" }} /> </div>
                    <div><Text fz="xs" weight={500}>{parseFloat(ethers.utils.formatEther(metadata?.attributes[0]?.value)).toFixed(2)}</Text></div>
                </Flex>
            </Flex>
            <style jsx>{`
            `}</style>
        </Card>
    );
}