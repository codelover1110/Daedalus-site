function indicatorsAndActionsExtractor(strategy){
    let rgx = /^IND|^ACT/g
    let splited = strategy.split(/[\s(){}]+|result=/)
    // console.log(splited)
    let filtered = splited.filter(function(element){
        return element.match(rgx)
    })
    return filtered
  }

  function crossOver(arr) {
    if (arr[arr.length - 1] >= 0 && arr[arr.length - 2] < 0) {
        //if (arr[arr.length - 1] < 0 && arr[arr.length - 1] > arr[arr.length - 2] && arr[arr.length - 2] < 0 && arr[arr.length - 2] > arr[arr.length - 3]) {
        return true
    } else if(arr[arr.length - 1] >= 0 && arr[arr.length - 2] >= 0 &&  arr[arr.length - 3] < 0) {
        //if (arr[arr.length - 1] < 0 && arr[arr.length - 1] > arr[arr.length - 2] && arr[arr.length - 2] < 0 && arr[arr.length - 2] > arr[arr.length - 3]) {
        return true
    }  else {
        return false
    }
}

function crossUnder(arr) {
    if (arr[arr.length - 2] >= 0 && arr[arr.length - 1] < 0) {
        //if (arr[arr.length - 1] < 0 && arr[arr.length - 1] > arr[arr.length - 2] && arr[arr.length - 2] < 0 && arr[arr.length - 2] > arr[arr.length - 3]) {
        return true
    } else if(arr[arr.length - 1] <= 0 && arr[arr.length - 2] <= 0 &&  arr[arr.length - 3] > 0) {
        //if (arr[arr.length - 1] < 0 && arr[arr.length - 1] > arr[arr.length - 2] && arr[arr.length - 2] < 0 && arr[arr.length - 2] > arr[arr.length - 3]) {
        return true
    }  else {
        return false
    }
}
//   module.exports = {
//       indicatorsAndActionsExtractor,
//       crossUnder,
//       crossOver
//   }