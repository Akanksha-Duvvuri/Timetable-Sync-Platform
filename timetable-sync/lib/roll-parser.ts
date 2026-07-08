export interface BranchConfig {
  code: string;
  name: string;
  sections: number;
}

// Order matters for matching — longer codes must be checked before shorter
// ones that could be a prefix of them (e.g. "BTD" before "BT").
export const BRANCHES: BranchConfig[] = [
  { code: "VLSI", name: "VLSI", sections: 1 },
  { code: "ICSE", name: "ICSE", sections: 1 },
  { code: "BTD", name: "BT (Dual Degree)", sections: 1 },
  { code: "CSE", name: "CSE", sections: 3 },
  { code: "ECE", name: "ECE", sections: 1 },
  { code: "ECM", name: "ECM", sections: 1 },
  { code: "AI", name: "AI", sections: 2 },
  { code: "BT", name: "BT", sections: 1 },
  { code: "CB", name: "CB", sections: 1 },
  { code: "AE", name: "AE", sections: 1 },
  { code: "DS", name: "DS", sections: 1 },
  { code: "CE", name: "CE", sections: 1 },
  { code: "NT", name: "NT", sections: 1 },
  { code: "MT", name: "MT", sections: 1 },
  { code: "ME", name: "ME", sections: 1 },
];

export interface ParsedRoll {
  valid: boolean;
  error?: string;
  school?: string;
  year?: string;
  level?: string;
  branch?: BranchConfig;
  rollDigits?: string;
}

const ROLL_LENGTH = 11;
const PREFIX_LENGTH = 5; // school (2) + year (2) + level (1)
const TAIL_LENGTH = ROLL_LENGTH - PREFIX_LENGTH; // 6, split across branch code + digits

export function parseRollNumber(raw: string): ParsedRoll {
  const roll = raw.trim().toUpperCase();

  if (roll.length !== ROLL_LENGTH) {
    return { valid: false, error: `Roll number must be ${ROLL_LENGTH} characters` };
  }

  const school = roll.slice(0, 2);
  const year = roll.slice(2, 4);
  const level = roll.slice(4, 5);
  const tail = roll.slice(PREFIX_LENGTH); // 6 chars: branch code + digits

  if (!/^\d{2}$/.test(year)) {
    return { valid: false, error: "Year segment must be 2 digits" };
  }

  const branch = BRANCHES.find((b) => tail.startsWith(b.code));

  if (!branch) {
    return { valid: false, error: "Branch code not recognized" };
  }

  const rollDigits = tail.slice(branch.code.length);

  if (!/^\d+$/.test(rollDigits) || rollDigits.length !== TAIL_LENGTH - branch.code.length) {
    return { valid: false, error: "Roll digits are malformed" };
  }

  return {
    valid: true,
    school,
    year,
    level,
    branch,
    rollDigits,
  };
}

export function sectionOptions(branch: BranchConfig): string[] {
  if (branch.sections === 1) {
    return [branch.code];
  }
  return Array.from({ length: branch.sections }, (_, i) => `${branch.code}${i + 1}`);
}
