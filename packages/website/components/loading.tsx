import { Center, createStyles, keyframes } from '@mantine/core';
import Image from 'next/image';

const spin = keyframes`
from {
  transform:rotate(0deg);
}
to {
  transform:rotate(360deg);
}
`;

const useStyles = createStyles(() => ({
  center: {
    height: '100vh'
  },
  image: {
    animation: `${spin} 5s linear infinite`
  }
}));

export default function Loading() {
  const { classes } = useStyles();
  return (
    <Center className={classes.center}>
      <Image
        className={classes.image}
        src="/images/logo.png"
        alt="Loading..."
        width={100}
        height={100}
      />
    </Center>
  );
}
