# Component Pie Chart

| Property | Description | Type | Default | Required |
| -- | -- | -- | -- | -- |
| answer | Правильный ответ | [**PieChartDataType[]**](#PieChartDataType) | | |
| answer_status | Статус ответов | { [key: string]: boolean } | | |
| options | Описание опций компонента | [**OptionsType**](#OptionsType) | | |
| setAnswer | Функция для передачи данных | (answer: PieChartDataType[]) => void | | **true** | 
| readOnly | Флаг для отключение взаимодействия | boolean | false | |
| statusMode | Вид показываемой валидации | [MARKER_STATUS_MODE](#используемые-типы) | NORMAL | |
| user_answer | Ответ пользователя | [**PieChartDataType[]**](#PieChartDataType) | | |
| selectComponent | Компонент для селекта | [SelectComponentProps](#используемые-типы) | | |

## PieChartDataType
| Property | Description | Type | Default | Required |
| -- | -- | -- | -- | -- |
| value | Значение | number | | **true** |
| slug | Уникальная подпись для валидации | string | | **true** |
| label | Подпись, показываемая в легенде | string | | |
| color | Передаваемый цвет | [Color](#используемые-типы) | | |

## OptionsType

Все поля не обязательные

| Property | Description | Type | Default |
| -- | -- | -- | -- |
| title | Заголовок | string | |
| selectOptions | Список возможных значений для селекта в легенде | string[] | |
| mode | Вид задачи | [**ModeType**](#ModeType) | 'simple' | |
| type | Тип передаваемых данных | [**TypeType**](#TypeType) | 'perc' | |
| piecesSum | Сумма значений, для `type === 'pieces'` | number | |
| has_labels | Нужно ли показывать капли | boolean | |
| has_legends | Нужно ли показывать легенду | boolean | |


### ModeType
`simple` - простое заполнение одного сектора  
`fill` - заполнение только диаграммы. Обязательно передавать какое-то значение для user_answer, чтобы из них построить легенды и заполнить диаграммы. Н-р: `user_answer: [{value: 0, label: 'First'}, {value: 0, label: Second}]`. Построит график из 2-х полей по 50%  
`create` - создание диаграммы, совместно с выбором легенды. Обязательно передавать **selectComponent**

### TypeType
`perc` - проценты  
`degrees` - градусы  
`pieces` - штуки

### Используемые типы
```typescript
type Color = '#3289F3' | '#FFCC00' | '#05B545' | '#F59422' | '#7527D8' | '#DD3030';

enum MARKER_STATUS_MODE {
    NORMAL = 'normal',
    CORRECT_ONLY = 'correct-only',
    WITHOUT_SKIPPED = 'without-skipped',
    FULL_STATUS = 'full-status',
    EVERYTHING_IS_CORRECT = 'everything-is-correct'
}

type SelectComponentProps = React.FC<{
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
```