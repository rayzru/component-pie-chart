// Predefined colors
export const Colors: Color[] = ['#3289F3', '#FFCC00', '#05B545', '#F59422', '#7527D8', '#DD3030'];
export type Color = '#3289F3' | '#FFCC00' | '#05B545' | '#F59422' | '#7527D8' | '#DD3030';

export enum MARKER_STATUS_MODE {
    NORMAL = 'normal',
    CORRECT_ONLY = 'correct-only',
    WITHOUT_SKIPPED = 'without-skipped',
    FULL_STATUS = 'full-status',
    EVERYTHING_IS_CORRECT = 'everything-is-correct'
}

export type ExtendedData = {
    slug: string;
    value: number;
    color: Color;
    index: number;
    label: string;
    is_active: boolean;
    is_valid: boolean | null;
    is_init_color: boolean;
    stack?: number;
}

export type zIndexType = -1 | 'inherit'

export type PieChartDataType = {
    value: number;
    slug: string;
    label?: string;
    color?: Color;
}

export type AnswerStatusType = { [key: string]: boolean }

export type ModeType = 'simple' | 'fill' | 'create'
export type TypeType = 'perc' | 'pieces' | 'degrees'

export type ComponentChartProps = {
    answer?: PieChartDataType[];
    answer_status?: AnswerStatusType;
    options?: {
        title?: string;
        step?: number;
        selectOptions?: string[];
        mode?: ModeType;
        type?: TypeType;
        piecesSum?: number;
    };
    setAnswer: (answer: PieChartDataType[]) => void
    readOnly?: boolean;
    statusMode?: MARKER_STATUS_MODE;
    user_answer?: PieChartDataType[];
    selectComponent?: React.FC<{
        className: string;
        options: {
            choices: string[]
            placeholder?: string;
        }
        readOnly: boolean;
        userAnswer: string;
        theme: 'normal' | 'correct' | 'incorrect';
        setAnswer: (name: string) => void;
    }>
};

////////////////////////////////////////////////

export interface Coordinates {
    x: number;
    y: number;
}

export type ComponentPieProps = {
    radius: number;
    start: number;
    end: number;
    max?: number;
    color?: Color;
};

export type ComponentPieToArcProps = {
    startAngle: number;
    endAngle: number;
};

export type PieChartOptionsType = {
    title?: string;
    width?: number;
    height?: number;
    step?: number;
    maxItems?: number;
}

export type ComponentPieChartProps<T> = {
    options: PieChartOptionsType;
    selectOptions?: string[];
    data?: PieChartData<T>[];
    readOnly?: boolean;
    onChange?: () => void;
};

export type ComponentPieControlProps = {
    value?: number;
    maxValue?: number;
    onMouseOver?: () => void;
    onDragStart?: () => void;
};

export type ComponentPieLabelProps<T> = {
    value: T;
    prefix?: string;
    postfix?: string;
    color?: Color;
};

export type ComponentPieLabelCoordProps = {
    x: number;
    y: number;
    avg: number;
    start: number;
    end: number;
};


export interface PieChartData<T = number> {
    value: T;
    label?: string;
    id?: string;
    color?: Color;
    initial?: boolean;
};

export interface PieChartDataExpanded<T = number> extends PieChartData {
    startAngle: number;
    endAngle: number;
    innerRadius: number;
    outerRadius: number;
    min: number;
    max: number;
    avg?: {
        angle: number;
        coords: Coordinates;
        coords2?: Coordinates;
    }
}

export type RectCoordsType = {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
    x: number;
    y: number;
}