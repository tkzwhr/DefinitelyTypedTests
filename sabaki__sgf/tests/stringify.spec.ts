import * as sgf from "@sabaki/sgf";
import { expect, test } from "vitest";

// ref. https://github.com/SabakiHQ/sgf/blob/master/tests/stringify.test.js

const gametrees: sgf.Types.NodeObject[] = [
  {
    id: 0,
    parentId: null,
    data: { B: ["aa"], SZ: ["19"] },
    children: [
      {
        id: 1,
        parentId: 0,
        data: { AB: ["cc", "dd:ee"] },
        children: [],
      },
    ],
  },
  {
    id: 2,
    parentId: null,
    data: { CP: ["Copyright"] },
    children: [
      {
        id: 3,
        parentId: 2,
        data: { B: ["ab"] },
        children: [],
      },
      {
        id: 4,
        parentId: 2,
        data: { W: ["ac"] },
        children: [],
      },
    ],
  },
];

test("should stringify single game tree with parenthesis", () => {
  expect(
    sgf.stringify(gametrees.slice(0, 1)),
  ).toBe(
    "(\n  ;B[aa]SZ[19]\n  ;AB[cc][dd:ee]\n)\n",
  );
});

test("should stringify multiple game trees with correct indentation", () => {
  expect(
    sgf.stringify(gametrees),
  ).toBe(
    "(\n  ;B[aa]SZ[19]\n  ;AB[cc][dd:ee]\n)(\n  ;CP[Copyright]\n  (\n    ;B[ab]\n  )(\n    ;W[ac]\n  )\n)\n",
  );
});

test("should respect line break option", () => {
  expect(
    sgf.stringify(gametrees, { linebreak: "" }),
  ).toBe(
    "(;B[aa]SZ[19];AB[cc][dd:ee])(;CP[Copyright](;B[ab])(;W[ac]))",
  );
});

test("should ignore mixed case node properties", () => {
  expect(
    sgf.stringify({
      // @ts-ignore
      data: { B: ["ab"], board: "should ignore" },
      children: [],
    }),
  ).toBe(
    ";B[ab]\n",
  );
});
