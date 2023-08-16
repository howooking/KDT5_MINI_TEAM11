import { POSITIONS } from '@/data/constants';
import { Form, Select } from 'antd';

export default function SelectPosition() {
  const { Option } = Select;
  // 직급 선택 동적으로 생성 + 매니저 선택 옵션이 생기지 않게 filter를 이용해서 제거
  // key가 MANAGER가 아니면 통과
  const selectedPositionOptions = Object.keys(POSITIONS)
    .filter((key) => key !== 'MANAGER')
    .map((key) => {
      return (
        <Option key={key} value={key}>
          {POSITIONS[key].label}
        </Option>
      );
    });
  return (
    <>
      <Form.Item
        style={{ width: '50%' }}
        hasFeedback
        name="position"
        label="직급"
        rules={[{ required: true, message: '직급을 선택해주세요.' }]}
      >
        <Select
          placeholder="-직급-"
          style={{ width: 150, textAlign: 'center' }}
        >
          {selectedPositionOptions}
        </Select>
      </Form.Item>
    </>
  );
}
