import { Event } from '@antv/g-canvas';
import { BaseEvent, BaseEventImplement } from '../../base-event';
import { S2Event } from '@/common/constant';

export class MergedCellsClick extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.bindDataCellClick();
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.MERGED_CELLS_CLICK, (event: Event) => {
      event.stopPropagation();
    });
  }
}
