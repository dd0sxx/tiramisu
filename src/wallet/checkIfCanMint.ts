import { Contract } from "ethers";

export const checkIfCanMint = async ({
  contract,
}: {
  contract: Contract;
}): Promise<boolean> => {
  return contract.isAddressEligibleForPremint();
};
