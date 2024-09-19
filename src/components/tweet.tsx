import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, deleteField, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";

const Tweet = ({ username, photo, tweet, userId, id }: ITweet) => {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [editTweet, setEditTweet] = useState(tweet);
  const onEdit = async () => {
    if (user?.uid !== userId || tweet.length > 300) return;
    try {
      if (isEditing) {
        await updateDoc(doc(db, "tweets", id), {
          tweet: editTweet,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsEditing((isEditing) => !isEditing);
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };

  const onDelete = async () => {
    const ok = confirm("트윗을 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const locationRef = ref(storage, `tweets/${user?.uid}/${id}`);
      const result = await uploadBytes(locationRef, files[0]);
      const url = await getDownloadURL(result.ref);
      await updateDoc(doc(db, "tweets", id), {
        photo: url,
      });
    }
  };

  const onFileDelete = async () => {
    const ok = confirm("사진을 삭제하시겠습니까?");
    if (!ok || !photo || user?.uid !== userId) return;
    try {
      await updateDoc(doc(db, "tweets", id), {
        photo: deleteField(),
      });
      const photoRef = ref(storage, `tweets/${userId}/${id}`);
      await deleteObject(photoRef);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <PayloadEdit
            onChange={onChange}
            rows={8}
            maxLength={300}
            value={editTweet}
          ></PayloadEdit>
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId ? (
          <ButtonsWrapper>
            <EditButton onClick={onEdit}>
              {isEditing ? "저장" : "편집하기"}
            </EditButton>
            <DeleteButton onClick={onDelete}>삭제</DeleteButton>
          </ButtonsWrapper>
        ) : null}
      </Column>
      <Column>
        <ButtonsWrapper>
          {photo ? (
            <DeleteButton onClick={onFileDelete}>삭제</DeleteButton>
          ) : (
            <>
              <AttachFileButton htmlFor="newFile">
                <svg
                  data-slot="icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z"
                  ></path>
                </svg>
              </AttachFileButton>
              <AttachFileInput
                onChange={onFileChange}
                type="file"
                id="newFile" // post-tweet-form의 input의 id와 겹칠 수 있으니 id명 변경. 그렇지 않으면 위의 라벨을 눌러 사진을 업로드하면 이곳에서 업로드 되는 것이 아니라 위의 제출 input에서 사진이 업로드 됨.
                accept="image/*"
              />
            </>
          )}
        </ButtonsWrapper>
        {photo ? <Photo src={photo} /> : null}
      </Column>
    </Wrapper>
  );
};

export default Tweet;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  grid-auto-rows: minmax(100px, auto);
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:last-child {
    align-items: flex-end;
    gap: 10px;
    flex-direction: column-reverse;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
  word-break: break-all; /* 텍스트가 넘칠 때 강제로 줄 바꿈 */
  line-height: 1.5;
`;

const PayloadEdit = styled.textarea`
  margin: 10px 0px;
  padding: 10px;
  width: 100%;
  height: auto;
  font-size: 18px;
  resize: none;
  background-color: black;
  color: white;
  border: 1px #1d9bf0 dashed;
  border-radius: 12px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const EditButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const AttachFileButton = styled.label`
  width: 25px;
  height: 25px;
  cursor: pointer;
  svg {
    fill: #1d9bf0;
  }
`;

const AttachFileInput = styled.input`
  display: none;
`;
