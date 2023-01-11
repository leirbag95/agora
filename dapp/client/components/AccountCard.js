import {
    UnstyledButton,
    Group,
    Avatar,
    Text,
    createStyles,
  } from '@mantine/core';
  import React, { useState, useEffect } from "react";
  import { ellipseAddress } from "../helpers/utilities";
  import { IconCurrencyEthereum } from '@tabler/icons';
  import { ethers } from "ethers";
  
  const useStyles = createStyles((theme) => ({
    user: {
      display: 'block',
      width: '100%',
      padding: theme.spacing.md,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
  
      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
      },
    },
  }));
  
  export function AccountCard({ image, address, provider}) {
    const { classes } = useStyles();
    const [balance, setBalance] = useState("0");

    const getBalance = async () => {
      try {
        setBalance(await provider.getBalance(address))
      } catch {
        setBalance("0")
      }
    }

    useEffect(() => {
        getBalance()
    }, []);
    return (
      <UnstyledButton className={classes.user} >
        <Group>
          <Avatar src={image} radius="xl" size="md" />
  
          <div style={{ flex: 1 }}>
            <Text size="xs" weight={500}>
              {ellipseAddress(address, 4)}
            </Text>
  
            <Text color="dimmed" size="xs">
            <IconCurrencyEthereum size={10} />
              {
                parseFloat(ethers.utils.formatEther(balance)).toFixed(2)
              }
            </Text>
          </div>
        </Group>
      </UnstyledButton>
    );
  }