import { concat, isEmpty } from 'lodash';
import { InteractionStateName, InterceptType } from '@/common/constant';
import { S2CellType, MultiClickParams } from '@/common/interface';
import { Node } from '@/index';
import { mergeCellInfo } from '@/utils/tooltip';

export const handleRowColClick = ({
  event,
  spreadsheet,
  isTreeRowClick,
  isMultiSelection,
}: MultiClickParams) => {
  event.stopPropagation();

  const { interaction } = spreadsheet;
  if (interaction.hasIntercepts([InterceptType.CLICK])) {
    return;
  }

  const lastState = interaction.getState();
  const cell = spreadsheet.getCell(event.target);
  const meta = cell.getMeta() as Node;

  if (interaction.isSelectedCell(cell)) {
    interaction.reset();
    return;
  }

  if (meta.x !== undefined) {
    interaction.addIntercepts([InterceptType.HOVER]);
    // 树状结构的行头点击不需要遍历当前行头的所有子节点，因为只会有一级
    let leafNodes = isTreeRowClick
      ? Node.getAllLeavesOfNode(meta).filter(
          (node) => node.rowIndex === meta.rowIndex,
        )
      : Node.getAllChildrenNode(meta);
    let selectedCells: S2CellType[] = [cell];

    if (isMultiSelection && interaction.isSelectedState()) {
      selectedCells = isEmpty(lastState?.cells)
        ? selectedCells
        : concat(lastState?.cells, selectedCells);
      leafNodes = isEmpty(lastState?.nodes)
        ? leafNodes
        : concat(lastState?.nodes, leafNodes);
    }

    // 兼容行列多选
    // Set the header cells (colCell or RowCell)  selected information and update the dataCell state.
    interaction.changeState({
      cells: selectedCells,
      nodes: leafNodes,
      stateName: InteractionStateName.SELECTED,
    });

    // Update the interaction state of all the selected cells:  header cells(colCell or RowCell) and dataCells belong to them.
    interaction.updateCells(selectedCells);

    if (!isTreeRowClick) {
      leafNodes.forEach((node) => {
        node?.belongsCell?.updateByState(
          InteractionStateName.SELECTED,
          node.belongsCell,
        );
      });
    }

    const cellInfos = interaction.isSelectedState()
      ? mergeCellInfo(interaction.getActiveCells())
      : [];

    spreadsheet.showTooltipWithInfo(event, cellInfos, {
      showSingleTips: true,
    });
  }
};