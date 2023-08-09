import {
  Image,
  Descriptions,
  Skeleton,
  Input,
  Space,
  Button,
  message,
  Upload,
  Form,
  Badge,
} from 'antd';
import {
  EditOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import defaultProfile from '@/assets/defaultProfile.png';
import { POSITIONS } from '@/data/constants';
import formatPhoneNumber from '@/utils/formatPhonenumber';
import { useEffect, useState } from 'react';
import { getMyAccount } from '@/api/myAccount/getMyAccount';
import { useRecoilValue } from 'recoil';
import { AccessTokenAtom } from '@/recoil/AccessTokkenAtom';
import { changeMyInfo } from '@/api/myAccount/changeMyInfo';
import PasswordChangeModal from '@/page/myAccount/passwordChangeModal';
import { handleUpload } from '@/api/auth/cloudinary';

interface MyAccountInfoType {
  phoneNumber: string;
  position: string;
  profileThumbUrl: string;
  userEmail: string;
  userName: string;
  usedVacation: string;
}

export default function MyAccount() {
  const [myAccountInfo, setMyAccountInfo] = useState<MyAccountInfoType>({
    phoneNumber: '',
    position: '',
    profileThumbUrl: '',
    userEmail: '',
    userName: '',
    usedVacation: '',
  });

  // antd message(화면 상단에 뜨는 메세지)기능
  const [messageApi, contextHolder] = message.useMessage();

  const [editPhoneNumber, setEditPhoneNumber] = useState(false);
  const [editPhoneNumberInput, setEditPhonNumberInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editprofileThumbUrl, setEditProfileThumbUrl] = useState(false);

  const accessToken = useRecoilValue(AccessTokenAtom);

  useEffect(() => {
    const getData = async () => {
      if (!accessToken) {
        return;
      }
      try {
        const response = await getMyAccount();
        if (response.status === 200) {
          // 성공했을때
          const userData = response.data.response as MyAccountInfoType;
          setMyAccountInfo({
            phoneNumber: userData.phoneNumber,
            position: userData.position,
            profileThumbUrl: userData.profileThumbUrl,
            userEmail: userData.userEmail,
            userName: userData.userName,
            usedVacation: userData.usedVacation,
          });
          setEditPhonNumberInput(userData.phoneNumber);
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log('내 계정 데이터 로딩 실패 :', error);
      }
    };
    getData();
  }, [accessToken]);

  const handleChangeMyInfo = async () => {
    try {
      const response = await changeMyInfo({
        phoneNumber: editPhoneNumberInput,
      });
      if (response.status === 200) {
        setMyAccountInfo((prev) => ({
          ...prev,
          phoneNumber: editPhoneNumberInput,
        }));
        // 성공
        messageApi.open({
          type: 'success',
          content: '전화번호를 수정하였습니다.',
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content: error.response?.data.error.message || '전화번호를 수정실패',
      });
    } finally {
      setEditPhoneNumber(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeProfileImg = async (file: any) => {
    const imageUrl = await getImageUrl(file);
    console.log(imageUrl);
    try {
      const response = await changeMyInfo({
        profileThumbUrl: imageUrl,
      });
      if (response.status === 200) {
        setMyAccountInfo((prev) => ({
          ...prev,
          profileThumbUrl: imageUrl,
        }));
        // 성공
        messageApi.open({
          type: 'success',
          content: '프로필 이미지를 수정하였습니다.',
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content: error.response?.data.error.message || '프로필 이미지 수정실패',
      });
    } finally {
      setEditProfileThumbUrl(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getImageUrl = async (file: any) => {
    let imageUrl = null;

    try {
      if (file.profileThumbUrl && file.profileThumbUrl.length > 0) {
        const response = await handleUpload(
          file.profileThumbUrl[0].originFileObj,
        );
        if (response?.status === 200) {
          const data = response.data;
          imageUrl = data.url; // 이미지 URL을 받아옴
        } else {
          throw new Error('이미지 업로드에 실패하였습니다.');
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('이미지 업로드중 오류 :', error);
      messageApi.open({
        type: 'error',
        content: error.response?.data.error.message || '프로필 이미지 수정실패',
      });
      imageUrl = null; // 오류가 발생했으므로 imageUrl을 null로 설정
    }

    return imageUrl;
  };

  return (
    <div style={{ padding: 20 }}>
      {contextHolder}
      <Descriptions
        title="내 정보"
        bordered
        column={{ md: 2, sm: 1 }}
        size="small"
        labelStyle={{ textAlign: 'center' }}
      >
        <Descriptions.Item label="이름">
          {myAccountInfo.userName}
        </Descriptions.Item>
        <Descriptions.Item label="이메일">
          {myAccountInfo.userEmail}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              전화번호
              {editPhoneNumber ? (
                <CloseCircleOutlined
                  className="icons"
                  style={{ marginLeft: 5, fontSize: 15 }}
                  onClick={() => {
                    setEditPhoneNumber(false);
                    setEditPhonNumberInput(myAccountInfo.phoneNumber);
                  }}
                />
              ) : (
                <EditOutlined
                  onClick={() => {
                    setEditPhoneNumber(true);
                  }}
                  style={{ marginLeft: 5, fontSize: 15 }}
                  className="icons"
                />
              )}
            </>
          }
        >
          {editPhoneNumber ? (
            <>
              <Space.Compact>
                <Input
                  placeholder="-없이입력해주세요"
                  value={editPhoneNumberInput}
                  onChange={(e) => setEditPhonNumberInput(e.target.value)}
                />
                <Button type="primary" onClick={handleChangeMyInfo}>
                  수정
                </Button>
              </Space.Compact>
            </>
          ) : (
            <>{formatPhoneNumber(myAccountInfo.phoneNumber)}</>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="직급">
          <Badge
            color={POSITIONS[myAccountInfo.position]?.color}
            count={myAccountInfo.position}
          />
        </Descriptions.Item>
        <Descriptions.Item label="사용한 연차">
          {myAccountInfo.usedVacation}일
        </Descriptions.Item>
        <Descriptions.Item label="총 연차">
          {POSITIONS[myAccountInfo.position]?.total_vacation}일
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              사진
              {editprofileThumbUrl ? (
                <CloseCircleOutlined
                  className="icons"
                  style={{ marginLeft: 5, fontSize: 15 }}
                  onClick={() => {
                    setEditProfileThumbUrl(false);
                    setEditPhonNumberInput(myAccountInfo.phoneNumber);
                  }}
                />
              ) : (
                <EditOutlined
                  onClick={() => {
                    setEditProfileThumbUrl(true);
                  }}
                  style={{ marginLeft: 5, fontSize: 15 }}
                  className="icons"
                />
              )}
            </>
          }
        >
          {editprofileThumbUrl ? (
            <>
              <Form
                onFinish={handleChangeProfileImg}
                style={{
                  width: '200px',
                  height: '200px',
                  display: 'flex',

                  alignItems: 'center',
                  paddingTop: '22px',
                }}
              >
                <Form.Item
                  name="profileThumbUrl"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload
                    beforeUpload={() => false} /* showUploadList={false} */
                  >
                    <Button>
                      <PlusOutlined /> Click to Upload
                    </Button>
                  </Upload>
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ margin: '0 0 24px 5px' }}
                >
                  수정
                </Button>
              </Form>
            </>
          ) : (
            <>
              <Image
                placeholder={
                  <Skeleton.Image active style={{ width: 200, height: 200 }} />
                }
                rootClassName="profile_image"
                width={200}
                height={200}
                src={myAccountInfo.profileThumbUrl}
                fallback={defaultProfile}
              />
            </>
          )}
        </Descriptions.Item>
      </Descriptions>

      <Button
        type="primary"
        style={{
          margin: '10px 0px',
        }}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        비밀번호수정
      </Button>
      <PasswordChangeModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
