import * as sgf from "@sabaki/sgf";
import { describe, expect, test } from "vitest";

// ref. https://github.com/SabakiHQ/sgf/blob/master/tests/helper.test.js

describe("parseDates", () => {
  test("should parse comma-separated dates", () => {
    expect(sgf.parseDates("1996-12-27,1997-01-03")).toStrictEqual([
      [1996, 12, 27],
      [1997, 1, 3],
    ]);
  });

  test("should be able to handle empty strings", () => {
    expect(sgf.parseDates("")).toStrictEqual([]);
  });

  test("should handle short-hand notation", () => {
    expect(sgf.parseDates("1996-05,06")).toStrictEqual([
      [1996, 5],
      [1996, 6],
    ]);
    expect(sgf.parseDates("1996-05,06-01")).toStrictEqual([
      [1996, 5],
      [1996, 6, 1],
    ]);
    expect(sgf.parseDates("1996-05,1997")).toStrictEqual([[1996, 5], [1997]]);
    expect(sgf.parseDates("1996-05-06,07,08")).toStrictEqual([
      [1996, 5, 6],
      [1996, 5, 7],
      [1996, 5, 8],
    ]);
    expect(sgf.parseDates("1996,1997")).toStrictEqual([[1996], [1997]]);
    expect(sgf.parseDates("1996-12-27,28,1997-01-03,04")).toStrictEqual([
      [1996, 12, 27],
      [1996, 12, 28],
      [1997, 1, 3],
      [1997, 1, 4],
    ]);
  });
});

describe("stringifyDates", () => {
  test("should work", () => {
    expect(
      sgf.stringifyDates([
        [1996, 5],
        [1996, 6],
      ]),
    ).toBe(
      "1996-05,06",
    );
    expect(
      sgf.stringifyDates([
        [1996, 5],
        [1996, 6, 1],
      ]),
    ).toBe(
      "1996-05,06-01",
    );
    expect(sgf.stringifyDates([[1996, 5], [1997]]), "1996-05,1997");
    expect(
      sgf.stringifyDates([
        [1996, 5, 6],
        [1996, 5, 7],
        [1996, 5, 8],
      ]),
    ).toBe(
      "1996-05-06,07,08",
    );
    expect(sgf.stringifyDates([[1996], [1997]]), "1996,1997");
    expect(
      sgf.stringifyDates([
        [1996, 12, 27],
        [1996, 12, 28],
        [1997, 1, 3],
        [1997, 1, 4],
      ]),
    ).toBe(
      "1996-12-27,28,1997-01-03,04",
    );
  });

  test("should be able to handle empty strings", () => {
    expect(sgf.stringifyDates([])).toBe("");
  });

  test("should be inverse to parseDates", () => {
    expect(
      sgf.parseDates(
        sgf.stringifyDates([
          [1996, 5],
          [1996, 6],
        ]),
      ),
    ).toStrictEqual(
      [
        [1996, 5],
        [1996, 6],
      ],
    );
    expect(
      sgf.parseDates(
        sgf.stringifyDates([
          [1996, 5, 6],
          [1996, 5, 7],
          [1996, 5, 8],
        ]),
      ),
    ).toStrictEqual(
      [
        [1996, 5, 6],
        [1996, 5, 7],
        [1996, 5, 8],
      ],
    );
    expect(sgf.parseDates(sgf.stringifyDates([[1996], [1997]]))).toStrictEqual([
      [1996],
      [1997],
    ]);
    expect(
      sgf.parseDates(
        sgf.stringifyDates([
          [1996, 12, 27],
          [1996, 12, 28],
          [1997, 1, 3],
          [1997, 1, 4],
        ]),
      ),
    ).toStrictEqual(
      [
        [1996, 12, 27],
        [1996, 12, 28],
        [1997, 1, 3],
        [1997, 1, 4],
      ],
    );

    expect(sgf.stringifyDates(sgf.parseDates("1996-05,06") ?? [])).toBe("1996-05,06");
    expect(
      sgf.stringifyDates(sgf.parseDates("1996-05-06,07,08") ?? []),
    ).toBe(
      "1996-05-06,07,08",
    );
    expect(sgf.stringifyDates(sgf.parseDates("1996,1997") ?? [])).toBe("1996,1997");
    expect(
      sgf.stringifyDates(sgf.parseDates("1996-12-27,28,1997-01-03,04") ?? []),
    ).toBe(
      "1996-12-27,28,1997-01-03,04",
    );
  });
});

