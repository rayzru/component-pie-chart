import { AnswerStatusType, Color, Colors, Coordinates, ExtendedData, MARKER_STATUS_MODE, ModeType, PieChartData, PieChartDataType, RectCoordsType, TypeType } from '../types';

export const getSumValue = (array: PieChartDataType[]): number => {
    return array.reduce((acc, d) => acc+= d.value, 0)
}

export const getFillValue = (index: number, length: number): number => {
    let result = Math.round(100 / length)
    if (length === 3 && index === 1) result += 1
    if (length === 6 && [0, 5].includes(index)) result -= 1
    return result
}

export const getValueToPerc = (value: number, type: TypeType, sum:number): number => {
    let result: number = value
    if (type === 'degrees') result = Math.round(value / 3.6)
    if (type === 'pieces') result = Math.round(value * 100 / sum)


    return result
}

export const getPercToValue = (value: number, type: TypeType, sum:number): number => {
    let result: number = value
    if (type === 'degrees') result = Math.round(value * 3.6)
    if (type === 'pieces') result = Math.round(value * sum / 100)

    return result
}

export const getIsValid = (item: PieChartDataType, answer_status?: AnswerStatusType, statusMode?: MARKER_STATUS_MODE) => {
    if (statusMode === MARKER_STATUS_MODE.EVERYTHING_IS_CORRECT) return true
    if (statusMode === MARKER_STATUS_MODE.NORMAL || !answer_status) return null
    if (statusMode === MARKER_STATUS_MODE.CORRECT_ONLY) return answer_status[item.slug] ? true : null

    return answer_status[item.slug] !== undefined ? answer_status[item.slug] : null
}

export const buildExtendData = (
    user_answer: PieChartDataType[] = [{value: 0, slug: 'empty_pie'}], 
    mode: ModeType, 
    type: TypeType,
    answer_status?: AnswerStatusType,
    statusMode?: MARKER_STATUS_MODE,
    answer?: PieChartDataType[],
    sum: number = 0
): ExtendedData[] => {
    const initData: PieChartDataType[] = statusMode && statusMode === MARKER_STATUS_MODE.EVERYTHING_IS_CORRECT && answer
        ? [...answer]
        : [...user_answer]
    const _initData: PieChartDataType[] = initData.map(item => ({
        ...item,
        value: getValueToPerc(item.value, type, sum)
    }))
    
    let prevInitData: PieChartDataType[] = []
    
    if (mode === 'simple') {
        const isStart = _initData.length === 0
        prevInitData = isStart 
            ? [{value: 100, slug: 'start_pie'}, {value: 0, slug: 'slug-0'}] 
            : [{ value: 100 - _initData[0].value, slug: 'start_pie' }, ..._initData]
    }

    if (mode === 'create') {
        const isStart = _initData.length === 0
        prevInitData = isStart ? [{value: 100, slug: 'slug-0'}] : [..._initData]
    }

    if (mode === 'fill') {
        const isStart = _initData.filter(i => i.value === 0).length === _initData.length
        prevInitData = _initData.map((item, index) => ({
            ...item,
            value: isStart ? getFillValue(index, _initData.length) : item.value
        }))
    }

    const colors: Color[] = prevInitData.reduce((acc, item) => {
        if (item.color) acc.push(item.color)

        return acc
    }, [] as Color[])
    
    const getFreeColor = (): Color => {
        let resultColor: Color = Colors.find(color => !colors.includes(color)) as Color
        colors.push(resultColor)
        return resultColor
    }


    let resultData: ExtendedData[] = prevInitData.map(
        (item: PieChartDataType, index: number) => ({
            index,
            slug: item.slug,
            value: item.value,
            color: item.color || getFreeColor(),
            label: item.label || '',
            is_active: false,
            is_valid: (mode === 'simple' && index === 0) ? null : getIsValid(item, answer_status, statusMode),
            is_init_color: !!item.color,
        })
    );

    if (mode === 'create' && resultData.length > 1) resultData = [
        ...resultData.slice(1), 
        {...resultData[0]}
    ]

    const nextIsZero = (index: number, array: any[]): number => (array.length && array.length > index + 1)
        ? array[index + 1].value === 0 ? 1 + nextIsZero(index + 1, array) : 0 : 0;
    const prevIsZero = (index: number, array: any[]) => (array.length && index > 0) ? array[index - 1].value === 0 : false;


    // In order SVG elements visibility order is reversed to the DOM
    const reversed = resultData.reverse();

    resultData = reversed.map((item: ExtendedData, index: number) => {
        let _stack = 0;
        _stack = item.value === 0 && prevIsZero(index, resultData) ? -1 : (item.value === 0) ? nextIsZero(index, resultData) : 0;
        return { ...item, stack: _stack }
    })

    return resultData.reverse();
}

