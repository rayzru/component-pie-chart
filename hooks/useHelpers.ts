import { Color, Colors, ExtendedData, zIndexType } from '../types';

function useHelpers(data: ExtendedData[], initialPerc: number = 0) {
  
  const getSum = (index: number): number => {
    if (index === data.length - 1) return 100

    return data.reduce((acc, item, i) => i <= index ? acc += item.value : acc, 0)
  }

  const getAngle = (index: number): number => {
    return (getSum(index) + initialPerc) * 3.6
  }

  const getZIndex = (index: number): zIndexType => {
    if (data[0].value === 0 && index !== 0 && data[index].value !== 0) return -1
    return 'inherit'
  }

  const getDataIndexByColor = (color: Color): number => {
    return data.findIndex(el => color === el.color)
  }

  const getFreeColor = (): Color => Colors.filter(e => getDataIndexByColor(e) === -1)[0]

  const getNextIndex = (index: number): number => {
    const _isLastElement = index === data.length - 1

    let curIndex = index + 1
    let nextIndex = 100

    if (_isLastElement) curIndex = 0

    function findNextIndex() {
      for (let i = curIndex; i <= data.length - 1; i++) {
        if (!data[i].is_valid) {
          nextIndex = i
          break;
        }
      }
    }

    findNextIndex()

    if (nextIndex === 100) {
      curIndex = 0
      findNextIndex()
    }

    return nextIndex
  }

  const getPrimaryColor = (index: number): Color => {
    if (data[index].value === 0) return data[index].color

    return data[getNextIndex(index)].color
  }

  const getSecondaryColor = (index: number): Color | '#E8E9ED' => {
    return data[index].value === 0 ? "#E8E9ED" : data[index].color
  }

  const getLineColor = (index: number): Color | 'transparent' => {
    return data[index].value !== 0 ? 'transparent' : getPrimaryColor(index)
  }

  return {
    getFreeColor,
    getSum,
    getAngle,
    getZIndex,
    getDataIndexByColor,
    getNextIndex,
    getPrimaryColor,
    getSecondaryColor,
    getLineColor
  }
}

export default useHelpers