import intersection from "./index";

it("Gets the intersection of the two arrays", () => {
  expect(intersection(["a", "d", "c"], ["a", "b", "c"])).toEqual(["a", "c"]);
});
