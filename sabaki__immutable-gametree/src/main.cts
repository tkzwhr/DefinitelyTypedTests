import ImmutableGametree from "@sabaki/immutable-gametree";

let tree = new ImmutableGametree();

let newTree = tree.mutate(draft => {
    let id1 = draft.appendNode(draft.root.id, {B: ["dd"]});
    let id2 = draft.appendNode(id1 ?? 0, {W: ["dq"]});

    draft.addToProperty(id2 ?? 0, "W", "qd");
});

console.log(newTree !== tree);
// => true
console.log(tree.root.children.length);
// => 0
console.log(newTree.root.children.length);
// => 1
console.log(newTree.root.children[0].children[0].data.W);
// => ['dq', 'qd']
