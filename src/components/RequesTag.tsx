import { REQUEST_STATE } from '@/data/constants';
import { Tag } from 'antd';

export default function RequesTag({
  small,
  state,
}: {
  small?: boolean;
  state: 'APPROVE' | 'REJECT' | 'PENDING';
}) {
  return (
    <Tag
      color={REQUEST_STATE[state]?.color}
      style={{
        width: small ? 40 : 60,
        textAlign: 'center',
        fontSize: small ? 9 : 14,
      }}
    >
      {REQUEST_STATE[state]?.label}
    </Tag>
  );
}
