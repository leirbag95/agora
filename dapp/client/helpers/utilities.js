export function ellipseAddress (address, width = 10) {
  return `${address?.slice(0, width)}...${address?.slice(-width)}`
}