import * as sgf from "@sabaki/sgf";
import { expect, test } from "vitest";

// ref. https://github.com/SabakiHQ/sgf/blob/master/tests/tokenize.test.js

test("should track source position correctly", () => {
  const contents = "(;B[aa]SZ[19]\n;AB[cc]\n[dd:ee])";
  const len = contents.length - 1;

  expect(sgf.tokenize(contents)).toStrictEqual([
    {
      type: "parenthesis",
      value: "(",
      row: 0,
      col: 0,
      pos: 0,
      progress: 0 / len,
    },
    { type: "semicolon", value: ";", row: 0, col: 1, pos: 1, progress: 1 / len },
    { type: "prop_ident", value: "B", row: 0, col: 2, pos: 2, progress: 2 / len },
    {
      type: "c_value_type",
      value: "[aa]",
      row: 0,
      col: 3,
      pos: 3,
      progress: 3 / len,
    },
    {
      type: "prop_ident",
      value: "SZ",
      row: 0,
      col: 7,
      pos: 7,
      progress: 7 / len,
    },
    {
      type: "c_value_type",
      value: "[19]",
      row: 0,
      col: 9,
      pos: 9,
      progress: 9 / len,
    },
    {
      type: "semicolon",
      value: ";",
      row: 1,
      col: 0,
      pos: 14,
      progress: 14 / len,
    },
    {
      type: "prop_ident",
      value: "AB",
      row: 1,
      col: 1,
      pos: 15,
      progress: 15 / len,
    },
    {
      type: "c_value_type",
      value: "[cc]",
      row: 1,
      col: 3,
      pos: 17,
      progress: 17 / len,
    },
    {
      type: "c_value_type",
      value: "[dd:ee]",
      row: 2,
      col: 0,
      pos: 22,
      progress: 22 / len,
    },
    {
      type: "parenthesis",
      value: ")",
      row: 2,
      col: 7,
      pos: 29,
      progress: 29 / len,
    },
  ]);
});

test("should take escaping values into account", () => {
  let contents = "(;C[hello\\]world];C[hello\\\\];C[hello])";
  let len = contents.length - 1;

  expect(sgf.tokenize(contents)).toStrictEqual([
    {
      type: "parenthesis",
      value: "(",
      row: 0,
      col: 0,
      pos: 0,
      progress: 0 / len,
    },
    { type: "semicolon", value: ";", row: 0, col: 1, pos: 1, progress: 1 / len },
    { type: "prop_ident", value: "C", row: 0, col: 2, pos: 2, progress: 2 / len },
    {
      type: "c_value_type",
      value: "[hello\\]world]",
      row: 0,
      col: 3,
      pos: 3,
      progress: 3 / len,
    },
    {
      type: "semicolon",
      value: ";",
      row: 0,
      col: 17,
      pos: 17,
      progress: 17 / len,
    },
    {
      type: "prop_ident",
      value: "C",
      row: 0,
      col: 18,
      pos: 18,
      progress: 18 / len,
    },
    {
      type: "c_value_type",
      value: "[hello\\\\]",
      row: 0,
      col: 19,
      pos: 19,
      progress: 19 / len,
    },
    {
      type: "semicolon",
      value: ";",
      row: 0,
      col: 28,
      pos: 28,
      progress: 28 / len,
    },
    {
      type: "prop_ident",
      value: "C",
      row: 0,
      col: 29,
      pos: 29,
      progress: 29 / len,
    },
    {
      type: "c_value_type",
      value: "[hello]",
      row: 0,
      col: 30,
      pos: 30,
      progress: 30 / len,
    },
    {
      type: "parenthesis",
      value: ")",
      row: 0,
      col: 37,
      pos: 37,
      progress: 37 / len,
    },
  ]);

  contents = "(;C[\\];B[aa];W[bb])";
  len = contents.length - 1;

  expect(sgf.tokenize(contents)).toStrictEqual([
    {
      type: "parenthesis",
      value: "(",
      row: 0,
      col: 0,
      pos: 0,
      progress: 0 / len,
    },
    { type: "semicolon", value: ";", row: 0, col: 1, pos: 1, progress: 1 / len },
    { type: "prop_ident", value: "C", row: 0, col: 2, pos: 2, progress: 2 / len },
    {
      type: "c_value_type",
      value: "[\\];B[aa]",
      row: 0,
      col: 3,
      pos: 3,
      progress: 3 / len,
    },
    {
      type: "semicolon",
      value: ";",
      row: 0,
      col: 12,
      pos: 12,
      progress: 12 / len,
    },
    {
      type: "prop_ident",
      value: "W",
      row: 0,
      col: 13,
      pos: 13,
      progress: 13 / len,
    },
    {
      type: "c_value_type",
      value: "[bb]",
      row: 0,
      col: 14,
      pos: 14,
      progress: 14 / len,
    },
    {
      type: "parenthesis",
      value: ")",
      row: 0,
      col: 18,
      pos: 18,
      progress: 18 / len,
    },
  ]);
});

