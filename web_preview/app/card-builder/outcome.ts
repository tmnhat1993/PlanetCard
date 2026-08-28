export type OutcomeInput = {
  base: number;
  shipAmplification: number;
  cardCoefficient: number;
  compatible?: boolean;
};

export type OutcomeResult = {
  base: number;
  bonusPercent: number;
  bonusValue: number;
  total: number;
  effectiveShipAmplification: number;
};

export function calculateCardOutcome(input: OutcomeInput): OutcomeResult {
  const base = Math.max(0, input.base);
  const shipAmplification = input.compatible === false ? 0 : Math.max(0, input.shipAmplification);
  const cardCoefficient = Math.max(0, input.cardCoefficient);
  const bonusPercent = shipAmplification * cardCoefficient;
  const bonusValue = Math.floor(base * bonusPercent / 100);
  return { base, bonusPercent, bonusValue, total: base + bonusValue, effectiveShipAmplification: shipAmplification };
}
