import { createStyles, Image, Text, Group, Button, CloseButton } from '@mantine/core';
import { ethers } from "ethers";
import { IconCurrencyEthereum } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
  },

  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

export function CartCard({ metadata, deleteButton }) {
  const { classes } = useStyles();
  return (
    <div>
      <Group noWrap>
        <Image src={metadata.image} width={50}>
        </Image>
        <div>
          <Text size="sm" weight={500} className={classes.name}>
            {metadata.name}
          </Text>

          <Text size="xs" weight={700} color="dimmed">
            {metadata.colName}
          </Text>

          <Group noWrap spacing={10} mt={3}>
            <IconCurrencyEthereum stroke={1.5} size={16} className={classes.icon} />
            <Text size="xs" color="dimmed">
              {ethers.utils.formatEther(metadata.attributes[0].value)}
            </Text>
          </Group>
        </div>
        <CloseButton aria-label="Close modal" onClick={() => { deleteButton(metadata) }} />
      </Group>
    </div>
  );
}