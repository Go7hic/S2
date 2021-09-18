import { ReloadOutlined } from '@ant-design/icons';
import { Button, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { isEmpty } from 'lodash';
import cx from 'classnames';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  BeforeCapture,
  DragDropContext,
  DropResult,
} from 'react-beautiful-dnd';
import { DroppableType, FieldType } from '../constant';
import { Dimension } from '../dimension';
import { SwitchResult, SwitchState } from '../interface';
import {
  checkItem,
  generateSwitchResult,
  getMainLayoutClassName,
  getNonEmptyFieldCount,
  getSwitcherClassName,
  moveItem,
  showDimensionCrossRows,
} from '../util';
import { i18n } from '@/common/i18n';
import './index.less';

const CLASS_NAME_PREFIX = 'content';
export interface SwitcherContentRef {
  getResult: () => SwitchResult;
}

export const SwitcherContent = forwardRef((props: SwitchState, ref) => {
  const [state, setState] = useState<SwitchState>(props);
  const [expandDerivedValues, setExpandDerivedValues] = useState(true);
  const [draggingItemId, setDraggingItemId] = useState<string>();

  const nonEmptyCount = getNonEmptyFieldCount(props);

  const onUpdateExpandDerivedValues = (event: CheckboxChangeEvent) => {
    setExpandDerivedValues(event.target.checked);
  };

  const onBeforeDragStart = (initial: BeforeCapture) => {
    setDraggingItemId(initial.draggableId);
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    // reset dragging item id
    setDraggingItemId(null);

    // cancelled or drop to where can't drop
    if (!destination) {
      return;
    }
    // don't change position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedState = moveItem(
      state[source.droppableId],
      state[destination.droppableId],
      source,
      destination,
    );
    setState({ ...state, ...updatedState });
  };

  const onReset = () => {
    setState(props);
  };

  useImperativeHandle(
    ref,
    () => ({
      getResult() {
        return generateSwitchResult(state);
      },
    }),
    [state],
  );

  const onVisibleItemChange = (
    checked: boolean,
    fieldType: FieldType,
    id: string,
    derivedId?: string,
  ) => {
    const updatedState = checkItem(state[fieldType], checked, id, derivedId);
    setState({
      ...state,
      [fieldType]: updatedState,
    });
  };

  return (
    <DragDropContext onBeforeCapture={onBeforeDragStart} onDragEnd={onDragEnd}>
      <div className={getSwitcherClassName(CLASS_NAME_PREFIX)}>
        <header className={getSwitcherClassName(CLASS_NAME_PREFIX, 'header')}>
          {i18n('行列切换')}
        </header>
        <main
          className={cx(
            getSwitcherClassName(CLASS_NAME_PREFIX, 'main'),
            getMainLayoutClassName(nonEmptyCount),
          )}
        >
          {[FieldType.Rows, FieldType.Cols].map(
            (type) =>
              isEmpty(props[type]) || (
                <Dimension
                  droppableType={DroppableType.Dimension}
                  fieldType={type}
                  data={state[type]}
                  crossRows={showDimensionCrossRows(nonEmptyCount)}
                />
              ),
          )}

          {isEmpty(props.values) || (
            <Dimension
              crossRows={true}
              droppableType={DroppableType.Measure}
              fieldType={FieldType.Values}
              data={state.values}
              draggingItemId={draggingItemId}
              expandDerivedValues={expandDerivedValues}
              onVisibleItemChange={onVisibleItemChange}
              option={
                <div
                  className={getSwitcherClassName(
                    CLASS_NAME_PREFIX,
                    'dimension-option',
                  )}
                >
                  <Checkbox
                    checked={expandDerivedValues}
                    onChange={onUpdateExpandDerivedValues}
                  />
                  <span className="description">{i18n('展开同环比')}</span>
                </div>
              }
            />
          )}
        </main>
        <footer>
          <Button
            type={'text'}
            icon={<ReloadOutlined />}
            className={getSwitcherClassName(CLASS_NAME_PREFIX, 'reset-button')}
            onClick={onReset}
          >
            {i18n('恢复默认')}
          </Button>
        </footer>
      </div>
    </DragDropContext>
  );
});

SwitcherContent.displayName = 'SwitcherContent';
SwitcherContent.defaultProps = {
  rows: [],
  cols: [],
  values: [],
};