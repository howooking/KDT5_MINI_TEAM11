import { message, Form, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ImgUrlAtom } from '@/recoil/ImgUrlAtom';
import { useRecoilState } from 'recoil';

export default function ProfileImg() {
  const [imgUrl, setimgUrl] = useRecoilState(ImgUrlAtom);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const props = {
    showUploadList: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beforeUpload: (file: any) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('이미지 파일만 업로드할 수 있습니다!');
        return false;
      }
      if (imgUrl) {
        // 이미 이미지가 업로드되어 있다면 새로운 업로드 중지
        message.error('이미 사진이 업로드되었습니다!');
        return false;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setimgUrl(reader.result as string); // 미리보기를 위한 이미지 URL 설정
      return true;
    },
  };

  return (
    <>
      <Form.Item
        className="signup_profileImg"
        style={{ width: '50%' }}
        label="프로필"
        name="profileThumbUrl"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload listType="picture-card" {...props}>
          {imgUrl ? (
            <img src={imgUrl} alt="avatar" style={{ width: '100%' }} />
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </Form.Item>
    </>
  );
}