test("should allow lower case properties", () => {
  const contents = "(;CoPyright[blah])";
  const len = contents.length - 1;

  expect(sgf.tokenize(contents)).toStrictEqual([
    {
      type: "parenthesis",
      value: "(",
      row: 0,
      col: 0,
      pos: 0,
      progress: 0 / len,
    },
    { type: "semicolon", value: ";", row: 0, col: 1, pos: 1, progress: 1 / len },
    {
      type: "prop_ident",
      value: "CoPyright",
      row: 0,
      col: 2,
      pos: 2,
      progress: 2 / len,
    },
    {
      type: "c_value_type",
      value: "[blah]",
      row: 0,
      col: 11,
      pos: 11,
      progress: 11 / len,
    },
    {
      type: "parenthesis",
      value: ")",
      row: 0,
      col: 17,
      pos: 17,
      progress: 17 / len,
    },
  ]);
});

test("should take new lines inside token values into account", () => {
  const contents = "(;C[bl\nah])";
  const len = contents.length - 1;

  expect(sgf.tokenize(contents)).toStrictEqual([
    {
      type: "parenthesis",
      value: "(",
      row: 0,
      col: 0,
      pos: 0,
      progress: 0 / len,
    },
    { type: "semicolon", value: ";", row: 0, col: 1, pos: 1, progress: 1 / len },
    { type: "prop_ident", value: "C", row: 0, col: 2, pos: 2, progress: 2 / len },
    {
      type: "c_value_type",
      value: "[bl\nah]",
      row: 0,
      col: 3,
      pos: 3,
      progress: 3 / len,
    },
    {
      type: "parenthesis",
      value: ")",
      row: 1,
      col: 3,
      pos: 10,
      progress: 10 / len,
    },
  ]);
});

test("should return invalid tokens", () => {
  const contents = "(;C[hi]%[invalid])";
  const len = contents.length - 1;

  expect(sgf.tokenize(contents)).toStrictEqual([
    {
      type: "parenthesis",
      value: "(",
      row: 0,
      col: 0,
      pos: 0,
      progress: 0 / len,
    },
    {
      type: "semicolon",
      value: ";",
      row: 0,
      col: 1,
      pos: 1,
      progress: 1 / len,
    },
    {
      type: "prop_ident",
      value: "C",
      row: 0,
      col: 2,
      pos: 2,
      progress: 2 / len,
    },
    {
      type: "c_value_type",
      value: "[hi]",
      row: 0,
      col: 3,
      pos: 3,
      progress: 3 / len,
    },
    {
      type: "invalid",
      value: "%",
      row: 0,
      col: 7,
      pos: 7,
      progress: 7 / len,
    },
    {
      type: "c_value_type",
      value: "[invalid]",
      row: 0,
      col: 8,
      pos: 8,
      progress: 8 / len,
    },
    {
      type: "parenthesis",
      value: ")",
      row: 0,
      col: 17,
      pos: 17,
      progress: 17 / len,
    },
  ]);
});
