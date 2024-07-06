export function isEqual(array1: any[], array2: any[]) {
  if (array1.length === array2.length) {
    return array1.every(element => {
      if (array2.includes(element)) {
        return true;
      }

      return false;
    });
  }

  return false;
}

export function definedUnique(value: any, index: number, array: any[]) {
  return  value !== undefined && value !== null && array.indexOf(value) === index;
}

export function arrayNull(arr: any[]) {
  return !Array.isArray(arr) || arr.length == 0
}

export function mergeDiffById(oldArr: any[], newArr: any[], extractId: (i: any) => string): any[] {
  const oldArrIds = oldArr.map(i => extractId(i))
  const newArrIds = newArr.map(i => extractId(i))

  // Remove items from old that are not in new
  oldArr = oldArr.filter(oi => newArrIds.includes(extractId(oi)));

  // Add items to old that are in new but not in old
  newArr.forEach(ni => {
    if (!oldArrIds.includes(extractId(ni))) {
      oldArr.push(ni);
    }
  });

  return oldArr;
}


export function mergeDiff(oldArr: any[], newArr: any[], equal: (oItem: any, newItem: any) => boolean): any[] {
  
  // Remove items from old that are not in new
  oldArr = oldArr.filter(o => !Boolean(newArr.find(n => equal(o, n))));

  // Add items to old that are in new but not in old
  newArr.forEach(n => {
    if (!Boolean(oldArr.find(o => equal(o, n)))) {
      oldArr.push(n);
    }
  });

  return oldArr;
}

export function updateArrayItem (arr: any[], isTargetItem: (i: any) => boolean, data: any) {
  let tmpItems: any[] = [...arr];
  let editedIdx = tmpItems.findLastIndex((i) => isTargetItem(i))
  if(editedIdx) {
    tmpItems[editedIdx] = {...tmpItems[editedIdx], ...data}
  }
  return [...tmpItems]
}