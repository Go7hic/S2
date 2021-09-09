import React from 'react';
import { TooltipSummaryOptions } from '@/common/interface';
import { i18n } from '@/common/i18n';
import { TOOLTIP_PREFIX_CLS } from '@/common/constant/tooltip';

interface SummaryProps {
  summaries: TooltipSummaryOptions[];
  count: number;
}

const Summary: React.FC<SummaryProps> = React.memo((props) => {
  const { summaries = [], count = 0 } = props;

  const renderSelected = () => {
    return (
      <div className={`${TOOLTIP_PREFIX_CLS}-summary-item`}>
        <span className={`${TOOLTIP_PREFIX_CLS}-bold`}>
          {count} {i18n('项')}
        </span>{' '}
        {i18n('已选择')}
      </div>
    );
  };

  const renderSummary = () => {
    return summaries?.map((item) => {
      const { name = '', value } = item || {};
      if (!name && !value) {
        return;
      }

      return (
        <div
          key={`${name}-${value}`}
          className={`${TOOLTIP_PREFIX_CLS}-summary-item`}
        >
          <span className={`${TOOLTIP_PREFIX_CLS}-summary-key`}>
            {name}（{i18n('总和')})
          </span>
          <span
            className={`${TOOLTIP_PREFIX_CLS}-summary-val ${TOOLTIP_PREFIX_CLS}-bold`}
          >
            {value}
          </span>
        </div>
      );
    });
  };

  return (
    <div className={`${TOOLTIP_PREFIX_CLS}-summary`}>
      {renderSelected()}
      {renderSummary()}
    </div>
  );
});

export default Summary;