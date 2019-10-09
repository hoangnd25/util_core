export default (a: any[], b: any[]): any[] => // Get the intersection of two overlapping arrays
  a.filter((value) => -1 !== b.indexOf(value));
