import GameTree, { NodeObject } from "@sabaki/immutable-gametree";

const merger: (node: NodeObject, data: NodeObject["data"]) => NodeObject["data"] | null = (node, data) => {
  if (
    (node.data.B != null && data.B != null && node.data.B[0] === data.B[0])
    || (node.data.W != null && data.W != null && node.data.W[0] === data.W[0])
  ) {
    return data;
  }

  return null;
};

let id1: number;
let childId1: number;
let childId2: number;
let childId3: number;
let subChildId1: number;

const tree = new GameTree({ merger }).mutate((draft) => {
  id1 = draft.appendNode(draft.root.id, { B: ["dd"] })!;
  childId1 = draft.appendNode(id1, { W: ["dq"], MA: ["qd", "qq"] })!;
  childId2 = draft.appendNode(id1, { W: ["qd"] })!;
  childId3 = draft.appendNode(id1, { W: ["qq"] })!;
  subChildId1 = draft.appendNode(childId3, { B: ["dq"] })!;
});

export { childId1, childId2, childId3, id1, subChildId1, tree };