export const buildData = (data: ExtendedData[], mode: ModeType, type: TypeType, sum: number): PieChartDataType[] => {
    let resultData: PieChartDataType[] = data
        .sort((a, b) => a.index - b.index)
        .map(item => ({
            slug: item.slug,
            value: getPercToValue(item.value, type, sum),
            ...(item.label.length > 0) && {label: item.label},
            ...(item.is_init_color) && {color: item.color}
        }))

    if (mode === 'simple') resultData = resultData.slice(1)

    return resultData
}

export const getAngle = (p1: Coordinates, p2: Coordinates): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const radAngle = Math.atan2(dy, dx);
    const northAngle = radAngle * 180 / Math.PI + 90;
    return (dx < 0 && dy < 0) ? 360 + northAngle : northAngle;
};


export const isNextAngleSame = (id: string, arr: PieChartData<number>[]) => {
    const index = arr.findIndex(el => el.id === id);
    if (!arr.length || arr.length - 1 === index) return false;
    return arr[index].value === arr[index + 1].value && arr[index].value === 0;
};


export const valuesSum = (arr: PieChartData<number>[]): number => arr.reduce((sum: number, item: PieChartData<number>) => (sum += item.value), 0);

export const shift100 = (delta: number, angle: number) => {

    if (delta === 0) return angle;
    if (angle - delta < 0) {
        return 100 - delta + angle;
    } else if (delta + angle >= 100) {
        return angle - delta;
    }

    return angle - delta;
}

export function getCoordinatesForPercent(percent: number) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
}

export const randomString = (length: number = 8) => [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('');

export const pieDataExpander = (dt: any[], radius: number, radiusDelta: number = 4) => {

    if (dt.length === 0) return [];

    const reducedData = dt
        .reduce((r: any[], v: PieChartData<number>, i) => ([
            ...r,
            {
                ...v,
                startAngle: i ? r[i - 1].endAngle : 0,
                endAngle: i ? r[i - 1].endAngle + perc2pie(v.value) : perc2pie(v.value),
                innerRadius: 0,
                outerRadius: radius
            }
        ]), [] as any[])

    return reducedData.map((d: any, i: number, arr: any[]) => {
        const avgAngle = averageRadAngle(d.startAngle, d.endAngle);
        return {
            ...d,
            min: d.startAngle,
            max: (i === arr.length - 1) ? deg2rad(360) : arr[i + 1].endAngle,
            avg: {
                angle: avgAngle,
                coords: getCoordinates(radius, avgAngle),
                coords2: getCoordinates(radius + radiusDelta, avgAngle),
            }
        }
    });
}

export const rad2deg = (radians: number): number => radians * (180 / Math.PI);
export const rad2perc = (radians: number): number => radians * 15.91549430919;
export const deg2rad = (degrees: number): number => degrees * Math.PI / 180;
export const deg2perc = (degrees: number | unknown): number => degrees as number * 0.27777777777778595;

export const perc2deg = (percent: number | unknown): number => percent as number / 0.27777777777778595;

export const perc2rad = (percent: number): number => (180 / Math.PI) / 100 * percent;
export const perc2rad2 = (percent: number): number => percent * 0.062831853071796;

export const perc2pie = (percent: number): number => (Math.PI * 2) / 100 * percent;

const averageRadAngle = (a: number, b: number) => (a + b) / 2;

export const averageAngle = (a: number, b: number) => {
    a = a % 360;
    b = b % 360;

    let angleSum = a + b;
    if (angleSum > 360 && angleSum < 540) {
        angleSum = angleSum % 180;
    }
    return angleSum / 2;
}

export const getCoordinates = (radius: number, angle: number): Coordinates => {
    const targetAngle = deg2rad(rad2deg(angle) - 90)
    return {
        x: radius * Math.cos(targetAngle),
        y: radius * Math.sin(targetAngle)
    }
};

export const PieLabelSVG = "M42.8 27.4c-1.6-3.8-5.5-8.3-9.1-11.8-3.5-3.6-6.8-6.3-7.1-6.6-.2-.2-.4-.2-.6-.2-.2 0-.4.1-.6.2-.3.3-3.5 3-7.1 6.5-3.5 3.5-7.4 8-9.1 11.8C7.8 30 7 33 7 36.2c0 10.5 8.5 19 19 19s19-8.5 19-19c0-3.2-.8-6.2-2.2-8.8z";


export const getBoundingClientRect = (element: any): RectCoordsType => {
    const { top, right, bottom, left, width, height, x, y } = element.getBoundingClientRect()
    return { top, right, bottom, left, width, height, x, y }
}

export const getMiddlePoint = (x: number, y: number, width: number, height: number): Coordinates => (
    { x: x + width / 2, y: y + height / 2 }
)

export function throttle(func: Function, limit: number): Function {
    let inThrottle: boolean;

    return function (this: any): any {
        const args = arguments;
        const context = this;

        if (!inThrottle) {
            inThrottle = true;
            func.apply(context, args);
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

export function debounce<Params extends any[]>(
    func: (...args: Params) => any,
    timeout: number,
): (...args: Params) => void {
    let timer: NodeJS.Timeout
    return (...args: Params) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func(...args)
        }, timeout)
    }
}
