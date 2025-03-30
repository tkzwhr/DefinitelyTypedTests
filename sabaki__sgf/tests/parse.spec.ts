import * as sgf from "@sabaki/sgf";
import { NodeObject } from "@sabaki/sgf";
import * as path from "node:path";
import { expect, test } from "vitest";

// ref. https://github.com/SabakiHQ/sgf/blob/master/tests/parse.test.js

function getJSON(tree: any) {
  return JSON.parse(
    JSON.stringify(tree, (key, value) => {
      if (key === "id" || key === "parentId") {
        return undefined;
      } else if (key == "children") {
        return value.map(getJSON);
      }

      return value;
    }),
  );
}

test("should parse multiple nodes", () => {
  expect(
    getJSON(sgf.parse("(;B[aa]SZ[19];AB[cc][dd:ee])")[0]),
  ).toStrictEqual(
    getJSON({
      data: { B: ["aa"], SZ: ["19"] },
      children: [
        {
          data: { AB: ["cc", "dd:ee"] },
          children: [],
        },
      ],
    }),
  );
});

test("should not omit CA property", () => {
  expect(
    // @ts-ignore
    getJSON(sgf.parse("(;B[aa]CA[UTF-8])", { encoding: "ISO-8859-1" })[0]),
  ).toStrictEqual(
    getJSON({
      data: { B: ["aa"], CA: ["UTF-8"] },
      children: [],
    }),
  );
});

test("should parse variations", () => {
  expect(
    getJSON(sgf.parse("(;B[hh](;W[ii])(;W[hi]C[h]))")[0]),
  ).toStrictEqual(
    getJSON({
      data: { B: ["hh"] },
      children: [
        {
          data: { W: ["ii"] },
          children: [],
        },
        {
          data: { W: ["hi"], C: ["h"] },
          children: [],
        },
      ],
    }),
  );
});

test("should emit onNodeCreated correctly", () => {
  const nodes: NodeObject[] = [];

  sgf.parse("(;B[hh](;W[ii])(;W[hi];C[h]))", {
    onNodeCreated({ node }) {
      nodes.push(JSON.parse(JSON.stringify(node)));
    },
  });

  expect(nodes).toStrictEqual([
    {
      children: [],
      data: { B: ["hh"] },
      id: 0,
      parentId: null,
    },
    {
      children: [],
      data: { W: ["ii"] },
      id: 1,
      parentId: 0,
    },
    {
      children: [],
      data: { W: ["hi"] },
      id: 2,
      parentId: 0,
    },
    {
      children: [],
      data: { C: ["h"] },
      id: 3,
      parentId: 2,
    },
  ]);
});

test("should convert lower case properties", () => {
  expect(
    getJSON(
      sgf.parse("(;CoPyright[hello](;White[ii])(;White[hi]Comment[h]))")[0],
    ),
  ).toStrictEqual(
    getJSON({
      data: { CP: ["hello"] },
      children: [
        {
          data: { W: ["ii"] },
          children: [],
        },
        {
          data: { W: ["hi"], C: ["h"] },
          children: [],
        },
      ],
    }),
  );
});

test("should parse a relatively complex file", () => {
  let trees = sgf.parseFile(path.resolve(__dirname, "sgf/complex.sgf"));

  expect(trees.length).toBe(1);
});

test("should be able to parse nodes outside a game", () => {
  let trees1 = sgf.parse(";B[hh];W[ii]");
  let trees2 = sgf.parse("(;B[hh];W[ii])");

  expect(trees1).toStrictEqual(trees2);
});

test("should be able to correctly parse a game that misses initial ;", () => {
  let trees1 = sgf.parse("B[hh];W[ii]");
  let trees2 = sgf.parse("(B[hh];W[ii])");
  let trees3 = sgf.parse("(;B[hh];W[ii])");

  expect(trees1).toStrictEqual(trees3);
  expect(trees2).toStrictEqual(trees3);
});

test("should ignore empty variations", () => {
  expect(
    getJSON(sgf.parse("(;B[hh]()(;W[ii])()(;W[hi]C[h]))")[0]),
  ).toStrictEqual(
    getJSON({
      data: { B: ["hh"] },
      children: [
        {
          data: { W: ["ii"] },
          children: [],
        },
        {
          data: { W: ["hi"], C: ["h"] },
          children: [],
        },
      ],
    }),
  );
});

const languageMap: Record<string, string> = {
  chinese: "围棋",
  japanese: "囲碁",
  korean: "바둑",
};

for (let language in languageMap) {
  test("should be able to decode non-UTF-8 text nodes", () => {
    expect(
      sgf.parseFile(path.resolve(__dirname, `sgf/${language}.sgf`))[0]
        .children[0].children[0].data.C?.[0],
    ).toBe(
      `${languageMap[language]} is fun`,
    );
  });
}

test("should be able to go back and re-parse attributes set before CA", () => {
  let gameTrees = sgf.parseFile(path.resolve(__dirname, "sgf/chinese.sgf"));

  expect(gameTrees[0].data.PW?.[0]).toBe("柯洁");
  expect(gameTrees[0].data.PB?.[0]).toBe("古力");
});

test("should ignore unknown encodings", () => {
  expect(
    sgf.parseFile(path.resolve(__dirname, "sgf/japanese_bad.sgf"))[0]
      .children[0].children[0].data.C?.[0],
  ).not.toBe(
    `${languageMap["japanese"]} is fun`,
  );
});

test("should ignore BOM markers", () => {
  expect(() => {
    sgf.parseFile(path.resolve(__dirname, "sgf/utf8bom.sgf"));
  }).not.toThrow();
});

test("should parse a UTF-16 LE file correctly", () => {
  expect(() => {
    sgf.parseFile(path.resolve(__dirname, "sgf/utf16le.sgf"));
  }).not.toThrow();
});

test("should detect encoding automatically", () => {
  expect(
    sgf
      .parseFile(path.resolve(__dirname, "sgf/no-ca.sgf"))[0]
      .data.C?.[0],
  ).toMatch(/^【第三型】/);
});