describe("parseVertex", () => {
  test("should return [-1, -1] when passing string with length > 2", () => {
    expect(sgf.parseVertex("")).toStrictEqual([-1, -1]);
    expect(sgf.parseVertex("d")).toStrictEqual([-1, -1]);
    expect(sgf.parseVertex("blah")).toStrictEqual([-1, -1]);
  });
  test("should work", () => {
    expect(sgf.parseVertex("bb")).toStrictEqual([1, 1]);
    expect(sgf.parseVertex("jj")).toStrictEqual([9, 9]);
    expect(sgf.parseVertex("jf")).toStrictEqual([9, 5]);
    expect(sgf.parseVertex("fa")).toStrictEqual([5, 0]);
    expect(sgf.parseVertex("fA")).toStrictEqual([5, 26]);
    expect(sgf.parseVertex("AB")).toStrictEqual([26, 27]);
  });
  test("should be left inverse to stringifyVertex", () => {
    const tests: sgf.Types.Vertex[] = [
      [-1, -1],
      [10, 5],
      [9, 28],
      [30, 27],
      [0, 0],
    ];
    tests.forEach((test) => {
      expect(sgf.parseVertex(sgf.stringifyVertex(test))).toStrictEqual(test);
    });
  });
});

describe("stringifyVertex", () => {
  test("should return empty string when passing negative values", () => {
    expect(sgf.stringifyVertex([-4, -5])).toBe("");
    expect(sgf.stringifyVertex([-4, 5])).toBe("");
    expect(sgf.stringifyVertex([4, -5])).toBe("");
  });
  test("should return empty string when passing too big values", () => {
    expect(sgf.stringifyVertex([100, 100])).toBe("");
    expect(sgf.stringifyVertex([100, 1])).toBe("");
    expect(sgf.stringifyVertex([1, 100])).toBe("");
  });
  test("should work", () => {
    expect(sgf.stringifyVertex([1, 1])).toBe("bb");
    expect(sgf.stringifyVertex([9, 9])).toBe("jj");
    expect(sgf.stringifyVertex([9, 5])).toBe("jf");
    expect(sgf.stringifyVertex([5, 0])).toBe("fa");
    expect(sgf.stringifyVertex([5, 26])).toBe("fA");
    expect(sgf.stringifyVertex([26, 27])).toBe("AB");
  });
  test("should be left inverse to parseVertex", () => {
    const tests = ["", "df", "AB", "fA", "fa"];
    tests.forEach((test) => {
      expect(sgf.stringifyVertex(sgf.parseVertex(test))).toBe(test);
    });
  });
});

describe("parseCompressedVertices", () => {
  test("should handle points normally", () => {
    expect(sgf.parseCompressedVertices("ce")).toStrictEqual([sgf.parseVertex("ce")]);
    expect(sgf.parseCompressedVertices("aa")).toStrictEqual([sgf.parseVertex("aa")]);
    expect(sgf.parseCompressedVertices("Az")).toStrictEqual([sgf.parseVertex("Az")]);
  });
  test("should handle one point compressions", () => {
    expect(sgf.parseCompressedVertices("ce:ce")).toStrictEqual([sgf.parseVertex("ce")]);
    expect(sgf.parseCompressedVertices("aa:aa")).toStrictEqual([sgf.parseVertex("aa")]);
    expect(sgf.parseCompressedVertices("Az:Az")).toStrictEqual([sgf.parseVertex("Az")]);
  });
  test("should handle compressions", () => {
    expect(sgf.parseCompressedVertices("aa:bb")).toStrictEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
    expect(sgf.parseCompressedVertices("bb:aa")).toStrictEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });
});

describe("escapeString", () => {
  test("should escape backslashes", () => {
    expect(sgf.escapeString("hello\\world")).toBe("hello\\\\world");
  });
  test("should escape right brackets", () => {
    expect(sgf.escapeString("hello]world")).toBe("hello\\]world");
  });
  test("should not escape left brackets", () => {
    expect(sgf.escapeString("hello[world")).toBe("hello[world");
  });
});

describe("unescapeString", () => {
  test("should ignore escaped linebreaks", () => {
    expect(sgf.unescapeString("hello\\\nworld")).toBe("helloworld");
    expect(sgf.unescapeString("hello\\\rworld")).toBe("helloworld");
    expect(sgf.unescapeString("hello\\\n\rworld")).toBe("helloworld");
    expect(sgf.unescapeString("hello\\\r\nworld")).toBe("helloworld");
  });
  test("should unescape backslashes and right brackets", () => {
    expect(sgf.unescapeString("hello wor\\]ld")).toBe("hello wor]ld");
    expect(sgf.unescapeString("hello wor\\\\ld")).toBe("hello wor\\ld");
    expect(sgf.unescapeString("he\\]llo wor\\\\ld")).toBe("he]llo wor\\ld");
  });
  test("should ignore other backslashes", () => {
    expect(sgf.unescapeString("h\\e\\llo world")).toBe("hello world");
    expect(sgf.unescapeString("hello\\ world")).toBe("hello world");
  });
  test("should be left inverse to escapeString", () => {
    const texts = ["He()llo Wor\\\\[Foo;Bar]ld\\", "Hello\\! []World!"];
    texts.forEach((text) => {
      expect(sgf.unescapeString(sgf.escapeString(text))).toBe(text);
    });
  });
});
